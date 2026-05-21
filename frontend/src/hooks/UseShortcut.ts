// src/hooks/useShortcut.ts

import { useEffect } from 'react';

interface UseShortcutProps {
  targetKey: string;     // 예: 'A'
  requireCtrl?: boolean;
  requireShift?: boolean;
  onTrigger: () => void;
}

export const useShortcut = ({
  targetKey,
  requireCtrl = false,
  requireShift = false,
  onTrigger
}: UseShortcutProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isKeyMatch = event.key.toUpperCase() === targetKey.toUpperCase();
      const isCtrlMatch = requireCtrl ? (event.ctrlKey || event.metaKey) : true;
      const isShiftMatch = requireShift ? event.shiftKey : true;

      if (isKeyMatch && isCtrlMatch && isShiftMatch) {
        event.preventDefault(); // 브라우저 기본 스크롤 등 단축키 동작 방지
        onTrigger();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [targetKey, requireCtrl, requireShift, onTrigger]);
};