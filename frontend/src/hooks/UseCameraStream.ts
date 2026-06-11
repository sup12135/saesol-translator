// src/hooks/useCameraStream.ts

import { useEffect, useState } from 'react';

interface UseCameraStreamProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.RefObject<MediaStream | null>;
  isMonitoring: boolean;
  onLoaded: () => void;
}

// 카메라 스트림 사용
export const useCameraStream = ({ videoRef, streamRef, isMonitoring, onLoaded }: UseCameraStreamProps) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    // 카메라 연결
    const startCamera = async () => {
      try {
        setErrorMsg(null); // 초기화 시 에러 메시지 리셋
        
        // 카메라 권한 요청 및 스트림 획득
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false 
        });
        
        // 외부 ref에 스트림 저장
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => onLoaded();
        }
      } catch (err) {
        // 장치 연결 실패 시 에러 노출 후 로딩 완료 처리
        setErrorMsg("카메라 연결 실패: 다른 앱에서 사용 중인지 확인하세요.");
        onLoaded(); 
      }
    };

    if (isMonitoring) {
      startCamera();
    } else {
      // 모니터링 중단 시 초기화
      setErrorMsg(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      streamRef.current = null;
    }

    // 언마운트 또는 isMonitoring 변경 시 트랙 정지 및 참조 해제
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isMonitoring, onLoaded]);

  return { errorMsg };
};
