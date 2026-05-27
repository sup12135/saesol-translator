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

function Home() {
  const [showSkeleton, setShowSkeleton] = useState(false);

  // videoRef 생성 위치 변경
  const videoRef = useRef<HTMLVideoElement>(null);

  // streamRef 추가, useRecorder에 전달
  const streamRef = useRef<MediaStream | null>(null);
  
  // 0.2초 최소 보장 로딩 훅
  const { isLoading, handleCameraLoaded } = useHomeLoading(200);

  // useRecorder: streamRef로 녹화, update로 매 프레임 손 감지 여부 전달
  const { update, stop, status } = useRecorder({
    streamRef,
    videoRef,
    outputOrientation: 'auto',
  });

  // useMediaPipe: onFrame 콜백으로 매 프레임 update 호출
  const { keypointsRef } = useMediaPipe(videoRef, update, {
    stabilizeHands: true,
    faceZoomFallback: false,
    maxFps: 20,
  });

  // 컴포넌트 언마운트 시 진행 중인 녹화 강제 종료
  useEffect(() => {
    return () => stop();
  }, [stop]);

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
            <CameraView
              videoRef={videoRef}
              streamRef={streamRef}
              isMonitoring={true}
              onLoaded={handleCameraLoaded}
              recorderPhase={status.phase}
            />
            {showSkeleton && <SkeletonOverlay keypointsRef={keypointsRef} videoRef={videoRef} />}
          </div>
        </main>
        <SubtitleArea />
      </div>
    </div>
  );
}

export default Home;
