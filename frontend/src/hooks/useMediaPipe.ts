// src/hooks/useMediaPipe.ts
// @mediapipe/tasks-vision 기반 (PoseLandmarker / FaceLandmarker / HandLandmarker)

import { useEffect, useRef, useCallback } from 'react';
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
export const useMediaPipe = (
    videoRef: React.RefObject<HTMLVideoElement | null>, onFrame?: (data: OpenPoseData) => void
): { keypointsRef: React.RefObject<OpenPoseData | null> } => {
    const keypointsRef = useRef<OpenPoseData | null>(null);
    const isReadyRef = useRef(false);
    const onFrameRef = useRef(onFrame)

    const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
    const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
    const handLandmarkerRef = useRef<HandLandmarker | null>(null);
    const animFrameRef = useRef<number | null>(null);
    const lastVideoTimeRef = useRef<number>(-1);

    useEffect(() => {
        onFrameRef.current = onFrame;
    }, [onFrame]);

    // ── Task 초기화 ──
    useEffect(() => {
        const initTasks = async () => {
            const vision = await FilesetResolver.forVisionTasks(
                'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
            );

            const [pose, face, hand] = await Promise.all([
                PoseLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
                        delegate: 'CPU',
                    },
                    runningMode: 'VIDEO',
                    numPoses: 1,
                }),

                FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath:
                            'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
                        delegate: 'CPU',
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
                        delegate: 'CPU',
                    },
                    runningMode: 'VIDEO',
                    numHands: 2,
                }),
            ]);

            poseLandmarkerRef.current = pose;
            faceLandmarkerRef.current = face;
            handLandmarkerRef.current = hand;
            isReadyRef.current = true;
        };

        initTasks().catch((err) =>
            console.error('[useMediaPipe] Task 초기화 실패:', err)
        );

        // 클린업
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
            poseLandmarkerRef.current?.close();
            faceLandmarkerRef.current?.close();
            handLandmarkerRef.current?.close();
        };
    }, []);

    // 매 프레임 감지 루프
    const detect = useCallback(() => {
        const video = videoRef.current;
        if (
            !video ||
            video.readyState < 2 ||                      // 아직 프레임 없음
            video.currentTime === lastVideoTimeRef.current // 같은 프레임 중복 방지
        ) {
            animFrameRef.current = requestAnimationFrame(detect);
            return;
        }

        lastVideoTimeRef.current = video.currentTime;
        const timestamp = performance.now();

        const poseResult = poseLandmarkerRef.current?.detectForVideo(video, timestamp);
        const faceResult = faceLandmarkerRef.current?.detectForVideo(video, timestamp);
        const handResult = handLandmarkerRef.current?.detectForVideo(video, timestamp);

        // Pose 변환
        const rawPose = poseResult?.landmarks?.[0] ?? [];

        // Face 변환
        const rawFace = faceResult?.faceLandmarks?.[0] ?? [];

        // Hand 변환 (handedness로 좌/우 구분)
        let leftHand: Keypoint[] = [];
        let rightHand: Keypoint[] = [];

        handResult?.landmarks?.forEach((landmarks, i) => {
            const side = handResult.handedness?.[i]?.[0]?.categoryName;
            const kps: Keypoint[] = landmarks.map((lm) => ({
                x: lm.x,
                y: lm.y,
                visibility: 1,
            }));
            if (side === 'Left') leftHand = kps;
            else rightHand = kps;
        });

        const result: OpenPoseData = {
            pose: mapPoseLandmarks(rawPose),
            poseConnections: POSE_CONNECTIONS,
            leftHand,
            rightHand,
            handConnections: HAND_CONNECTIONS,
            face: rawFace.length > 0 ? mapFaceLandmarks(rawFace) : {},
        };

        keypointsRef.current = result;
        animFrameRef.current = requestAnimationFrame(detect);
        onFrameRef.current?.(result);
    }, [videoRef]);

    // 루프 시작 (마운트 즉시, isReady는 루프 내부에서 체크)
    useEffect(() => {
        animFrameRef.current = requestAnimationFrame(detect);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [detect]);

    return { keypointsRef };
};