// src/hooks/useHomeLoading.ts

import { useState, useEffect } from 'react';

export const useHomeLoading = (delay: number = 1000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTimerDone, setIsTimerDone] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // 최소 보장 시간 타이머
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTimerDone(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  // 두 조건이 모두 충족되면 로딩 해제
  useEffect(() => {
    if (isTimerDone && isCameraReady) {
      setIsLoading(false);
    }
  }, [isTimerDone, isCameraReady]);

  return {
    isLoading,
    handleCameraLoaded: () => setIsCameraReady(true)
  };
};