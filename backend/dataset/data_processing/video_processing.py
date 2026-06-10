import subprocess
from pathlib import Path

import imageio_ffmpeg as ffmpeg

def video_convert_224(video_path: str | Path) -> Path:
    ffmpeg_path = ffmpeg.get_ffmpeg_exe()

    input_path = Path(video_path)
    # 입력 확장자와 무관하게 h.264/mp4로 고정해 ffmpeg 코덱 불일치 문제를 피한다.
    output_path = input_path.with_name(input_path.stem + "_224.mp4")
    vf_chain = "crop=min(iw\\,ih):min(iw\\,ih):(iw-min(iw\\,ih))/2:(ih-min(iw\\,ih))/2,scale=224:224"

    ffmpeg_command = [
        ffmpeg_path,
        "-i", str(input_path),
        "-vf",
        vf_chain,
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "23",
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
        return output_path

    except subprocess.CalledProcessError:
        print(f"\n224 video 가공 실패: {input_path}")
        raise
