// src/pages/Settings/FontSize/useFontSize.ts

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useFontSize = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('app-font-size');
    return saved ? parseInt(saved, 10) : 24; 
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  // [설계 준수] +2 증감 및 최대 80px 제한
  const handleIncrease = () => {
    if (fontSize < 80) setFontSize((prev) => prev + 2);
  };

  // [설계 준수] -2 증감 및 최소 24px 제한
  const handleDecrease = () => {
    if (fontSize > 24) setFontSize((prev) => prev - 2);
  };

  // [설계 준수] 숫자 외 입력 방지
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    const numValue = value === '' ? 0 : Number(value);
    setFontSize(numValue);
  };

  const handleInputBlur = () => {
    let correctedValue = fontSize;

    // 범위 보정 
    if (correctedValue < 24) {
      correctedValue = 24;
    } else if (correctedValue > 80) {
      correctedValue = 80;
    }

    // 홀수 판별 및 짝수 보정
    if (correctedValue % 2 !== 0) {
      correctedValue = correctedValue + 1 > 80 ? correctedValue - 1 : correctedValue + 1;
    }

    setFontSize(correctedValue);
  };

  // [설계 준수] 로컬 스토리지 저장 및 이동
const handleConfirm = () => {
    localStorage.setItem('app-font-size', fontSize.toString());
    
    // Custom Event를 발생시켜 현재 창의 다른 컴포넌트들에게 알림
    const event = new Event('font-size-changed');
    window.dispatchEvent(event);
    
    // 설계서상 설정 완료 후 이동 경로는 메인(/) 또는 설정(/settings)
    // Home으로 바로 반영 확인을 위해 navigate('/')로 변경 가능
    navigate('/settings'); 
  };

  return {
    fontSize,
    isLoading,
    handleIncrease,
    handleDecrease,
    handleInputChange,
    handleInputBlur,
    handleConfirm,
    navigate
  };
};