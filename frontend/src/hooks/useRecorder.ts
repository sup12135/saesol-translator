// src/hooks/useRecorder.ts

import { useRef, useCallback, useState } from 'react';
import type { OpenPoseData, Keypoint } from './useMediaPipe';

const MIME_CANDIDATES = [
    'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
    'video/mp4',
    'video/webm;codecs=vp8',
    'video/webm',
] as const;
export const BACKEND_URL = 'http://yungjin702.iptime.org:47100/request_sentence';

// 녹화 시작/종료 판단 상수
const READY_HOLD_SEC = 0.5;
const READY_MISS_GRACE_SEC = 0.35;
const MISSING_STOP_GRACE_SEC = 1.0;
const STILL_STOP_SEC = 1.0;
const MOTION_START_THRESHOLD_PX = 11;
const MOTION_STOP_THRESHOLD_PX = 8;
const MOTION_START_FRAMES = 1;

const LANDSCAPE_SIZE: [number, number] = [1920, 1080];
const PORTRAIT_SIZE: [number, number] = [1080, 1920];

type OutputOrientation = 'landscape' | 'portrait' | 'auto';
type RecorderPhase = 'idle' | 'ready' | 'recording';

export interface RecorderStatus {
    phase: RecorderPhase;
    motionPx: number;
    outputSize: [number, number];
}

interface UseRecorderParams {
    streamRef: React.RefObject<MediaStream | null>;
    videoRef?: React.RefObject<HTMLVideoElement | null>;
    outputOrientation?: OutputOrientation;
    onBackendResult?: (response: unknown) => void;
}

// 백엔드 전송 키포인트 레이아웃
const PART_COUNT = {
    face: 70,
    pose: 25,
    left: 21,
    right: 21,
} as const;

const TOTAL_COLS = (PART_COUNT.face + PART_COUNT.pose + PART_COUNT.left + PART_COUNT.right) * 3;

type KeypointRow = number[];
export type KeypointFrames = KeypointRow[];

// 이상치 제거를 위한 p 백분위수 값 반환
const percentile = (values: number[], p: number): number => {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const pos = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)));
    return sorted[pos];
};

// 키포인트 행 생성을 위한 키포인트 픽셀 좌표 변환
const asPointForRow = (kp: Keypoint | null | undefined, w: number, h: number): [number, number, number] => {
    if (!kp) return [Number.NaN, Number.NaN, Number.NaN];
    return [kp.x * w, kp.y * h, kp.visibility ?? 1];
};

// 모션 벡터 생성을 위한 키포인트 픽셀 좌표 변환
const asPointForMotion = (kp: Keypoint | null | undefined, w: number, h: number): [number, number, number] => {
    if (!kp) return [0, 0, 0];
    return [kp.x * w, kp.y * h, kp.visibility ?? 1];
};

// 키포인트 벡터 직렬화
export const extractKeypointRow = (data: OpenPoseData, outW: number, outH: number): KeypointRow => {
    const row: number[] = [];

    const facePoints = Object.values(data.face).flat();
    for (let i = 0; i < PART_COUNT.face; i++) {
        const [x, y, v] = asPointForRow(facePoints[i], outW, outH);
        row.push(x, y, v);
    }

    for (let i = 0; i < PART_COUNT.pose; i++) {
        const [x, y, v] = asPointForRow(data.pose[i], outW, outH);
        row.push(x, y, v);
    }

    for (let i = 0; i < PART_COUNT.left; i++) {
        const [x, y, v] = asPointForRow(data.leftHand[i], outW, outH);
        row.push(x, y, v);
    }

    for (let i = 0; i < PART_COUNT.right; i++) {
        const [x, y, v] = asPointForRow(data.rightHand[i], outW, outH);
        row.push(x, y, v);
    }

    while (row.length < TOTAL_COLS) row.push(0);
    return row.slice(0, TOTAL_COLS);
};

