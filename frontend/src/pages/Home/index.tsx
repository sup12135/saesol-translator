// src/pages/Home/index.tsx (SL_SC_01)

import { useState, useRef, useEffect } from 'react';
import HomeSkeleton from './HomeSkeleton';
import CameraView from './CameraView';
import SubtitleArea from './SubtitleArea/SubtitleArea';
import SkeletonOverlay from './SkeletonOverlay';
import SkeletonStatusBadge from './SkeletonStatusBadge';
import TTSTestButton from './components/TTSTestButton';
import { useShortcut } from '../../hooks/UseShortcut';
import { useHomeLoading } from '../../hooks/useHomeLoading';
import { useMediaPipe } from '../../hooks/useMediaPipe';
import { useRecorder } from '../../hooks/useRecorder';
import { useHomeTTS } from '../../hooks/useHomeTTS'
import { getRandomTestSentence } from '../../hooks/useSubtitleTest'
import { styles } from './Home.style';

function Home() {
  const [showSkeleton, setShowSkeleton] =
    useState(false);

  const [subtitleText, setSubtitleText] =
    useState('');

  const [systemMsg] = useState(
    '카메라 앞에서 수어를 시작하면 자동으로 인식합니다.'
  );

  const [isTTSEnabled, setIsTTSEnabled] =
    useState(true);

  // videoRef
  const videoRef =
    useRef<HTMLVideoElement>(null);

  // streamRef
  const streamRef =
    useRef<MediaStream | null>(null);

  // 로딩
  const { isLoading, handleCameraLoaded } =
    useHomeLoading(200);

  // Recorder
  const { update, stop } =
    useRecorder(streamRef);

  // MediaPipe
  const { keypointsRef } = useMediaPipe(
    videoRef,
    update
  );

  // TTS hook
  useHomeTTS({
    subtitleText,
    isTTSEnabled,
  });

  // 언마운트
  useEffect(() => {
    return () => stop();
  }, [stop]);

  // 단축키
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
            <CameraView
              videoRef={videoRef}
              streamRef={streamRef}
              isMonitoring={true}
              onLoaded={
                handleCameraLoaded
              }
            />

            {showSkeleton && (
              <SkeletonOverlay
                keypointsRef={
                  keypointsRef
                }
              />
            )}
          </div>
        </main>

        <SubtitleArea
          translatedText={
            subtitleText
          }
          systemMsg={systemMsg}
          isTTSEnabled={
            isTTSEnabled
          }
          onToggleTTS={
            handleToggleTTS
          }
        />
      </div>
    </div>
  );
}

export default Home;