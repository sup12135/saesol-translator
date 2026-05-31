// src/pages/Home/index.tsx (SL_SC_01)

import { useState, useRef, useEffect, useCallback, type ChangeEvent } from 'react';
import HomeSkeleton from './HomeSkeleton';
import CameraView from './CameraView';
import SubtitleArea from './SubtitleArea';
import SkeletonOverlay from './SkeletonOverlay';
import SkeletonStatusBadge from './SkeletonStatusBadge';
import { useShortcut } from '../../hooks/UseShortcut';
import { useHomeLoading } from '../../hooks/useHomeLoading';
import { type OpenPoseData, useMediaPipe } from '../../hooks/useMediaPipe';
import { extractKeypointRow, interpolateFrames, resolveOutputSize, sendToBackend, useRecorder } from '../../hooks/useRecorder';
import { styles } from './Home.style'; 

type BackendPredictResponse = {
  result?: string;
  sentence?: string;
  morpheme?: string[];
  error_code?: number;
};

function Home() {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [inputMode, setInputMode] = useState<'camera' | 'video'>('camera');
  const [videoFileUrl, setVideoFileUrl] = useState('');
  const [videoStatus, setVideoStatus] = useState<'idle' | 'playing' | 'sending' | 'done' | 'error'>('idle');
  const [translatedText, setTranslatedText] = useState('번역 준비 완료');
  const [systemMsg, setSystemMsg] = useState('카메라 앞에서 수어를 시작하면 자동으로 인식합니다.');

  // videoRef 생성 위치 변경
  const videoRef = useRef<HTMLVideoElement>(null);

  // streamRef 추가, useRecorder에 전달
  const streamRef = useRef<MediaStream | null>(null);
  const selectedFileRef = useRef<File | null>(null);
  const fileFrameRowsRef = useRef<number[][]>([]);
  const sendingRef = useRef(false);
  
  const applyBackendResponse = useCallback((response: unknown, source: 'camera' | 'video') => {
    const res = response as BackendPredictResponse | undefined;

    if (!res || res.result !== 'GOOD') {
      setTranslatedText('번역 실패');
      const code = res?.error_code ?? 'unknown';
      setSystemMsg(`백엔드 처리 실패 (${source}, error_code=${code})`);
      return;
    }

    const sentence = typeof res.sentence === 'string' ? res.sentence.trim() : '';
    const morpheme = Array.isArray(res.morpheme) ? res.morpheme.join(' ') : '';
    const normalizedSentence = sentence && sentence !== '빈칸' ? sentence : '';
    const outputText = normalizedSentence || morpheme || '번역 결과 없음';

    setTranslatedText(outputText);
    setSystemMsg(`백엔드 응답 수신 완료 (${source})`);
  }, []);

  // 0.2초 최소 보장 로딩 훅
  const { isLoading, handleCameraLoaded } = useHomeLoading(200);

  // useRecorder: streamRef로 녹화, update로 매 프레임 손 감지 여부 전달
  const { update, stop, status } = useRecorder({
    streamRef,
    videoRef,
    outputOrientation: 'auto',
    onBackendResult: (response) => applyBackendResponse(response, 'camera'),
  });

  const onFrame = useCallback((data: OpenPoseData) => {
    if (inputMode === 'camera') {
      update(data);
      return;
    }

    const video = videoRef.current;
    if (!video || video.paused || video.ended) return;

    const [outW, outH] = resolveOutputSize('auto', videoRef);
    fileFrameRowsRef.current.push(extractKeypointRow(data, outW, outH));
  }, [inputMode, update, videoRef]);

  // useMediaPipe: onFrame 콜백으로 매 프레임 update 호출
  const { keypointsRef, isModelReady, detectCurrentFrame, resetTrackingState } = useMediaPipe(videoRef, onFrame, {
    stabilizeHands: true,
    faceZoomFallback: true,
    maxFps: 30,
  });

  const resampleFramesLinear = useCallback((frames: number[][], targetLength: number) => {
    if (frames.length === 0) return [] as number[][];
    if (targetLength <= 0) return [];
    if (targetLength === frames.length) return frames;

    const srcLen = frames.length;
    const colCount = frames[0]?.length ?? 0;
    if (srcLen === 1 || colCount === 0) {
      return Array.from({ length: targetLength }, () => [...(frames[0] ?? [])]);
    }

    const out: number[][] = [];
    for (let i = 0; i < targetLength; i++) {
      const pos = (i * (srcLen - 1)) / (targetLength - 1);
      const left = Math.floor(pos);
      const right = Math.min(srcLen - 1, Math.ceil(pos));
      const t = pos - left;

      if (left === right) {
        out.push([...frames[left]]);
        continue;
      }

      const row = new Array<number>(colCount);
      const lrow = frames[left];
      const rrow = frames[right];
      for (let c = 0; c < colCount; c++) {
        row[c] = lrow[c] + (rrow[c] - lrow[c]) * t;
      }
      out.push(row);
    }
    return out;
  }, []);

  // 컴포넌트 언마운트 시 진행 중인 녹화 강제 종료
  useEffect(() => {
    return () => stop();
  }, [stop]);

  useEffect(() => {
    return () => {
      if (videoFileUrl) URL.revokeObjectURL(videoFileUrl);
    };
  }, [videoFileUrl]);

  const onSelectMode = useCallback((mode: 'camera' | 'video') => {
    if (mode === inputMode) return;
    setInputMode(mode);
    stop();
    resetTrackingState();
    fileFrameRowsRef.current = [];
    sendingRef.current = false;
    setVideoStatus('idle');
  }, [inputMode, resetTrackingState, stop]);

  const onVideoFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    // 같은 파일 재선택 시에도 change 이벤트가 다시 발생하도록 value를 즉시 비운다.
    event.target.value = '';

    if (videoFileUrl) URL.revokeObjectURL(videoFileUrl);

    selectedFileRef.current = file;
    fileFrameRowsRef.current = [];
    sendingRef.current = false;
    resetTrackingState();
    setVideoStatus('idle');

    const url = URL.createObjectURL(file);
    setVideoFileUrl(url);
    setInputMode('video');
    stop();
  }, [resetTrackingState, stop, videoFileUrl]);

  const onVideoPlay = useCallback(() => {
    resetTrackingState();
    fileFrameRowsRef.current = [];
    sendingRef.current = false;
    setVideoStatus('playing');
  }, [resetTrackingState]);

  const onVideoEnded = useCallback(async () => {
    if (sendingRef.current) return;
    const file = selectedFileRef.current;
    if (!file) return;

    sendingRef.current = true;
    setVideoStatus('sending');
    setSystemMsg('비디오 모드: 서버 전송 중...');

    try {
      const ext = file.type.includes('mp4') || file.name.toLowerCase().endsWith('.mp4') ? 'mp4' : 'webm';
      let rowsForSend = fileFrameRowsRef.current;

      if (rowsForSend.length === 0) {
        const detected = detectCurrentFrame({
          enforceInterval: false,
          skipDuplicateVideoTime: false,
          emitCallback: false,
        });
        if (detected) {
          const [outW, outH] = resolveOutputSize('auto', videoRef);
          rowsForSend = [extractKeypointRow(detected, outW, outH)];
        }
      }

      const video = videoRef.current;
      const duration = Number.isFinite(video?.duration) ? (video?.duration ?? 0) : 0;
      const quality = video && typeof video.getVideoPlaybackQuality === 'function'
        ? video.getVideoPlaybackQuality()
        : null;
      const totalVideoFrames = quality?.totalVideoFrames ?? 0;
      const estimatedBySourceFps = duration > 0 && totalVideoFrames > 0
        ? Math.round(totalVideoFrames)
        : 0;
      const fallbackByDuration = duration > 0 ? Math.round(duration * 30) : 0;
      const targetFrames = Math.max(1, estimatedBySourceFps || fallbackByDuration || rowsForSend.length);

      // 원본 영상 FPS(가능하면 totalVideoFrames) 기준 길이로 선형 리샘플링
      const normalizedLengthFrames = resampleFramesLinear(rowsForSend, targetFrames);
      const interpolated = interpolateFrames(normalizedLengthFrames);
      const response = await sendToBackend(file, interpolated, ext);
      if (!response || response.result === 'ERROR') {
        throw new Error('backend response error');
      }
      applyBackendResponse(response, 'video');
      setVideoStatus('done');
    } catch (err) {
      console.error('[Home] video mode send failed:', err);
      setVideoStatus('error');
      setTranslatedText('번역 실패');
      setSystemMsg('비디오 모드: 서버 전송 실패');
    } finally {
      sendingRef.current = false;
      fileFrameRowsRef.current = [];
      resetTrackingState();
    }
  }, [applyBackendResponse, detectCurrentFrame, resetTrackingState, resampleFramesLinear, videoRef]);

  // 단축키 매핑 (Ctrl + Shift + A)
  useShortcut({
    targetKey: 'A',
    requireCtrl: true,
    requireShift: true,
    onTrigger: () => {
      if (!isLoading) setShowSkeleton((prev) => !prev);
    }
  });

  return (
    <div style={styles.container}>
      {/* 상단 테스트용 배지 */}
      {!isLoading && <SkeletonStatusBadge showSkeleton={showSkeleton} />}
      
      {/* 로딩 스켈레톤 UI */}
      {isLoading && <HomeSkeleton />}

      {/* 메인 콘텐츠 영역 */}
      <div style={{ ...styles.contentWrapper, display: isLoading ? 'none' : 'flex' }}>
        <main style={styles.main}>
          <div style={styles.videoContainer}>
            <div style={styles.controlsRow}>
              <div style={styles.modeGroup}>
                <button
                  type="button"
                  style={{ ...styles.modeBtn, ...(inputMode === 'camera' ? styles.modeBtnActive : {}) }}
                  onClick={() => onSelectMode('camera')}
                >
                  Camera Mode
                </button>
                <button
                  type="button"
                  style={{ ...styles.modeBtn, ...(inputMode === 'video' ? styles.modeBtnActive : {}) }}
                  onClick={() => onSelectMode('video')}
                >
                  Video Mode
                </button>
              </div>
              <input
                type="file"
                accept="video/mp4,video/webm,video/*"
                style={styles.fileInput}
                onChange={onVideoFileChange}
              />
            </div>
            <div style={styles.videoStage}>
              <CameraView
                mode={inputMode}
                videoRef={videoRef}
                streamRef={streamRef}
                isMonitoring={inputMode === 'camera'}
                canStartVideo={isModelReady}
                onLoaded={handleCameraLoaded}
                recorderPhase={status.phase}
                videoSrc={videoFileUrl}
                videoStatus={videoStatus}
                onVideoEnded={onVideoEnded}
                onVideoPlay={onVideoPlay}
              />
              {showSkeleton && (
                <SkeletonOverlay
                  keypointsRef={keypointsRef}
                  videoRef={videoRef}
                  mirrored={false}
                />
              )}
            </div>
          </div>
        </main>
        <SubtitleArea translatedText={translatedText} systemMsg={systemMsg} />
      </div>
    </div>
  );
}

export default Home;
