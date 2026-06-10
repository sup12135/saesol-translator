import uvicorn
from fastapi import FastAPI, UploadFile, File, Form
import tempfile
import os
import shutil
from datetime import datetime
from dataset import create_infer_data, video_convert_224
from google import genai
import pandas as pd
import time
import json
import numpy as np
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware

DEBUG_SAVE_DIR = r"./debug_log"
DEBUG_SAVE_REQUEST_ARTIFACTS = True

# 형태소 추론 신뢰도 설정
CTC_BLANK_INDEX = 0
CTC_FRAME_MAX_PROB_THRESHOLD = 0.45
CTC_MEAN_MAX_PROB_THRESHOLD = 0.55

# cudnn64_8.dll을 잡기 위한 코드
TF_GPU_DLL_DIR = r"C:\Users\user\.conda\envs\tf_gpu\Library\bin"
os.environ["PATH"] = TF_GPU_DLL_DIR + os.pathsep + os.environ.get("PATH", "")

# 모델 패키지
import tensorflow as tf
from model.mainModel import make_model
import utils as utils

# GPU 설정
gpus = tf.config.list_physical_devices('GPU')
if gpus:
    for gpu in gpus:
        tf.config.experimental.set_memory_growth(gpu, True)
    print(f"GPU {len(gpus)}개 사용 중")
tf.keras.mixed_precision.set_global_policy("mixed_float16")

config = utils.load_config("./configs/config.yaml")

#단어 사전, 모델 불러오기
vocabulary = utils.Vocabulary.load_csv(config['vocabulary']['path'])
sign_model = make_model(len(vocabulary.vocab))
sign_model.load_weights(r"C:\Python_exam\model_weight\sign_model(finetune)_7.weights.h5")

client = genai.Client(api_key="AIzaSyAHDB-1u-5UNsHffrVzbhXhWVR_19BZqCM")

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.0.1:5173",
    "http://yungjin702.iptime.org:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = """
앞에서부터 순서가 있는 단어 배열을 입력으로 주면 해당 단어들을 자연스러운 문장으로 만들어.
단어 중 '무엇'이라는 단어 앞 뒤에 '곳'이라는 단어가 오면 위치를 물어보는 의문문이야.
입력이 한글 자모 배열(초성, 중성, 종성)인 경우 반드시 올바른 한글 음절로 조합하고 자모는 순서를 유지한다.
대답은 만들어진 문장 혹은 단어만 출력해.

예시: ['엘리베이터', '무엇', '곳']
입력: 엘리베이터는 어디에 있습니까?

예시:
입력: ['ㄱ', 'ㅏ', 'ㄴ']
출력: 간

