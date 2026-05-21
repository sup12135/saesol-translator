// src/pages/Home/index.tsx (SL_SC_01)

import { useState } from 'react';
import HomeSkeleton from './HomeSkeleton';
import CameraView from './CameraView';
import SubtitleArea from './SubtitleArea';
import SkeletonOverlay from './SkeletonOverlay';
import SkeletonStatusBadge from './SkeletonStatusBadge';
import { useShortcut } from '../../hooks/UseShortcut';
import { useHomeLoading } from '../../hooks/useHomeLoading';
import { styles } from './Home.style'; 

function Home() {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [keypoints] = useState<any>(null);
  
  // 0.2초 최소 보장 로딩 훅
  const { isLoading, handleCameraLoaded } = useHomeLoading(200);

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
            <CameraView isMonitoring={true} onLoaded={handleCameraLoaded} />
            {showSkeleton && <SkeletonOverlay keypointsData={keypoints} />}
          </div>
        </main>
        <SubtitleArea />
      </div>
    </div>
  );
}

export default Home;