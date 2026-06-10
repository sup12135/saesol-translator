# 수어 번역 시스템 백엔드
학습, 백엔드 구축 시 사용한 컴퓨터 사양

> CPU: AMD Ryzen 5 9600X  
> RAM: 36GB  
> VGB: NVIDIA GEFORCE RTX 4070 SUPER  
> SSD: WD_BLACK SN850X 1TB  
> OS: Windows 11  

# 사용 방법
### anaconda 환경을 이용하여 model.ipynb 파일을 통해 모델 학습
```
conda create -n 환경이름 python=3.10.20
conda activate 환경이름
python -m pip install -r clone위치/backend/requirements.txt
```
configs/에 있는 config.yaml을 이용하여 학습 환경 설정

### anaconda 환경을 이용하여 backend 실행
.env 파일 생성 후 GEMINI_API_KEY와 MODEL_WEIGHTS_PATH을 입력

```
GEMINI_API_KEY = API키  
MODEL_WEIGHTS_PATH = 모델 가중치 폴더 위치
```

.env 설정 후 실행
```
c:/Users/유저이름/.conda/envs/환경이름/python.exe main.py
```

# 학습 데이터
AI-HUB의 '수어 영상' 데이터를 이용하여 모델 학습

# 학습 데이터 가공
### 
dataset/data_processing에 있는 VideoConverter.exe, KeyframeBuilder.exe을 이용하여 1차 가공, exe 코드는 VideoConverter.py, KeyframeBuilder.py 참고    
dataset/data_processing에 있는 dataset.ipynb을 통해 데이터 셋 만들기