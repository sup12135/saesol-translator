// src/hooks/useMediaPipe.ts
// @mediapipe/tasks-vision 기반 (PoseLandmarker / FaceLandmarker / HandLandmarker)

import { useEffect, useRef, useCallback, useState } from 'react';
import {
    FilesetResolver,
    PoseLandmarker,
    FaceLandmarker,
    HandLandmarker,
    type NormalizedLandmark,
} from '@mediapipe/tasks-vision';
import {
    POSE_LANDMARK_POINTS,
    POSE_CONNECTIONS,
    HAND_CONNECTIONS,
    FACE_LANDMARK_POINTS,
    type LandmarkIndex,
} from '../constants/mediapipeConfig';

export interface Keypoint {
    x: number;           // 정규화 좌표 (0~1)
    y: number;
    visibility?: number;
}

export interface OpenPoseData {
    pose: (Keypoint | null)[];                      // 25개 (OpenPose 기준)
    poseConnections: [number, number][];
    leftHand: Keypoint[];                           // 21개
    rightHand: Keypoint[];                          // 21개
    handConnections: [number, number][];
    face: Record<string, (Keypoint | null)[]>;      // 파트별 얼굴 키포인트
}

interface MediaPipeOptions {
    stabilizeHands?: boolean;
    faceZoomFallback?: boolean;
    maxFps?: number;
}

interface DetectCurrentFrameOptions {
    enforceInterval?: boolean;
    skipDuplicateVideoTime?: boolean;
    emitCallback?: boolean;
    sourceVideo?: HTMLVideoElement | null;
}

type HandSide = 'Left' | 'Right';
type HandCandidate = {
    points: Keypoint[];
    sideHint?: HandSide;
};

const resolveLandmark = (
    landmarks: NormalizedLandmark[],
    index: LandmarkIndex
): Keypoint | null => {
    if (!landmarks || landmarks.length === 0) return null;

    // 배열이면 두 점의 평균 좌표 계산
    if (Array.isArray(index)) {
        const [i1, i2] = index;
        const p1 = landmarks[i1];
        const p2 = landmarks[i2];
        if (!p1 || !p2) return null;
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
            visibility: Math.min(p1.visibility ?? 1, p2.visibility ?? 1),
        };
    }

    // 단일 인덱스
    const p = landmarks[index];
    if (!p) return null;
    return { x: p.x, y: p.y, visibility: p.visibility };
};

const mapPoseLandmarks = (
    landmarks: NormalizedLandmark[]
): (Keypoint | null)[] => {
    return POSE_LANDMARK_POINTS.map((index) => resolveLandmark(landmarks, index));
};

const mapFaceLandmarks = (
    landmarks: NormalizedLandmark[]
): Record<string, (Keypoint | null)[]> => {
    const result: Record<string, (Keypoint | null)[]> = {};
    for (const [part, indices] of Object.entries(FACE_LANDMARK_POINTS)) {
        result[part] = indices.map((index) => {
            const kp = resolveLandmark(landmarks, index);
            if (!kp) return null;
            return { ...kp, visibility: 1 };
        });
    }
    return result;
};

// 커스텀 훅
const sq = (n: number) => n * n;

const distSq = (a: Keypoint, b: Keypoint): number => {
    return sq(a.x - b.x) + sq(a.y - b.y);
};

const getWrist = (hand: Keypoint[]): Keypoint | null => {
    if (!hand || hand.length === 0) return null;
    return hand[0] ?? null;
};

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

