// src/hooks/useRecorder.ts

import { useRef, useCallback } from 'react';
import type { OpenPoseData } from './useMediaPipe';

// 상수
const TRIGGER_DURATION = 1.0;  // 손 감지 유지 시간 (초)
const STOP_GRACE = 0.5;  // 손 소실 후 유예 시간 (초)
const MIME_TYPE = 'video/webm;codecs=vp8';
const BACKEND_URL = 'http://127.0.0.1:8000/predict';

// 각 파트별 키포인트 수
const PART_COUNT = {
    face: 70,
    pose: 25,
    left: 21,
    right: 21,
} as const;

// 전체 컬럼 수: (70 + 25 + 21 + 21) * 3 = 411
const TOTAL_COLS = (PART_COUNT.face + PART_COUNT.pose + PART_COUNT.left + PART_COUNT.right) * 3;

const FHD_W = 1920;
const FHD_H = 1080;

// 한 프레임의 키포인트 행: 411개 숫자
type KeypointRow = number[];

// 전체 녹화의 키포인트: 프레임 수 × 411
type KeypointFrames = KeypointRow[];

// face → pose → left_hand → right_hand 순서
// 각 포인트: x, y, visibility
const extractRow = (data: OpenPoseData): KeypointRow => {
    const row: number[] = [];

    // face: 파트별로 나뉜 키포인트를 순서대로 펼침
    const facePoints = Object.values(data.face).flat();
    for (let i = 0; i < PART_COUNT.face; i++) {
        const kp = facePoints[i];
        row.push((kp?.x ?? 0) * FHD_W, (kp?.y ?? 0) * FHD_H, kp?.visibility ?? 0);
    }

    // pose: 25개
    for (let i = 0; i < PART_COUNT.pose; i++) {
        const kp = data.pose[i];
        row.push((kp?.x ?? 0) * FHD_W, (kp?.y ?? 0) * FHD_H, kp?.visibility ?? 0);
    }

    // left_hand: 21개
    for (let i = 0; i < PART_COUNT.left; i++) {
        const kp = data.leftHand[i];
        row.push((kp?.x ?? 0) * FHD_W, (kp?.y ?? 0) * FHD_H, kp?.visibility ?? 0);
    }

    // right_hand: 21개
    for (let i = 0; i < PART_COUNT.right; i++) {
        const kp = data.rightHand[i];
        row.push((kp?.x ?? 0) * FHD_W, (kp?.y ?? 0) * FHD_H, kp?.visibility ?? 0);
    }

    // 혹시 길이가 맞지 않으면 0으로 패딩
    while (row.length < TOTAL_COLS) row.push(0);

    return row.slice(0, TOTAL_COLS);
};

// 서버 전송
const sendToBackend = async (videoBlob: Blob, keypoints: KeypointFrames) => {
    const formData = new FormData();
    formData.append('video', videoBlob, 'sign_video.webm');
    formData.append('keypoints', JSON.stringify(keypoints));

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            body: formData,
        });
        const result = await response.json();
        console.log('[Recorder] 서버 응답:', result);
        return result;
    } catch (err) {
        console.error('[Recorder] 서버 전송 실패:', err);
    }
};

// 커스텀 훅
export const useRecorder = (streamRef: React.RefObject<MediaStream | null>) => {
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoChunksRef = useRef<Blob[]>([]);
    const keypointFramesRef = useRef<KeypointFrames>([]);
    const isRecordingRef = useRef(false);

    // 손 감지 타이머
    const handSinceRef = useRef<number | null>(null);  // 최초 감지 시각
    const lostSinceRef = useRef<number | null>(null);  // 소실 시작 시각

    // 녹화 시작
    const startRecording = useCallback(() => {
        if (isRecordingRef.current || !streamRef.current) return;

        videoChunksRef.current = [];
        keypointFramesRef.current = [];

        // MIME 타입 미지원 시 예외 방지
        const mimeType = MediaRecorder.isTypeSupported(MIME_TYPE)
            ? MIME_TYPE
            : 'video/webm';
        const recorder = new MediaRecorder(streamRef.current, { mimeType });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) videoChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
            const videoBlob = new Blob(videoChunksRef.current, { type: MIME_TYPE });
            await sendToBackend(videoBlob, keypointFramesRef.current);
            
            // 디버그 코드
            // // ── 영상 다운로드 ──
            // const videoUrl = URL.createObjectURL(videoBlob);
            // const videoLink = document.createElement('a');
            // videoLink.href = videoUrl;
            // videoLink.download = 'sign_video.webm';
            // videoLink.click();
            // URL.revokeObjectURL(videoUrl);

            // // ── 키포인트 JSON 다운로드 ──
            // const jsonBlob = new Blob(
            //     [JSON.stringify(keypointFramesRef.current)],
            //     { type: 'application/json' }
            // );
            // const jsonUrl = URL.createObjectURL(jsonBlob);
            // const jsonLink = document.createElement('a');
            // jsonLink.href = jsonUrl;
            // jsonLink.download = 'keypoints.json';
            // jsonLink.click();
            // URL.revokeObjectURL(jsonUrl);

            videoChunksRef.current = [];
            keypointFramesRef.current = [];
        };

        recorder.start(100); // 100ms 단위로 chunk 수집
        mediaRecorderRef.current = recorder;
        isRecordingRef.current = true;
        console.log('[Recorder] 녹화 시작');
    }, [streamRef]);

    // 녹화 종료
    const stopRecording = useCallback(() => {
        if (!isRecordingRef.current) return;
        mediaRecorderRef.current?.stop();
        isRecordingRef.current = false;
        console.log('[Recorder] 녹화 종료');
    }, []);

    // 매 프레임 호출: 손 감지 여부로 상태 제어
    const update = useCallback((keypointsData: OpenPoseData | null) => {
        const now = performance.now() / 1000; // 초 단위
        const handDetected =
            (keypointsData?.leftHand.length ?? 0) > 0 ||
            (keypointsData?.rightHand.length ?? 0) > 0;

        if (handDetected) {
            lostSinceRef.current = null; // 유예 타이머 리셋

            if (handSinceRef.current === null) {
                handSinceRef.current = now;
            }

            // TRIGGER_DURATION 이상 감지 → 녹화 시작
            if (now - handSinceRef.current >= TRIGGER_DURATION && !isRecordingRef.current) {
                startRecording();
            }
        } else {
            if (!isRecordingRef.current) {
                handSinceRef.current = null;
                return;
            }

            if (lostSinceRef.current === null) {
                lostSinceRef.current = now;
            }

            // STOP_GRACE 이상 소실 → 녹화 종료
            if (now - lostSinceRef.current >= STOP_GRACE) {
                handSinceRef.current = null;
                lostSinceRef.current = null;
                stopRecording();
            }
        }

        // 녹화 중이면 현재 프레임 키포인트 수집
        if (isRecordingRef.current && keypointsData) {
            keypointFramesRef.current.push(extractRow(keypointsData));
        }
    }, [startRecording, stopRecording]);

    // 강제 종료 (컴포넌트 언마운트 등)
    const stop = useCallback(() => {
        handSinceRef.current = null;
        lostSinceRef.current = null;
        if (isRecordingRef.current) stopRecording();
    }, [stopRecording]);

    return { update, stop, isRecordingRef };
};