// 포즈, 얼굴, 손 키포인트가 모두 감지되었는지 확인
const isFullyDetected = (data: OpenPoseData): boolean => {
    const poseOk = data.pose.length >= PART_COUNT.pose && data.pose.every((p) => !!p);
    const leftOk = data.leftHand.length >= PART_COUNT.left;
    const rightOk = data.rightHand.length >= PART_COUNT.right;
    const faceCount = Object.values(data.face).flat().filter((kp) => !!kp).length;
    const faceOk = faceCount >= PART_COUNT.face;
    return poseOk && leftOk && rightOk && faceOk;
};

// 모션 추정에 사용할 포즈, 손 픽셀 좌표 벡터 생성
const buildMotionVector = (data: OpenPoseData, outW: number, outH: number): [number, number, number][] => {
    const points: [number, number, number][] = [];

    for (let i = 0; i < PART_COUNT.pose; i++) {
        points.push(asPointForMotion(data.pose[i], outW, outH));
    }
    for (let i = 0; i < PART_COUNT.left; i++) {
        points.push(asPointForMotion(data.leftHand[i], outW, outH));
    }
    for (let i = 0; i < PART_COUNT.right; i++) {
        points.push(asPointForMotion(data.rightHand[i], outW, outH));
    }

    return points;
};

// 빈 구간 선형 보간 수행
export const interpolateFrames = (frames: KeypointFrames): KeypointFrames => {
    if (frames.length === 0) return [];

    const rowCount = frames.length;
    const colCount = TOTAL_COLS;
    const out = frames.map((row) => {
        const copied = row.slice(0, colCount);
        while (copied.length < colCount) copied.push(Number.NaN);
        return copied;
    });

    for (let col = 0; col < colCount; col++) {
        const known: number[] = [];
        for (let r = 0; r < rowCount; r++) {
            const v = out[r][col];
            if (Number.isFinite(v)) known.push(r);
        }

        if (known.length === 0) {
            for (let r = 0; r < rowCount; r++) out[r][col] = 0;
            continue;
        }

        const firstIdx = known[0];
        const lastIdx = known[known.length - 1];
        const firstVal = out[firstIdx][col];
        const lastVal = out[lastIdx][col];

        // 유효 구간 밖은 경계값 처리
        for (let r = 0; r < firstIdx; r++) out[r][col] = firstVal;
        for (let r = lastIdx + 1; r < rowCount; r++) out[r][col] = lastVal;

        // 유효 구간 내 선형 보간
        for (let i = 0; i < known.length - 1; i++) {
            const s = known[i];
            const e = known[i + 1];
            const sv = out[s][col];
            const ev = out[e][col];
            const gap = e - s;
            if (gap <= 1) continue;
            for (let r = s + 1; r < e; r++) {
                const t = (r - s) / gap;
                out[r][col] = sv + (ev - sv) * t;
            }
        }
    }

    // 잔여 빈 값 제거
    for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < colCount; c++) {
            if (!Number.isFinite(out[r][c])) out[r][c] = 0;
        }
    }

    return out;
};

// 모션 벡터 간 이동 거리 반환
const estimateMotionPx = (
    prevPoints: [number, number, number][] | null,
    curPoints: [number, number, number][]
): number => {
    if (!prevPoints || prevPoints.length !== curPoints.length) return 0;

    const dists: number[] = [];
    for (let i = 0; i < curPoints.length; i++) {
        const [x0, y0, v0] = prevPoints[i];
        const [x1, y1, v1] = curPoints[i];
        if (v0 <= 0 || v1 <= 0) continue;
        dists.push(Math.hypot(x1 - x0, y1 - y0));
    }
    return percentile(dists, 0.9);
};

// 실제 비디오 비율을 고려해 출력 해상도 결정
export const resolveOutputSize = (
    mode: OutputOrientation,
    videoRef?: React.RefObject<HTMLVideoElement | null>
): [number, number] => {
    if (mode === 'landscape') return LANDSCAPE_SIZE;
    if (mode === 'portrait') return PORTRAIT_SIZE;

    const vw = videoRef?.current?.videoWidth ?? 0;
    const vh = videoRef?.current?.videoHeight ?? 0;
    if (vw > 0 && vh > 0 && vw < vh) return PORTRAIT_SIZE;
    return LANDSCAPE_SIZE;
};

