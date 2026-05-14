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

  // [설계 준수] +2 증감 및 최대 80px 제한 [cite: 103, 107]
  const handleIncrease = () => {
    if (fontSize < 80) setFontSize((prev) => prev + 2);
  };

  // [설계 준수] -2 증감 및 최소 24px 제한 [cite: 103, 107]
  const handleDecrease = () => {
    if (fontSize > 24) setFontSize((prev) => prev - 2);
  };

  // [설계 준수] 숫자 외 입력 방지 [cite: 108, 112]
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); 
    const numValue = value === '' ? 0 : Number(value);
    setFontSize(numValue);
  };

  /**
   * [예외 처리 및 홀수 버그 수정] 
   * 1. 24~80px 범위 보정
   * 2. 홀수 입력 시 가장 가까운 짝수로 보정
   */
  const handleInputBlur = () => {
    let correctedValue = fontSize;

    // 범위 보정 [cite: 111]
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

  // [설계 준수] 로컬 스토리지 저장 및 이동 [cite: 109, 118]
  const handleConfirm = () => {
    localStorage.setItem('app-font-size', fontSize.toString());
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