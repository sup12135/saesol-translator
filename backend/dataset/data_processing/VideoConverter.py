import subprocess
from pathlib import Path
import imageio_ffmpeg as ffmpeg
from tqdm import tqdm

print("VideoConverter")

# 처리할 확장자
video_extensions = {".mp4"}

ffmpeg_path = ffmpeg.get_ffmpeg_exe()

while True:
    input_dir = Path(input("폴더 경로를 입력하세요(절대경로로): ").strip('"'));
    output_dir = input_dir.parent / f"{input_dir.name}_224" 

    output_dir.mkdir(parents=True, exist_ok=True)

    # 처리할 영상 목록 미리 수집
    video_files = [
        path for path in input_dir.rglob("*")
        if path.is_file() and path.suffix.lower() in video_extensions
    ]

    # 전체 진행률 표시
    for input_path in tqdm(video_files, desc="전체 영상 처리", unit="video"):
        relative_path = input_path.relative_to(input_dir)

        output_path = output_dir / relative_path
        output_path = output_path.with_name(f"{output_path.stem}_224.mp4")

        output_path.parent.mkdir(parents=True, exist_ok=True)

        ffmpeg_command = [
            ffmpeg_path,
            "-i", str(input_path),
            "-vf",
            "crop=min(iw\\,ih):min(iw\\,ih):(iw-min(iw\\,ih))/2:(ih-min(iw\\,ih))/2,scale=224:224",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-y",
            str(output_path)
        ]

        try:
            subprocess.run(
                ffmpeg_command,
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL
            )
        except subprocess.CalledProcessError:
            tqdm.write(f"실패: {input_path}")
            continue

    print("모든 영상 처리 완료")

    again = input("\n다른 폴더도 처리하시겠습니까? (y/n): ").strip().lower()

    if again not in ["y", "yes"]:
        print("프로그램을 종료합니다.")
        break