// MIME 타입 확인
const getExtFromMimeType = (mimeType: string): string => {
    return mimeType.includes('mp4') ? 'mp4' : 'webm';
};

// 브라우저가 지원하는 첫 번째 MIME 타입 반환
const resolveRecorderMimeType = (): string => {
    for (const mime of MIME_CANDIDATES) {
        if (MediaRecorder.isTypeSupported(mime)) return mime;
    }
    return '';
};

// 비디오 Blob과 키포인트 프레임을 백엔드에 전송
export const sendToBackend = async (videoBlob: Blob, keypoints: KeypointFrames, videoExt: string) => {
    const formData = new FormData();
    formData.append('video', videoBlob, `sign_video.${videoExt}`);
    const keypointsJson = JSON.stringify(keypoints);
    const keypointsBlob = new Blob([keypointsJson], { type: 'application/json' });
    formData.append('keypoints_file', keypointsBlob, 'keypoints.json');

    try {
        const response = await fetch(BACKEND_URL, { method: 'POST', body: formData });
        const result = await response.json();
        console.log('[Recorder] 서버 응답:', result);
        return result;
    } catch (err) {
        console.error('[Recorder] 서버 전송 실패:', err);
    }
};

// 녹화 관리
export const useRecorder = ({
    streamRef,
    videoRef,
    outputOrientation = 'auto',
    onBackendResult,
}: UseRecorderParams) => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoChunksRef = useRef<Blob[]>([]);
    const keypointFramesRef = useRef<KeypointFrames>([]);
    const isRecordingRef = useRef(false);

    // 녹화 시작/종료 타이밍 판단용 타임스탬프
    const readySinceRef = useRef<number | null>(null);
    const readyLostSinceRef = useRef<number | null>(null);
    const missingSinceRef = useRef<number | null>(null);
    const stillSinceRef = useRef<number | null>(null);
    const movingFramesRef = useRef(0);

    const prevMotionPointsRef = useRef<[number, number, number][] | null>(null);
    const outputSizeRef = useRef<[number, number]>(LANDSCAPE_SIZE);

    const [status, setStatus] = useState<RecorderStatus>({
        phase: 'idle',
        motionPx: 0,
        outputSize: LANDSCAPE_SIZE,
    });

    // 상태가 실제로 변경될 때만 렌더링
    const setPhase = useCallback((phase: RecorderPhase, motionPx?: number) => {
        setStatus((prev) => {
            const nextMotion = motionPx ?? prev.motionPx;
            const nextOutput = outputSizeRef.current;
            if (
                prev.phase === phase &&
                prev.motionPx === nextMotion &&
                prev.outputSize[0] === nextOutput[0] &&
                prev.outputSize[1] === nextOutput[1]
            ) {
                return prev;
            }
            return { phase, motionPx: nextMotion, outputSize: nextOutput };
        });
    }, []);

    // 녹화 시작
    const startRecording = useCallback(() => {
        if (isRecordingRef.current || !streamRef.current) return;

        videoChunksRef.current = [];
        keypointFramesRef.current = [];

        const resolvedMimeType = resolveRecorderMimeType();
        const recorder = resolvedMimeType
            ? new MediaRecorder(streamRef.current, { mimeType: resolvedMimeType })
            : new MediaRecorder(streamRef.current);
        const finalMimeType = resolvedMimeType || recorder.mimeType || 'video/webm';
        const videoExt = getExtFromMimeType(finalMimeType);

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) videoChunksRef.current.push(e.data);
        };

        // 녹화 종료 시 키 포인트 보간 후 백엔드 전송
        recorder.onstop = async () => {
            const videoBlob = new Blob(videoChunksRef.current, { type: finalMimeType });
            const interpolated = interpolateFrames(keypointFramesRef.current);
            const response = await sendToBackend(videoBlob, interpolated, videoExt);
            onBackendResult?.(response);
            videoChunksRef.current = [];
            keypointFramesRef.current = [];
        };

        recorder.start(100);
        mediaRecorderRef.current = recorder;
        isRecordingRef.current = true;
        setPhase('recording');
        console.log('[Recorder] 녹화 시작');
    }, [onBackendResult, setPhase, streamRef]);

    // 녹화 종료
    const stopRecording = useCallback(() => {
        if (!isRecordingRef.current) return;
        mediaRecorderRef.current?.stop();
        isRecordingRef.current = false;
        setPhase('idle', 0);
        console.log('[Recorder] 녹화 종료');
    }, [setPhase]);

    // 준비 상태 초기화
    const resetReadyState = useCallback(() => {
        readySinceRef.current = null;
        readyLostSinceRef.current = null;
    }, []);

    // 매 프레임 호출
    const update = useCallback((keypointsData: OpenPoseData | null) => {
        const now = performance.now() / 1000;
        outputSizeRef.current = resolveOutputSize(outputOrientation, videoRef);
        const [outW, outH] = outputSizeRef.current;

        // 키포인트가 없는 경우 녹화 중이면 소실 타이머 시작
        if (!keypointsData) {
            if (isRecordingRef.current) {
                if (missingSinceRef.current === null) missingSinceRef.current = now;
                if (now - missingSinceRef.current >= MISSING_STOP_GRACE_SEC) {
                    stopRecording();
                }
            }
            setPhase(isRecordingRef.current ? 'recording' : 'idle', 0);
            return;
        }

        missingSinceRef.current = null;

        // 전신 감지 여부에 따라 준비 타이머 관리
        const fullDetected = isFullyDetected(keypointsData);
        if (fullDetected) {
            readyLostSinceRef.current = null;
            if (readySinceRef.current === null) readySinceRef.current = now;
        } else {
            if (readyLostSinceRef.current === null) readyLostSinceRef.current = now;
            if (readyLostSinceRef.current !== null && now - readyLostSinceRef.current >= READY_MISS_GRACE_SEC) {
                resetReadyState();
            }
        }

        // 준비 상태 확인
        const isReady = readySinceRef.current !== null && (now - readySinceRef.current) >= READY_HOLD_SEC;

        // 모션 벡터 및 이동 거리 계산
        const motionPoints = buildMotionVector(keypointsData, outW, outH);
        const motionPx = estimateMotionPx(prevMotionPointsRef.current, motionPoints);
        prevMotionPointsRef.current = motionPoints;

        if (!isRecordingRef.current) {
            if (isReady) {
                // 준비 상태에서 연속 모션 감지 시 녹화 시작
                if (motionPx >= MOTION_START_THRESHOLD_PX) {
                    movingFramesRef.current += 1;
                } else {
                    movingFramesRef.current = 0;
                }
                if (movingFramesRef.current >= MOTION_START_FRAMES) {
                    startRecording();
                    movingFramesRef.current = 0;
                    stillSinceRef.current = null;
                } else {
                    setPhase('ready', motionPx);
                }
            } else {
                movingFramesRef.current = 0;
                setPhase('idle', motionPx);
            }
        } else {
            // 녹화 중 정지 지속 시 녹화 종료
            if (motionPx <= MOTION_STOP_THRESHOLD_PX) {
                if (stillSinceRef.current === null) stillSinceRef.current = now;
                if (now - stillSinceRef.current >= STILL_STOP_SEC) {
                    stopRecording();
                }
            } else {
                stillSinceRef.current = null;
            }
            setPhase('recording', motionPx);
        }

        if (isRecordingRef.current) {
            keypointFramesRef.current.push(extractKeypointRow(keypointsData, outW, outH));
        }
    }, [outputOrientation, resetReadyState, setPhase, startRecording, stopRecording, videoRef]);

    // 녹화 중단
    const stop = useCallback(() => {
        resetReadyState();
        missingSinceRef.current = null;
        stillSinceRef.current = null;
        movingFramesRef.current = 0;
        prevMotionPointsRef.current = null;
        if (isRecordingRef.current) stopRecording();
        setPhase('idle', 0);
    }, [resetReadyState, setPhase, stopRecording]);

    return { update, stop, isRecordingRef, status };
};
