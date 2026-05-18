// src/pages/Settings/FontSize/components/ControlButtons.tsx
import React from 'react';


export const ControlButtons = ({ onUp, onDown }: { onUp: () => void; onDown: () => void }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
    <button id="btn_font_up" onClick={onUp} style={buttonStyle}>
      <div style={triangleStyle('bottom')} />
    </button>
    <button id="btn_font_down" onClick={onDown} style={buttonStyle}>
      <div style={triangleStyle('top')} />
    </button>
  </div>
);

const buttonStyle: React.CSSProperties = {
  width: '140px',
  height: '140px',
  borderRadius: '35px',
  backgroundColor: '#ADDFF1', 
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
};

const triangleStyle = (dir: 'top' | 'bottom'): React.CSSProperties => ({
  width: '0',
  height: '0',
  borderLeft: '22px solid transparent',
  borderRight: '22px solid transparent',
  [dir === 'top' ? 'borderTop' : 'borderBottom']: '34px solid #434343',
});