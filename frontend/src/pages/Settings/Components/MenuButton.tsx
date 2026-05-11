//src/pages/Settings/Components/MenuButton.tsx

import React from 'react';

interface MenuButtonProps {
  label: string;
  onClick: () => void;
}

const MenuButton = ({ label, onClick }: MenuButtonProps) => (
  <button 
    onClick={onClick}
    style={{ 
      height: '350px', 
      borderRadius: '12px', 
      backgroundColor: '#ffffff', 
      fontSize: '2rem', 
      cursor: 'pointer',
      border: '1px solid #ddd'
    }}
  >
    {label}
  </button>
);

export default MenuButton;