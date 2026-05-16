// src/pages/Settings/FontSize/components/ConfirmButton.tsx
import React from 'react';

export const ConfirmButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    id="btn_font_confirm"
    onClick={onClick}
    style={confirmBtnStyle}
  >
    설정 완료
  </button>
);

const confirmBtnStyle: React.CSSProperties = {
  width: '320px',
  height: '75px',
  borderRadius: '20px',
  backgroundColor: '#CDE6EF',
  color: '#434343',          
  fontSize: '22px',
  fontWeight: '700',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
  marginTop: '20px'
};