const buildFaceRoiFromPose = (pose: NormalizedLandmark[]): { x: number; y: number; w: number; h: number } | null => {
    if (!pose || pose.length === 0) return null;
    const nose = pose[0];
    const lEar = pose[7];
    const rEar = pose[8];
    const lShoulder = pose[11];
    const rShoulder = pose[12];
    if (!nose || !lShoulder || !rShoulder) return null;

    const shoulderDx = lShoulder.x - rShoulder.x;
    const shoulderDy = lShoulder.y - rShoulder.y;
    const shoulderDist = Math.hypot(shoulderDx, shoulderDy);

    let earDist = shoulderDist * 0.7;
    if (lEar && rEar) {
        earDist = Math.hypot(lEar.x - rEar.x, lEar.y - rEar.y);
    }

    const roiW = Math.max(earDist * 1.8, shoulderDist * 0.9, 0.18);
    const roiH = roiW * 1.2;
    const cx = nose.x;
    const cy = nose.y - roiH * 0.08;

    const x = clamp01(cx - roiW * 0.5);
    const y = clamp01(cy - roiH * 0.5);
    const w = Math.min(roiW, 1 - x);
    const h = Math.min(roiH, 1 - y);

    if (w <= 0 || h <= 0) return null;
    return { x, y, w, h };
};

const stabilizeHands = (
    candidates: HandCandidate[],
    prevLeftWrist: Keypoint | null,
    prevRightWrist: Keypoint | null
): { leftHand: Keypoint[]; rightHand: Keypoint[] } => {
    if (candidates.length === 0) return { leftHand: [], rightHand: [] };

    if (candidates.length === 1) {
        const c = candidates[0];
        const wrist = getWrist(c.points);

        if (c.sideHint === 'Left') return { leftHand: c.points, rightHand: [] };
        if (c.sideHint === 'Right') return { leftHand: [], rightHand: c.points };

        if (wrist && prevLeftWrist && prevRightWrist) {
            const dL = distSq(wrist, prevLeftWrist);
            const dR = distSq(wrist, prevRightWrist);
            return dL <= dR ? { leftHand: c.points, rightHand: [] } : { leftHand: [], rightHand: c.points };
        }

        return wrist && wrist.x <= 0.5 ? { leftHand: c.points, rightHand: [] } : { leftHand: [], rightHand: c.points };
    }

    const c0 = candidates[0];
    const c1 = candidates[1];
    const w0 = getWrist(c0.points);
    const w1 = getWrist(c1.points);
    if (!w0 || !w1) return { leftHand: c0.points, rightHand: c1.points };

    const score = (left: HandCandidate, right: HandCandidate): number => {
        let s = 0;
        const lw = getWrist(left.points);
        const rw = getWrist(right.points);
        if (!lw || !rw) return Number.POSITIVE_INFINITY;

        if (prevLeftWrist) s += distSq(lw, prevLeftWrist);
        if (prevRightWrist) s += distSq(rw, prevRightWrist);

        if (left.sideHint && left.sideHint !== 'Left') s += 0.03;
        if (right.sideHint && right.sideHint !== 'Right') s += 0.03;
        return s;
    };

    const scoreKeep = score(c0, c1);
    const scoreSwap = score(c1, c0);
    return scoreSwap < scoreKeep
        ? { leftHand: c1.points, rightHand: c0.points }
        : { leftHand: c0.points, rightHand: c1.points };
};

