// src/pages/Settings/FontSize/components/FontSizeInput.tsx
import React from 'react';

export const FontSizeInput = ({ value, onChange, onBlur }: any) => (
  <div style={inputWrapper}>
    <input
      id="input_font_size"
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      style={inputStyle}
    />
    <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#434343' }}>px</span>
  </div>
);

const inputWrapper: React.CSSProperties = {
  width: '200px',
  height: '280px', // 미리보기 박스와 높이 통일
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '5px',
  boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
};

const inputStyle: React.CSSProperties = {
  width: '120px',
  border: 'none',
  background: 'transparent',
  fontSize: '48px',
  fontWeight: '800',
  textAlign: 'center',
  outline: 'none',
  color: '#434343',
};