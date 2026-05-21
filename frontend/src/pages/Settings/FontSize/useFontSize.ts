// src/pages/Settings/FontSize/useFontSize.ts

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { correctFontSize } from './FontSizeUtiles'

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

  // 포커스 아웃 시 유틸 함수를 통해 보정 처리
  const handleInputBlur = () => {
    setFontSize(correctFontSize(fontSize));
  };

  // [설계 준수] 로컬 스토리지 저장 및 이동
  const handleConfirm = () => {
    localStorage.setItem('app-font-size', fontSize.toString());
    
    // Custom Event를 발생시켜 현재 창의 다른 컴포넌트들에게 알림
    const event = new Event('font-size-changed');
    window.dispatchEvent(event);
    
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