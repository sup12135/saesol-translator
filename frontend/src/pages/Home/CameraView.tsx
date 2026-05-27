// src/pages/Home/CameraView.tsx

import { useCameraStream } from "../../hooks/UseCameraStream";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  isMonitoring: boolean;
  onLoaded: () => void;
  recorderPhase?: 'idle' | 'ready' | 'recording';
}

const CameraView = ({ videoRef, streamRef, isMonitoring, onLoaded, recorderPhase = 'idle' }: CameraViewProps) => {
  // 커스텀 훅으로 카메라 스트림 로직 주입
  const { errorMsg } = useCameraStream({ videoRef, streamRef, isMonitoring, onLoaded });

  const statusLabel =
    recorderPhase === 'recording'
      ? 'REC'
      : recorderPhase === 'ready'
        ? 'READY'
        : 'NOT READY';

  const statusStyle =
    recorderPhase === 'recording'
      ? styles.recBadge
      : recorderPhase === 'ready'
        ? styles.readyBadge
        : styles.idleBadge;

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
      {!errorMsg && (
        <div style={styles.statusWrap}>
          <div style={statusStyle}>{statusLabel}</div>
        </div>
      )}
    </div>
  );
};

// 가독성을 위한 스타일 객체 분리
const styles = {
  container: {
    position: 'relative', 
    width: '100%', 
    height: '100%',
    maxWidth: '100%',
    maxHeight: '100%',
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
    objectFit: 'contain',
    transform: 'scaleX(-1)' // 좌우 반전 (거울 모드)
  } as const,
  statusWrap: {
    position: 'absolute',
    bottom: '14px',
    left: '14px',
    zIndex: 30,
    pointerEvents: 'none'
  } as const,
  readyBadge: {
    color: '#111',
    backgroundColor: '#f1cf4a',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.4px',
    padding: '6px 12px',
    borderRadius: '999px'
  } as const,
  idleBadge: {
    color: '#fff',
    backgroundColor: '#525252',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.4px',
    padding: '6px 12px',
    borderRadius: '999px'
  } as const,
  recBadge: {
    color: '#fff',
    backgroundColor: '#d02626',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.4px',
    padding: '6px 12px',
    borderRadius: '999px'
  } as const
};

export default CameraView;
