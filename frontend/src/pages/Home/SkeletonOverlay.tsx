// src/pages/Home/SkeletonOverlay.tsx

import { useEffect, useRef } from 'react';

// 키포인트 담당자 가이드:
// 부모 컴포넌트(Home/index.tsx)로부터 실시간 데이터(예: [{x, y, visibility}, ...])를 
// keypointsData Props로 전달받도록 설계되어 있습니다.
interface SkeletonOverlayProps {
  keypointsData?: any; 
}

const SkeletonOverlay = ({ keypointsData }: SkeletonOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 하위 캔버스의 그리기 해상도를 상위 element 레이아웃 크기와 1:1로 동기화
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // 실시간 드로잉을 위해 매 프레임마다 이전 그림 싹 지우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // =======================================================
    // [키포인트 구현부] 수어 인식 모델/프론트 담당자 구현 영역
    // =======================================================
    if (keypointsData) {
      /*
        -------------------------------------------------------
        💡 [팀원 가이드] 여기에 실시간 캔버스 드로잉 로직을 작성하시면 됩니다!
        -------------------------------------------------------
        밑바닥 CameraView 컴포넌트에 거울 모드(scaleX(-1))가 적용되어 있어서,
        이 Canvas 엘리먼트에도 동일하게 CSS로 scaleX(-1) 처리가 되어 있습니다.
        
        따라서 가져오시는 좌표 데이터(API/웹소켓)가 '이미 좌우 반전이 된 데이터'라면 
        그리기 전에 캔버스 너비(canvas.width) 기준 반전 연산이 필요할 수 있습니다.

        [예시 코드 스니펫]
        
        1. 점(관절) 그리기 예시:
        keypointsData.landmarks?.forEach((point: any) => {
          // 영상 크기에 맞게 좌표 스케일링 (0~1 사이 정규화 데이터일 경우)
          const x = point.x * canvas.width;
          const y = point.y * canvas.height;

          ctx.beginPath();
          ctx.arc(x, y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = '#00ff88'; // 가시성 좋은 형광 그린 추천
          ctx.fill();
        });

        2. 선(뼈대) 연결 예시:
        if (keypointsData.connections) {
          ctx.strokeStyle = '#00ffff'; // 시안(하늘색) 선
          ctx.lineWidth = 3;
          
          keypointsData.connections.forEach(([p1_idx, p2_idx]: number[]) => {
            const p1 = keypointsData.landmarks[p1_idx];
            const p2 = keypointsData.landmarks[p2_idx];
            
            if (p1 && p2) {
              ctx.beginPath();
              ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
              ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
              ctx.stroke();
            }
          });
        }
      */
    }
  }, [keypointsData]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // 마우스 이벤트를 무시하고 비디오 클릭이 가능하도록 설정
        transform: 'scaleX(-1)', // CameraView와 거울 모드 방향 일치
        zIndex: 10 // 비디오 요소보다 무조건 위에 배치
      }}
    />
  );
};

export default SkeletonOverlay;