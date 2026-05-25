// src/pages/Home/index.tsx (SL_SC_01)

import { useState, useRef, useEffect } from 'react';

import HomeSkeleton from './HomeSkeleton';
import CameraView from './CameraView';
import SubtitleArea from './SubtitleArea';
import SkeletonOverlay from './SkeletonOverlay';
import SkeletonStatusBadge from './SkeletonStatusBadge';

import { useShortcut } from '../../hooks/UseShortcut';
import { useHomeLoading } from '../../hooks/useHomeLoading';
import { useMediaPipe } from '../../hooks/useMediaPipe';
import { useRecorder } from '../../hooks/useRecorder';

import { styles } from './Home.style';

import { playAzureSpeech } from '../Settings/TTS/services/azureTTSService';
import { TTS_VOICES } from '../Settings/TTS/constants/Voices';

function Home() {
  const [showSkeleton, setShowSkeleton] = useState(false);

  // -----------------------------------------
  // 실제 자막 상태
  // 초기값을 빈 문자열로 변경
  // -----------------------------------------
  const [subtitleText, setSubtitleText] =
    useState('');

  // 시스템 메시지
  const [systemMsg, setSystemMsg] =
    useState(
      '카메라 앞에서 수어를 시작하면 자동으로 인식합니다.'
    );

  // TTS 활성 여부
  const [isTTSEnabled, setIsTTSEnabled] =
    useState(true);

  // 첫 렌더링 여부 체크
  const isFirstRender = useRef(true);

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

  // 언마운트 시 녹화 종료
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

  // -----------------------------------------
  // subtitleText 변경 시 자동 TTS 실행
  // -----------------------------------------
  useEffect(() => {
    // 첫 렌더링 무시
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // 자막 없으면 실행 안 함
    if (!subtitleText) return;

    // TTS OFF 상태면 실행 안 함
    if (!isTTSEnabled) return;

    const runTTS = async () => {
      try {
        const selectedVoice =
          localStorage.getItem(
            'user_tts_voice'
          ) || 'female';

        const voiceName =
          TTS_VOICES[
            selectedVoice as
              | 'male'
              | 'female'
          ];

        await playAzureSpeech({
          text: subtitleText,
          voiceName,
        });
      } catch (error) {
        console.error(
          '자동 TTS 실행 실패:',
          error
        );
      }
    };

    runTTS();
  }, [subtitleText, isTTSEnabled]);

  // TTS 토글
  const handleToggleTTS = () => {
    setIsTTSEnabled((prev) => !prev);
  };

  // -----------------------------------------
  // 테스트용 TTS 실행
  // -----------------------------------------
  const handleTestTTS = () => {
    const testSentences = [
      '안녕하세요.',
      '수어 번역 테스트입니다.',
      '오늘 날씨가 정말 좋습니다.',
      'AI 음성 출력 기능 테스트 중입니다.',
      '실시간 자막 음성 변환 기능입니다.',
    ];

    const randomSentence =
      testSentences[
        Math.floor(
          Math.random() *
            testSentences.length
        )
      ];

    setSubtitleText(randomSentence);
  };

  return (
    <div style={styles.container}>
      {/* 테스트용 TTS 버튼 */}
      {!isLoading && (
        <button
          onClick={handleTestTTS}
          style={{
            position: 'absolute',

            top: '20px',
            right: '20px',

            zIndex: 999,

            padding: '12px 18px',

            border: 'none',
            borderRadius: '12px',

            backgroundColor: '#5BB6D6',
            color: '#fff',

            fontSize: '14px',
            fontWeight: 600,

            cursor: 'pointer',

            boxShadow:
              '0 4px 12px rgba(91, 182, 214, 0.25)',

            transition: '0.2s ease',
          }}
        >
          TTS 테스트
        </button>
      )}

      {/* 상단 테스트용 배지 */}
      {!isLoading && (
        <SkeletonStatusBadge
          showSkeleton={showSkeleton}
        />
      )}

      {/* 로딩 */}
      {isLoading && <HomeSkeleton />}

      {/* 메인 콘텐츠 */}
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

        {/* 자막 영역 */}
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