export const useMediaPipe = (
    videoRef: React.RefObject<HTMLVideoElement | null>,
    onFrame?: (data: OpenPoseData) => void,
    options?: MediaPipeOptions
): {
    keypointsRef: React.MutableRefObject<OpenPoseData | null>;
    isModelReady: boolean;
    detectCurrentFrame: (options?: DetectCurrentFrameOptions) => OpenPoseData | null;
} => {
    const keypointsRef = useRef<OpenPoseData | null>(null);
    const isReadyRef = useRef(false);
    const [isModelReady, setIsModelReady] = useState(false);
    const onFrameRef = useRef(onFrame);
    const prevLeftWristRef = useRef<Keypoint | null>(null);
    const prevRightWristRef = useRef<Keypoint | null>(null);
    const faceCropCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const lastInferMsRef = useRef(0);
    const fallbackCountRef = useRef(0);
    const lastLoopErrorLogMsRef = useRef(0);

    const stabilizeHandsEnabled = options?.stabilizeHands ?? true;
    const faceZoomFallbackEnabled = options?.faceZoomFallback ?? true;
    const maxFps = options?.maxFps ?? 30;
    const minInferIntervalMs = Math.max(1, Math.floor(1000 / maxFps));

    const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const lastVideoTimeMapRef = useRef<WeakMap<HTMLVideoElement, number>>(new WeakMap());

    useEffect(() => {
        onFrameRef.current = onFrame;
    }, [onFrame]);

    // ── Task 초기화 ──
    useEffect(() => {
        const createLandmarkers = async (delegateName: 'GPU' | 'CPU') => {
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
            );

            return Promise.all([
                PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
                        delegate: delegateName,
                    },
                    runningMode: 'VIDEO',
                    numPoses: 1,
                }),

                FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                        delegate: delegateName,
                    },
                    runningMode: 'VIDEO',
                    numFaces: 1,
                    outputFaceBlendshapes: false,
                    outputFacialTransformationMatrixes: false,
                }),

                HandLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
                        delegate: delegateName,
                    },
                    runningMode: 'VIDEO',
                    numHands: 2,
                }),
            ]);
        };

        const initTasks = async () => {
            let pose: PoseLandmarker;
            let face: FaceLandmarker;
            let hand: HandLandmarker;
            try {
                [pose, face, hand] = await createLandmarkers('GPU');
                console.log('[useMediaPipe] GPU delegate enabled');
            } catch (gpuErr) {
                console.warn('[useMediaPipe] GPU delegate init failed, fallback to CPU:', gpuErr);
                [pose, face, hand] = await createLandmarkers('CPU');
                console.log('[useMediaPipe] CPU delegate enabled');
            }

            poseLandmarkerRef.current = pose;
            faceLandmarkerRef.current = face;
            handLandmarkerRef.current = hand;
            isReadyRef.current = true;
            setIsModelReady(true);
        };

        initTasks().catch((err) =>
            console.error('[useMediaPipe] Task 초기화 실패:', err)
        );

        // 클린업
        return () => {
            isReadyRef.current = false;
            setIsModelReady(false);
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            poseLandmarkerRef.current?.close();
            faceLandmarkerRef.current?.close();
            handLandmarkerRef.current?.close();
        };
    }, []);

    const detectCurrentFrame = useCallback((options?: DetectCurrentFrameOptions): OpenPoseData | null => {
        try {
            const video = options?.sourceVideo ?? videoRef.current;
            const enforceInterval = options?.enforceInterval ?? false;
            const skipDuplicateVideoTime = options?.skipDuplicateVideoTime ?? false;
            const emitCallback = options?.emitCallback ?? true;

            if (
                !video ||
                !isReadyRef.current ||
                video.readyState < 2 // 아직 프레임 없음
            ) {
                return null;
            }

            if (skipDuplicateVideoTime) {
                const lastVideoTime = lastVideoTimeMapRef.current.get(video);
                if (lastVideoTime === video.currentTime) {
                    return null;
                }
            }

            const nowMs = performance.now();
            if (enforceInterval && nowMs - lastInferMsRef.current < minInferIntervalMs) {
                return null;
            }
            lastInferMsRef.current = nowMs;
            lastVideoTimeMapRef.current.set(video, video.currentTime);
            const timestamp = nowMs;

            const poseResult = poseLandmarkerRef.current?.detectForVideo(video, timestamp);
            const faceResult = faceLandmarkerRef.current?.detectForVideo(video, timestamp);
            const handResult = handLandmarkerRef.current?.detectForVideo(video, timestamp);

            // Pose 변환
            const rawPose = poseResult?.landmarks?.[0] ?? [];

            // Face 변환
            let rawFace = faceResult?.faceLandmarks?.[0] ?? [];
            if (
                faceZoomFallbackEnabled &&
                rawFace.length === 0 &&
                rawPose.length > 0 &&
                video.videoWidth > 0 &&
                video.videoHeight > 0
            ) {
                try {
                    fallbackCountRef.current += 1;
                    const shouldTryFallback = fallbackCountRef.current % 5 === 0;
                    if (shouldTryFallback) {
                        const roi = buildFaceRoiFromPose(rawPose);
                        if (roi) {
                            const cropCanvas = faceCropCanvasRef.current ?? document.createElement('canvas');
                            faceCropCanvasRef.current = cropCanvas;
                            const cropW = 384;
                            const cropH = 384;
                            cropCanvas.width = cropW;
                            cropCanvas.height = cropH;

                            const ctx = cropCanvas.getContext('2d');
                            if (ctx) {
                                const sx = roi.x * video.videoWidth;
                                const sy = roi.y * video.videoHeight;
                                const sw = roi.w * video.videoWidth;
                                const sh = roi.h * video.videoHeight;
                                ctx.drawImage(video, sx, sy, sw, sh, 0, 0, cropW, cropH);

                                const fallbackFaceResult = faceLandmarkerRef.current?.detectForVideo(cropCanvas, timestamp + 1);
                                const fallbackFace = fallbackFaceResult?.faceLandmarks?.[0] ?? [];
                                if (fallbackFace.length > 0) {
                                    rawFace = fallbackFace.map((lm) => ({
                                        x: roi.x + lm.x * roi.w,
                                        y: roi.y + lm.y * roi.h,
                                        z: lm.z,
                                        visibility: 1,
                                    })) as NormalizedLandmark[];
                                }
                            }
                        }
                    }
                } catch {
                    // fallback 실패는 실시간 성능을 위해 무시
                }
            }

            // Hand 변환 (handedness로 좌/우 구분)
            const candidates: HandCandidate[] = [];
            handResult?.landmarks?.forEach((landmarks, i) => {
                const side = handResult.handedness?.[i]?.[0]?.categoryName as HandSide | undefined;
                const points: Keypoint[] = landmarks.map((lm) => ({
                    x: lm.x,
                    y: lm.y,
                    visibility: 1,
                }));
                candidates.push({
                    points,
                    sideHint: side === 'Left' || side === 'Right' ? side : undefined,
                });
            });

            let leftHand: Keypoint[] = [];
            let rightHand: Keypoint[] = [];
            if (stabilizeHandsEnabled) {
                const stabilized = stabilizeHands(
                    candidates,
                    prevLeftWristRef.current,
                    prevRightWristRef.current
                );
                leftHand = stabilized.leftHand;
                rightHand = stabilized.rightHand;
            } else {
                candidates.forEach((c) => {
                    if (c.sideHint === 'Left') leftHand = c.points;
                    else if (c.sideHint === 'Right') rightHand = c.points;
                });
            }

            prevLeftWristRef.current = getWrist(leftHand);
            prevRightWristRef.current = getWrist(rightHand);

            const result: OpenPoseData = {
                pose: mapPoseLandmarks(rawPose),
                poseConnections: POSE_CONNECTIONS,
                leftHand,
                rightHand,
                handConnections: HAND_CONNECTIONS,
                face: rawFace.length > 0 ? mapFaceLandmarks(rawFace) : {},
            };

            keypointsRef.current = result;
            if (emitCallback) {
                onFrameRef.current?.(result);
            }
            return result;
        } catch (err) {
            const now = performance.now();
            if (now - lastLoopErrorLogMsRef.current > 2000) {
                lastLoopErrorLogMsRef.current = now;
                console.error('[useMediaPipe] detect 루프 오류:', err);
            }
            return null;
        }
    }, [faceZoomFallbackEnabled, stabilizeHandsEnabled, minInferIntervalMs, videoRef]);

    // 매 프레임 감지 루프
    const detect = useCallback(() => {
        try {
            detectCurrentFrame({
                enforceInterval: true,
                skipDuplicateVideoTime: true,
                emitCallback: true,
            });
        } finally {
            animFrameRef.current = requestAnimationFrame(detect);
        }
    }, [detectCurrentFrame]);

    // 루프 시작 (마운트 즉시, isReady는 루프 내부에서 체크)
    useEffect(() => {
        animFrameRef.current = requestAnimationFrame(detect);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [detect]);

    return { keypointsRef, isModelReady, detectCurrentFrame };
};
