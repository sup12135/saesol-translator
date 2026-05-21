// src/pages/Settings/Components/MenuButton.tsx

import React from 'react';
import { styles } from './MenuButton.style'; // 분리한 스타일 임포트

interface MenuButtonProps {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode; // 아이콘 컴포넌트를 넘겨받을 수 있도록 추가
}

const MenuButton = ({ label, onClick, icon }: MenuButtonProps) => (
  <button onClick={onClick} style={styles.button}>
    <div style={styles.contentWrapper}>
      {icon && icon} 
      <span style={styles.labelText}>{label}</span>
    </div>
  </button>
);

export default MenuButton;