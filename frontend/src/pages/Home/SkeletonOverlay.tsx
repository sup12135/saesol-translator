// src/pages/Home/SkeletonOverlay.tsx

import { useEffect, useRef } from 'react';
import type { OpenPoseData, Keypoint } from '../../hooks/useMediaPipe';

// 키포인트 담당자 가이드:
// 부모 컴포넌트(Home/index.tsx)로부터 실시간 데이터(예: [{x, y, visibility}, ...])를 
// keypointsData Props로 전달받도록 설계되어 있습니다.
interface SkeletonOverlayProps {
  keypointsRef?: React.RefObject<OpenPoseData | null>; 
}

const COLOR = {
  POSE_POINT: 'rgb(0, 255, 0)',
  POSE_LINE: 'rgb(0, 100, 255)',
  FACE_POINT: 'rgb(255, 255, 255)',
  HAND_POINT: 'rgb(255, 0, 0)',
  HAND_LINE: 'rgb(0, 255, 0)',
} as const;

const POINT_RADIUS = {
  POSE: 5,
  FACE: 2,
  HAND: 4,
} as const;

const LINE_WIDTH = {
  POSE: 2,
  HAND: 2,
} as const;

// ─────────────────────────────────────────
// 드로잉 유틸
// ─────────────────────────────────────────

const drawPoint = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) => {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
};

const drawLine = (
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number,
  x2: number, y2: number,
  color: string,
  lineWidth: number
) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
};

// ─────────────────────────────────────────
// 각 파트 드로잉 함수
// ─────────────────────────────────────────

const drawPose = (
  ctx: CanvasRenderingContext2D,
  pose: (Keypoint | null)[],
  connections: [number, number][],
  w: number,
  h: number
) => {
  // 연결선 먼저 (점 아래에 깔리도록)
  connections.forEach(([i1, i2]) => {
    const p1 = pose[i1];
    const p2 = pose[i2];
    if (!p1 || !p2) return;
    drawLine(ctx, p1.x * w, p1.y * h, p2.x * w, p2.y * h, COLOR.POSE_LINE, LINE_WIDTH.POSE);
  });

  // 관절 점
  pose.forEach((kp) => {
    if (!kp) return;
    drawPoint(ctx, kp.x * w, kp.y * h, POINT_RADIUS.POSE, COLOR.POSE_POINT);
  });
};

const drawFace = (
  ctx: CanvasRenderingContext2D,
  face: Record<string, (Keypoint | null)[]>,
  w: number,
  h: number
) => {
  Object.values(face).forEach((partPoints) => {
    partPoints.forEach((kp) => {
      if (!kp) return;
      drawPoint(ctx, kp.x * w, kp.y * h, POINT_RADIUS.FACE, COLOR.FACE_POINT);
    });
  });
};

const drawHand = (
  ctx: CanvasRenderingContext2D,
  hand: Keypoint[],
  connections: [number, number][],
  w: number,
  h: number
) => {
  if (hand.length === 0) return;

  // 연결선
  connections.forEach(([i1, i2]) => {
    const p1 = hand[i1];
    const p2 = hand[i2];
    if (!p1 || !p2) return;
    drawLine(ctx, p1.x * w, p1.y * h, p2.x * w, p2.y * h, COLOR.HAND_LINE, LINE_WIDTH.HAND);
  });

  // 관절 점
  hand.forEach((kp) => {
    drawPoint(ctx, kp.x * w, kp.y * h, POINT_RADIUS.HAND, COLOR.HAND_POINT);
  });
};

const SkeletonOverlay = ({ keypointsRef }: SkeletonOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!keypointsRef) return;

      // 캔버스 해상도를 레이아웃 크기와 동기화
      if (
        canvas.width !== canvas.clientWidth ||
        canvas.height !== canvas.clientHeight
      ) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      // 실시간 드로잉을 위해 매 프레임마다 이전 그림 지우기
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const data = keypointsRef.current;
      if (data) {
        const w = canvas.width;
        const h = canvas.height;

        // 드로잉 순서: Pose → Face → Hand
        drawPose(ctx, data.pose, data.poseConnections, w, h);
        drawFace(ctx, data.face, w, h);
        drawHand(ctx, data.leftHand, data.handConnections, w, h);
        drawHand(ctx, data.rightHand, data.handConnections, w, h);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

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