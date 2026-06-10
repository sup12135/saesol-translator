from pathlib import Path
import json
import pandas as pd
import numpy as np
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
import os

print("KeyframeBuilder")

extension = {".json"}

def merge_keyFrame(folder_path):

    #추출할 keyframe 이름
    extract_names = [
        'face_keypoints_2d', 
        'pose_keypoints_2d', 
        'hand_left_keypoints_2d', 
        'hand_right_keypoints_2d'
    ]

    #folder_path 내에 있는 모든 json 파일 찾고 이름 순으로 정렬
    keyframe_files = sorted([
        path for path in folder_path.rglob("*")
        if path.is_file() and path.suffix.lower() in extension
    ])

    result = []

    for keyframe_file in keyframe_files:
        try:
            with open(keyframe_file, "r", encoding="utf-8") as f:
                keyframe = json.load(f)
        except Exception as e:
            raise Exception(f"json 파일 오류: {keyframe_file.name}")

        extract = []

        for extract_name in extract_names:
            extract.extend(keyframe['people'].get(extract_name, []))
        
        result.append(extract)
        
    result = pd.DataFrame(result)

    result.to_csv(output_dir / f"{folder_path.name}.csv", index=False)

    # CSV 저장이 끝난 뒤 JSON 파일 삭제
    for keyframe_file in keyframe_files:
        try:
            keyframe_file.unlink()
        except Exception as e:
            tqdm.write(f"{keyframe_file} 삭제 실패: {e}")

    folder_path.rmdir()

    return folder_path.name

while True:
    input_dir = Path(input("폴더 경로를 입력하세요(절대경로로): ").strip('"'));
    output_dir = input_dir.parent / f"{input_dir.name}_merged"

    folder_paths = [folder for folder in input_dir.iterdir() if folder.is_dir()]

    output_dir.mkdir(parents=True, exist_ok=True)

    max_workers = min(16, (os.cpu_count() or 1) * 2)

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {
            executor.submit(merge_keyFrame, folder_path): folder_path
            for folder_path in folder_paths
        }

        for future in tqdm(
            as_completed(futures),
            total=len(futures),
            desc="전체 폴더 진행률",
            unit="file"
        ):
            try:
                folder_path_name = futures[future].name
                future.result()
            except Exception as e:
                tqdm.write(f"{folder_path_name} 실패 -> {str(e)}")
                continue

    again = input("\n다른 폴더도 처리하시겠습니까? (y/n): ").strip().lower()

    if again not in ["y", "yes"]:
        print("프로그램을 종료합니다.")
        break