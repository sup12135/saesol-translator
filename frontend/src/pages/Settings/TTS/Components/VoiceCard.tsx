// src/pages/Settings/TTS/Components/VoiceCard.tsx

import React from 'react';
import { styles } from './VoiceCard.style';

interface VoiceCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode; 
}

export function VoiceCard({ id, label, isSelected, onSelect, icon }: VoiceCardProps) {
  const dynamicCardStyle = {
    ...styles.cardBase,
    backgroundColor: isSelected ? '#ADDFF1' : '#ffffff', // 선택 시 메인 버튼과 동일한 하늘색 테마 반영
    border: isSelected ? '3px solid #CDE6EF' : '1px solid #e9ecef',
    boxShadow: isSelected ? '0 8px 20px rgba(173, 223, 241, 0.4)' : '0 4px 12px rgba(0,0,0,0.03)',
  };

  return (
    <div id={id} onClick={onSelect} style={dynamicCardStyle}>
      <div style={{ ...styles.iconCircle, backgroundColor: isSelected ? '#ffffff' : '#f1f3f5' }}>
        {icon}
      </div>
      <span style={styles.labelText}>{label}</span>
    </div>
  );
}