입력: ['ㄱ', 'ㅏ', 'ㄹ', 'ㅏ', 'ㄱ', 'ㄹ', 'ㅗ']
출력: 가락로
"""

async def inter_morpheme(video, keypoint):
    if video.ndim != 4:
        raise ValueError(f"video shape must be [T,224,224,3], got {video.shape}")
    if keypoint.ndim != 2:
        raise ValueError(f"keypoint shape must be [T,381], got {keypoint.shape}")
    
    t = min(len(video), len(keypoint))
    if t == 0:
        return []
    
    video_in = tf.convert_to_tensor(video[None, ...])      # [1,T,224,224,3]
    keypoint_in = tf.convert_to_tensor(keypoint[None, ...])# [1,T,411]
    
    logits = sign_model([video_in, keypoint_in], training=False)
    
    batch_size = tf.shape(logits)[0]
    time_steps = tf.shape(logits)[1]

    input_length = tf.fill([batch_size], tf.cast(time_steps, tf.int32))

    if logits.ndim != 3:
        raise ValueError(f"model output must be rank-3 [B,T,V], got shape {logits.shape}")

    logits_fp32 = tf.cast(logits, tf.float32)
    probs = tf.nn.softmax(logits_fp32, axis=-1)
    frame_max_prob = tf.reduce_max(probs, axis=-1)  # [B, T]
    mean_max_prob = float(tf.reduce_mean(frame_max_prob).numpy())

    low_conf_mask = frame_max_prob < CTC_FRAME_MAX_PROB_THRESHOLD  # [B, T]
    vocab_size = tf.shape(logits_fp32)[-1]
    blank_logits = tf.one_hot(
        CTC_BLANK_INDEX,
        depth=vocab_size,
        on_value=tf.constant(12.0, dtype=tf.float32),
        off_value=tf.constant(-12.0, dtype=tf.float32),
        dtype=tf.float32,
    )

    blank_logits = tf.reshape(blank_logits, [1, 1, -1])
    filtered_logits = tf.where(low_conf_mask[..., tf.newaxis], blank_logits, logits_fp32)

    low_conf_ratio = float(tf.reduce_mean(tf.cast(low_conf_mask, tf.float32)).numpy())
    print(
        f"[CTC] mean_max_prob={mean_max_prob:.4f}, "
        f"frame_th={CTC_FRAME_MAX_PROB_THRESHOLD:.2f}, "
        f"seq_th={CTC_MEAN_MAX_PROB_THRESHOLD:.2f}, "
        f"low_conf_ratio={low_conf_ratio:.3f}"
    )
    if mean_max_prob < CTC_MEAN_MAX_PROB_THRESHOLD:
        print("[CTC] low confidence sequence skipped")
        return []

    hyps = utils.decode_ctc_greedy_from_logits(
        filtered_logits,
        input_length,
        blank_index=CTC_BLANK_INDEX,
    )[0]
    
    morphemes = []
    for morpheme in hyps:
        morphemes.append(vocabulary.itos(morpheme))
    
    return morphemes

async def create_sentence(sentence: str):
    result = ""

    stream = client.models.generate_content_stream(
        model="gemini-3.1-flash-lite",
        contents=sentence,
        config=genai.types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            temperature=0.1,
            max_output_tokens=64
        )
    )

    for chunk in stream:
        if chunk.text:
            result += chunk.text

    return result.strip()

@app.get("/")
async def root():
    start = time.perf_counter()
    
    try:        
        return {"message": "Welcome"}
    
    except Exception as e:
        print(e)
        return {"message": "error"}
    
    finally:
        end = time.perf_counter()
        print(f"걸린 시간: {end - start:.4f}초")
        
@app.post("/request_sentence", summary="수어를 문장으로 변환 요청(번역)", response_description="문장으로 변환하여 전달")
async def predict(
    video: UploadFile = File(None, description="수어 영상"),
    keypoints: Optional[str] = Form(None),
    keypoints_file: Optional[UploadFile] = File(None, description="키포인트 JSON 파일"),
):    
    start = time.perf_counter()
    
    temp_video = None
    temp_csv = None
    video_224_path = None
    
    try:
        if video is None:
            raise ValueError("video is required")
        ext = os.path.splitext(video.filename)[1] or ".webm"

        # 업로드 원본 바이트를 한 번만 읽고, temp/debug 저장에 재사용
        video_bytes = await video.read()
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp:
            temp.write(video_bytes)
            temp_video = temp.name
            
        with tempfile.NamedTemporaryFile(delete=False, suffix=".csv") as temp:
            temp_csv = temp.name

        if keypoints_file is not None:
            keypoints_bytes = await keypoints_file.read()
            if not keypoints_bytes:
                raise ValueError("keypoints_file is empty")
 
            keypoints_list = json.loads(keypoints_bytes.decode("utf-8-sig"))
        else:
            if not keypoints:
                raise ValueError("keypoints or keypoints_file is required")
            keypoints_list = json.loads(keypoints)

        keypoints_array = np.asarray(keypoints_list, dtype=np.float32)

        debug_video_path: Optional[str] = None
        debug_video_224_path: Optional[str] = None
        debug_keypoint_csv_path: Optional[str] = None
        
        #디버그용으로 전달 받은 영상, 키포인트 데이터를 DEBUG_SAVE_DIR에 하기 위한 경로 설정
        if DEBUG_SAVE_REQUEST_ARTIFACTS:
            os.makedirs(DEBUG_SAVE_DIR, exist_ok=True)
            stem = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
            debug_video_path = os.path.join(DEBUG_SAVE_DIR, f"{stem}_orig{ext}")
            debug_video_224_path = os.path.join(DEBUG_SAVE_DIR, f"{stem}_224.mp4")
            debug_keypoint_csv_path = os.path.join(DEBUG_SAVE_DIR, f"{stem}.csv")
            with open(debug_video_path, "wb") as f:
                f.write(video_bytes)


        pd.DataFrame(keypoints_array).to_csv(temp_csv, index=False)
        if debug_keypoint_csv_path:
            pd.DataFrame(keypoints_array).to_csv(debug_keypoint_csv_path, index=False)

        video_224_path = video_convert_224(temp_video)
        if debug_video_224_path and video_224_path and os.path.exists(video_224_path):
            shutil.copy2(str(video_224_path), debug_video_224_path)

        video_data, keypoints_data = create_infer_data(str(video_224_path), temp_csv)        
        
        morphemes = await inter_morpheme(video_data, keypoints_data)
        infer_time = time.perf_counter()
        print(f"추론 시간: {infer_time - start}")
        
        sentence = ''
        if(len(morphemes) == 1):
            sentence = morphemes[0]
        elif(len(morphemes) > 1):
            sentence = await create_sentence(str(morphemes))
            
        llm_api_time = time.perf_counter()
        print(f"llm 요청 완료 시간: {llm_api_time - infer_time}")
        
        return {"result": "GOOD", "sentence": sentence, "morpheme": morphemes}
    except Exception as e:
        print(e)
        return {"result": "ERROR", "error_code": 1}
    
    finally:
        end = time.perf_counter()
        print(f"걸린 시간: {end - start:.4f}초")
        
        if temp_video and os.path.exists(temp_video):
            os.remove(temp_video)
            
        if video_224_path and os.path.exists(video_224_path):
            os.remove(video_224_path)
            
        if temp_csv and os.path.exists(temp_csv):
            os.remove(temp_csv)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=47100,
    )
