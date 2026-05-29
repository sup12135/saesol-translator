// src/pages/Home/index.tsx (SL_SC_01)

import { useState, useRef, useEffect, useCallback, type ChangeEvent } from 'react';
import HomeSkeleton from './HomeSkeleton';
import CameraView from './CameraView';
import SubtitleArea from './SubtitleArea/SubtitleArea';
import SkeletonOverlay from './SkeletonOverlay';
import SkeletonStatusBadge from './SkeletonStatusBadge';
import TTSTestButton from './components/TTSTestButton';
import { useShortcut } from '../../hooks/UseShortcut';
import { useHomeLoading } from '../../hooks/useHomeLoading';
import { useHomeTTS } from '../../hooks/useHomeTTS'
import { getRandomTestSentence } from '../../hooks/useSubtitleTest'
import { styles } from './Home.style';
import { type OpenPoseData, useMediaPipe } from '../../hooks/useMediaPipe';
import { extractKeypointRow, interpolateFrames, resolveOutputSize, sendToBackend, useRecorder } from '../../hooks/useRecorder';

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

  const [subtitleText, setSubtitleText] =
    useState('');

  const [isTTSEnabled, setIsTTSEnabled] =
    useState(true);

  // videoRef
  const videoRef =
    useRef<HTMLVideoElement>(null);




//merge

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
    setSubtitleText(outputText);
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
  const { keypointsRef, isModelReady, detectCurrentFrame } = useMediaPipe(videoRef, onFrame, {
    stabilizeHands: true,
    faceZoomFallback: false,
    maxFps: 30,
  });

  const upsampleFramesLinear = useCallback((frames: number[][], targetLength: number) => {
    if (frames.length === 0) return [] as number[][];
    if (targetLength <= frames.length) return frames;

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

  // TTS hook
  useHomeTTS({
    subtitleText,
    isTTSEnabled,
  });

  // 언마운트
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
    keypointsRef.current = null;
    fileFrameRowsRef.current = [];
    sendingRef.current = false;
    setVideoStatus('idle');
  }, [inputMode, keypointsRef, stop]);

  const onVideoFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (videoFileUrl) URL.revokeObjectURL(videoFileUrl);

    selectedFileRef.current = file;
    fileFrameRowsRef.current = [];
    sendingRef.current = false;
    keypointsRef.current = null;
    setVideoStatus('idle');

    const url = URL.createObjectURL(file);
    setVideoFileUrl(url);
    setInputMode('video');
    stop();
  }, [keypointsRef, stop, videoFileUrl]);

  const onVideoPlay = useCallback(() => {
    keypointsRef.current = null;
    fileFrameRowsRef.current = [];
    sendingRef.current = false;
    setVideoStatus('playing');
  }, [keypointsRef]);

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
      const quality = typeof video?.getVideoPlaybackQuality === 'function'
        ? video.getVideoPlaybackQuality()
        : null;
      const estimatedByQuality = quality?.totalVideoFrames ? Math.round(quality.totalVideoFrames) : 0;
      const estimatedByDuration = duration > 0 ? Math.round(duration * 30) : 0;
      const targetFrames = Math.max(rowsForSend.length, estimatedByQuality, estimatedByDuration);

      const densified = upsampleFramesLinear(rowsForSend, targetFrames);
      const interpolated = interpolateFrames(densified);
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
      keypointsRef.current = null;
    }
  }, [applyBackendResponse, detectCurrentFrame, keypointsRef, upsampleFramesLinear, videoRef]);

  // 단축키 매핑 (Ctrl + Shift + A)
  useShortcut({
    targetKey: 'A',
    requireCtrl: true,
    requireShift: true,

    onTrigger: () => {
      if (!isLoading) {
        setShowSkeleton((prev) => !prev);
      }
    },
  });

  // TTS ON/OFF
  const handleToggleTTS = () => {
    setIsTTSEnabled((prev) => !prev);
  };

  // 테스트
  const handleTestTTS = () => {
    setSubtitleText(
      getRandomTestSentence()
    );
  };

return (
  <div style={styles.container}>
    {!isLoading && (
      <TTSTestButton
        onClick={handleTestTTS}
      />
    )}

    {!isLoading && (
      <SkeletonStatusBadge
        showSkeleton={showSkeleton}
      />
    )}

    {isLoading && <HomeSkeleton />}

    <div
      style={{
        ...styles.contentWrapper,
        display: isLoading
          ? 'none'
          : 'flex',
      }}
    >
      <main style={styles.main}>
        <div style={styles.videoContainer}>
          <div style={styles.controlsRow}>
            <div style={styles.modeGroup}>
              <button
                type="button"
                style={{
                  ...styles.modeBtn,
                  ...(inputMode === 'camera'
                    ? styles.modeBtnActive
                    : {}),
                }}
                onClick={() => onSelectMode('camera')}
              >
                Camera Mode
              </button>

              <button
                type="button"
                style={{
                  ...styles.modeBtn,
                  ...(inputMode === 'video'
                    ? styles.modeBtnActive
                    : {}),
                }}
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

      <SubtitleArea
        translatedText={translatedText}
        systemMsg={systemMsg}
        isTTSEnabled={isTTSEnabled}
        onToggleTTS={handleToggleTTS}
      />
    </div>
  </div>
);
}

export default Home;
