//src/pages/Home/CameraView.tsx

import { useEffect, useRef, useState } from 'react';

interface CameraViewProps {
  isMonitoring: boolean;
  onLoaded: () => void;
}

const CameraView = ({ isMonitoring, onLoaded }: CameraViewProps) => {
  const cam_stream_view_ref = useRef<HTMLVideoElement>(null);
  const [error_msg, set_error_msg] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const start_camera = async () => {
      try {
        // [초기화] 카메라 권한 획득
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false 
        });

        if (cam_stream_view_ref.current) {
          // 비디오 태그에 스트림 연결
          cam_stream_view_ref.current.srcObject = stream;
          cam_stream_view_ref.current.onloadedmetadata = () => onLoaded();
        }
      } catch (err: any) {
        // [예외처리] 장치 연결 실패 시 에러 노출
        set_error_msg("카메라 연결 실패: 다른 앱에서 사용 중인지 확인하세요.");
        onLoaded(); 
      }
    };

    if (isMonitoring) start_camera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop()); 
      }
    };
  }, [isMonitoring, onLoaded]);

return (
    <div style={{ 
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
    }}>
      {error_msg ? (
        <div style={{ color: '#fff', textAlign: 'center' }}>{error_msg}</div>
      ) : (
        <video
          id="cam_stream_view"
          ref={cam_stream_view_ref}
          autoPlay playsInline muted
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transform: 'scaleX(-1)' 
          }}
        />
      )}
    </div>
  );
};

export default CameraView;