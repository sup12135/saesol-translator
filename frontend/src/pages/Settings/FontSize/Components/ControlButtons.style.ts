// src/pages/Settings/FontSize/Components/ControlButtons.style.ts

import React from 'react';

export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  } as const,
  button: {
    width: '140px',
    height: '140px',
    borderRadius: '24px', // 전체 UI 무드에 맞게 부드러운 사각형으로 통일
    backgroundColor: '#ADDFF1', 
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(173, 223, 241, 0.3)',
    transition: 'transform 0.1s ease',
  } as const,
};

export const triangleStyle = (dir: 'top' | 'bottom'): React.CSSProperties => ({
  width: '0',
  height: '0',
  borderLeft: '20px solid transparent',
  borderRight: '20px solid transparent',
  [dir === 'top' ? 'borderTop' : 'borderBottom']: '30px solid #2b4c59', // 화살표 색상 톤 보정
});