from pathlib import Path
import pandas as pd
import numpy as np
from tqdm import tqdm
import json
import os

real_sen_video_path = r"C:\Users\user\Downloads\수어 영상\1.Training\real_sen_224"
real_word_video_path = r"C:\Users\user\Downloads\수어 영상\1.Training\real_word_224"

real_sen_keypoint_path = r"C:\Users\user\Downloads\수어 영상\1.Training\real_sen_keypoint"
real_word_keypoint_path = r"C:\Users\user\Downloads\수어 영상\1.Training\real_word_keypoint"

real_sen_morpheme_path = r"C:\Users\user\Downloads\수어 영상\1.Training\real_sen_morpheme\01"
real_word_morpheme_path = r"C:\Users\user\Downloads\수어 영상\1.Training\real_word_morpheme\01"

dataset = []
sen_morpheme = {}
word_morpheme = {}

def extractWord(morpheme_data: json):
    result = []

    for idx in range(0, len(morpheme_data['data'])):
        word = morpheme_data['data'][idx]['attributes'][0]['name']
        result.append(word)

    return result

for senNum in range(1, 2001):
    for dire in ['U', 'D', 'F', 'L', 'R']:
        filename = f"NIA_SL_SEN{senNum:04d}_REAL01_{dire}_morpheme.json"
        morpheme_path = Path(f"{real_sen_morpheme_path}\{filename}")

        try:
            with open(morpheme_path, "r", encoding="utf-8") as f:
                morpheme = json.load(f)
        except Exception as e:
            raise Exception(f"json 파일 오류: {morpheme_path.name}")

        result = extractWord(morpheme)

        sen_morpheme[f"{senNum}_{dire}"] = result

for wordNum in range(1, 3001):
    for dire in ['U', 'D', 'F', 'L', 'R']:
        filename = f"NIA_SL_WORD{wordNum:04d}_REAL01_{dire}_morpheme.json"
        morpheme_path = Path(f"{real_word_morpheme_path}\{filename}")

        try:
            with open(morpheme_path, "r", encoding="utf-8") as f:
                morpheme = json.load(f)
        except Exception as e:
            raise Exception(f"json 파일 오류: {morpheme_path.name}")

        result = extractWord(morpheme)

        word_morpheme[f"{wordNum}_{dire}"] = result

for folderNum in range(1, 6):
    for senNum in range(1, 2001):
        for dire in ['U', 'D', 'F', 'L', 'R']:
            filename = f"NIA_SL_SEN{senNum:04d}_REAL{folderNum:02d}_{dire}"

            video_path = Path(f"{real_sen_video_path}\{folderNum:02d}\{filename}_224.mp4")
            keypoint_path = Path(f"{real_sen_keypoint_path}\{folderNum:02d}_merged\{filename}.csv")

            dataset.append({
                "video_path": str(video_path) if video_path.exists() else None,
                "keypoint_path": str(keypoint_path) if keypoint_path.exists() else None,
                "morpheme": sen_morpheme[f'{senNum}_{dire}']
            })


for folderNum in range(1, 6):
    for wordNum in range(1, 3001):
        for dire in ['U', 'D', 'F', 'L', 'R']:
            filename = f"NIA_SL_WORD{wordNum:04d}_REAL{folderNum:02d}_{dire}"

            video_path = Path(f"{real_word_video_path}\{folderNum:02d}\{filename}_224.mp4")
            keypoint_path = Path(f"{real_word_keypoint_path}\{folderNum:02d}_merged\{filename}.csv")

            dataset.append({
                "video_path": str(video_path) if video_path.exists() else None,
                "keypoint_path": str(keypoint_path) if keypoint_path.exists() else None,
                "morpheme": word_morpheme[f'{wordNum}_{dire}']
            })


print(pd.DataFrame(dataset))
