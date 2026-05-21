// src/pages/Home/CameraView.tsx

import { useCameraStream } from "../../hooks/UseCameraStream";

interface CameraViewProps {
  isMonitoring: boolean;
  onLoaded: () => void;
}

const CameraView = ({ isMonitoring, onLoaded }: CameraViewProps) => {
  // 커스텀 훅으로 카메라 스트림 로직 주입
  const { videoRef, errorMsg } = useCameraStream({ isMonitoring, onLoaded });

  return (
    <div style={styles.container}>
      {errorMsg ? (
        <div style={styles.errorText}>{errorMsg}</div>
      ) : (
        <video
          id="cam_stream_view"
          ref={videoRef}
          autoPlay 
          playsInline 
          muted
          style={styles.video}
        />
      )}
    </div>
  );
};

// 가독성을 위한 스타일 객체 분리
const styles = {
  container: {
    position: 'relative', 
    width: '100%', 
    maxWidth: '1000px',
    aspectRatio: '18/13',
    backgroundColor: '#000', 
    borderRadius: '12px', 
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  } as const,
  errorText: {
    color: '#fff', 
    textAlign: 'center',
    padding: '0 20px'
  } as const,
  video: {
    width: '100%', 
    height: '100%', 
    objectFit: 'cover',
    transform: 'scaleX(-1)' // 좌우 반전 (거울 모드)
  } as const
};

export default CameraView;