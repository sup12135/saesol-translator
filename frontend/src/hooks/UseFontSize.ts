// src/hooks/useFontSize.ts

import { useState, useEffect } from 'react';

export const useFontSize = (defaultSize: number = 24): number => {
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('app-font-size');
    return saved ? parseInt(saved, 10) : defaultSize;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedSize = localStorage.getItem('app-font-size');
      if (updatedSize) setFontSize(parseInt(updatedSize, 10));
    };

    window.addEventListener('font-size-changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('font-size-changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return fontSize;
};