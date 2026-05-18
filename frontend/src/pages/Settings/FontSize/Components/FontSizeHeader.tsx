//src/pages/Settings/FontSize/Components/FontSizeHeader.tsx

import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface FontSizeHeaderProps {
  onBack: () => void;
}

export const FontSizeHeader = ({ onBack }: FontSizeHeaderProps) => (
  <header style={headerStyle}>
    <button onClick={onBack} style={closeBtnStyle}>
      <AiOutlineClose size={24} color="#333333" />
    </button>
  </header>
);

const headerStyle: React.CSSProperties = { padding: '150px 100px 20px', display: 'flex', justifyContent: 'flex-end' };
const closeBtnStyle: React.CSSProperties = { width: '48px', height: '48px', borderRadius: '8px', backgroundColor: '#CDE6EF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };