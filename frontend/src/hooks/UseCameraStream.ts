// src/hooks/useCameraStream.ts

import { useEffect, useState } from 'react';

interface UseCameraStreamProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  isMonitoring: boolean;
  onLoaded: () => void;
}

export const useCameraStream = ({ videoRef, streamRef, isMonitoring, onLoaded }: UseCameraStreamProps) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setErrorMsg(null); // 초기화 시 에러 메시지 리셋
        
        // [초기화] 카메라 권한 획득
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false 
        });
        
        // 외부 ref에 스트림 저장
        streamRef.current = stream;

        if (videoRef.current) {
          // 비디오 태그에 스트림 연결
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => onLoaded();
        }
      } catch (err) {
        // [예외처리] 장치 연결 실패 시 에러 노출
        setErrorMsg("카메라 연결 실패: 다른 앱에서 사용 중인지 확인하세요.");
        onLoaded(); 
      }
    };

    if (isMonitoring) {
      startCamera();
    }

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [isMonitoring, onLoaded]);

  return { errorMsg };
};