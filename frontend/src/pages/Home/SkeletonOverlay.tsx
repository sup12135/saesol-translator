// src/pages/Home/SkeletonOverlay.tsx

import { useEffect, useRef } from 'react';
import type { OpenPoseData, Keypoint } from '../../hooks/useMediaPipe';

interface SkeletonOverlayProps {
  keypointsRef?: React.RefObject<OpenPoseData | null>; 
  videoRef: React.RefObject<HTMLVideoElement | null>;
  mirrored?: boolean;
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

const mapToContain = (
  x: number,
  y: number,
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number
): { x: number; y: number } => {
  if (srcW <= 0 || srcH <= 0) {
    return { x: x * dstW, y: y * dstH };
  }
  const scale = Math.min(dstW / srcW, dstH / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;
  const offsetX = (dstW - drawW) * 0.5;
  const offsetY = (dstH - drawH) * 0.5;
  return {
    x: x * drawW + offsetX,
    y: y * drawH + offsetY,
  };
};

// Pose 드로잉
const drawPose = (
  ctx: CanvasRenderingContext2D,
  pose: (Keypoint | null)[],
  connections: [number, number][],
  w: number,
  h: number,
  srcW: number,
  srcH: number
) => {
  // 연결선 먼저 (점 아래에 깔리도록)
  connections.forEach(([i1, i2]) => {
    const p1 = pose[i1];
    const p2 = pose[i2];
    if (!p1 || !p2) return;
    const m1 = mapToContain(p1.x, p1.y, srcW, srcH, w, h);
    const m2 = mapToContain(p2.x, p2.y, srcW, srcH, w, h);
    drawLine(ctx, m1.x, m1.y, m2.x, m2.y, COLOR.POSE_LINE, LINE_WIDTH.POSE);
  });

  // 관절 점
  pose.forEach((kp) => {
    if (!kp) return;
    const m = mapToContain(kp.x, kp.y, srcW, srcH, w, h);
    drawPoint(ctx, m.x, m.y, POINT_RADIUS.POSE, COLOR.POSE_POINT);
  });
};

// Face 드로잉
const drawFace = (
  ctx: CanvasRenderingContext2D,
  face: Record<string, (Keypoint | null)[]>,
  w: number,
  h: number,
  srcW: number,
  srcH: number
) => {
  Object.values(face).forEach((partPoints) => {
    partPoints.forEach((kp) => {
      if (!kp) return;
      const m = mapToContain(kp.x, kp.y, srcW, srcH, w, h);
      drawPoint(ctx, m.x, m.y, POINT_RADIUS.FACE, COLOR.FACE_POINT);
    });
  });
};

// Hand 드로잉
const drawHand = (
  ctx: CanvasRenderingContext2D,
  hand: Keypoint[],
  connections: [number, number][],
  w: number,
  h: number,
  srcW: number,
  srcH: number
) => {
  if (hand.length === 0) return;

  // 연결선
  connections.forEach(([i1, i2]) => {
    const p1 = hand[i1];
    const p2 = hand[i2];
    if (!p1 || !p2) return;
    const m1 = mapToContain(p1.x, p1.y, srcW, srcH, w, h);
    const m2 = mapToContain(p2.x, p2.y, srcW, srcH, w, h);
    drawLine(ctx, m1.x, m1.y, m2.x, m2.y, COLOR.HAND_LINE, LINE_WIDTH.HAND);
  });

  // 관절 점
  hand.forEach((kp) => {
    const m = mapToContain(kp.x, kp.y, srcW, srcH, w, h);
    drawPoint(ctx, m.x, m.y, POINT_RADIUS.HAND, COLOR.HAND_POINT);
  });
};

const SkeletonOverlay = ({ keypointsRef, videoRef, mirrored = true }: SkeletonOverlayProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!keypointsRef) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

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
        const srcW = videoRef.current?.videoWidth ?? 0;
        const srcH = videoRef.current?.videoHeight ?? 0;

        // 드로잉 순서: Pose → Face → Hand
        drawPose(ctx, data.pose, data.poseConnections, w, h, srcW, srcH);
        drawFace(ctx, data.face, w, h, srcW, srcH);
        drawHand(ctx, data.leftHand, data.handConnections, w, h, srcW, srcH);
        drawHand(ctx, data.rightHand, data.handConnections, w, h, srcW, srcH);
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [keypointsRef, videoRef]);

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
        transform: mirrored ? 'scaleX(-1)' : 'none',
        zIndex: 10 // 비디오 요소보다 무조건 위에 배치
      }}
    />
  );
};

export default SkeletonOverlay;
