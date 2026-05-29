// src/pages/Home/CameraView.tsx
import { useEffect, useRef } from "react";
import { useCameraStream } from "../../hooks/UseCameraStream";

interface CameraViewProps {
  mode: 'camera' | 'video';
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  isMonitoring: boolean;
  canStartVideo?: boolean;
  onLoaded: () => void;
  recorderPhase?: 'idle' | 'ready' | 'recording';
  videoSrc?: string;
  videoStatus?: 'idle' | 'playing' | 'sending' | 'done' | 'error';
  onVideoEnded?: () => void;
  onVideoPlay?: () => void;
}

const CameraView = ({
  mode,
  videoRef,
  streamRef,
  isMonitoring,
  canStartVideo = false,
  onLoaded,
  recorderPhase = 'idle',
  videoSrc,
  videoStatus = 'idle',
  onVideoEnded,
  onVideoPlay
}: CameraViewProps) => {
  // 커스텀 훅으로 카메라 스트림 로직 주입
  const { errorMsg } = useCameraStream({ videoRef, streamRef, isMonitoring, onLoaded });
  const shouldShowError = mode === 'camera' && !!errorMsg;
  const startedVideoSrcRef = useRef('');

  useEffect(() => {
    if (mode !== 'video') return;
    const video = videoRef.current;
    if (!video) return;
    if (!videoSrc) return;

    startedVideoSrcRef.current = '';
    video.srcObject = null;
    video.src = videoSrc;
    video.load();

    const onMeta = () => {
      onLoaded();
      if (!canStartVideo) return;
      if (startedVideoSrcRef.current === videoSrc) return;
      video.currentTime = 0;
      video.play()
        .then(() => {
          startedVideoSrcRef.current = videoSrc;
        })
        .catch(() => {
          // 자동 재생 차단 시 사용자가 controls로 재생할 수 있음
        });
    };

    video.addEventListener('loadedmetadata', onMeta);
    return () => {
      video.removeEventListener('loadedmetadata', onMeta);
    };
  }, [canStartVideo, mode, onLoaded, videoRef, videoSrc]);

  useEffect(() => {
    if (mode !== 'video' || !canStartVideo) return;
    const video = videoRef.current;
    if (!video || !videoSrc) return;
    if (startedVideoSrcRef.current === videoSrc) return;
    if (video.readyState < 1) return;

    video.currentTime = 0;
    video.play()
      .then(() => {
        startedVideoSrcRef.current = videoSrc;
      })
      .catch(() => {
        // 자동 재생 차단 시 사용자가 controls로 재생할 수 있음
      });
  }, [canStartVideo, mode, videoRef, videoSrc]);

  const statusLabel = mode === 'camera'
    ? (
      recorderPhase === 'recording'
        ? 'REC'
        : recorderPhase === 'ready'
          ? 'READY'
          : 'NOT READY'
    )
    : (
      videoStatus === 'playing'
        ? 'VIDEO PLAYING'
        : videoStatus === 'sending'
          ? 'SENDING'
          : videoStatus === 'done'
            ? 'SENT'
            : videoStatus === 'error'
              ? 'SEND FAIL'
              : 'VIDEO READY'
    );

  const statusStyle = mode === 'camera'
    ? (
      recorderPhase === 'recording'
        ? styles.recBadge
        : recorderPhase === 'ready'
          ? styles.readyBadge
          : styles.idleBadge
    )
    : (
      videoStatus === 'playing'
        ? styles.videoPlayingBadge
        : videoStatus === 'sending'
          ? styles.videoSendingBadge
          : videoStatus === 'done'
            ? styles.videoDoneBadge
            : videoStatus === 'error'
              ? styles.videoErrorBadge
              : styles.videoIdleBadge
    );

  return (
    <div style={styles.container}>
      {shouldShowError ? (
        <div style={styles.errorText}>{errorMsg}</div>
      ) : (
        <video
          key={`${mode}-${videoSrc ?? 'camera'}`}
          id="cam_stream_view"
          ref={videoRef}
          autoPlay
          playsInline 
          muted={mode === 'camera'}
          controls={mode === 'video'}
          src={mode === 'video' ? (videoSrc ?? '') : undefined}
          onEnded={mode === 'video' ? onVideoEnded : undefined}
          onPlay={mode === 'video' ? onVideoPlay : undefined}
          style={{
            ...styles.video,
            transform: 'none'
          }}
        />
      )}
      {!shouldShowError && (
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
    transform: 'none'
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
  } as const,
  videoIdleBadge: {
    color: '#fff',
    backgroundColor: '#245f99',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.4px',
    padding: '6px 12px',
    borderRadius: '999px'
  } as const,
  videoPlayingBadge: {
    color: '#111',
    backgroundColor: '#7cc66a',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.4px',
    padding: '6px 12px',
    borderRadius: '999px'
  } as const,
  videoSendingBadge: {
    color: '#111',
    backgroundColor: '#f5be4a',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.4px',
    padding: '6px 12px',
    borderRadius: '999px'
  } as const,
  videoDoneBadge: {
    color: '#fff',
    backgroundColor: '#1e8b4e',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.4px',
    padding: '6px 12px',
    borderRadius: '999px'
  } as const,
  videoErrorBadge: {
    color: '#fff',
    backgroundColor: '#9f2f2f',
    fontWeight: 800,
    fontSize: '14px',
    letterSpacing: '0.4px',
    padding: '6px 12px',
    borderRadius: '999px'
  } as const
};

export default CameraView;
