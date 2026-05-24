// src/pages/Settings/TTS/Components/TTSGenderButton.tsx

import type { ReactNode } from 'react';
import { genderButtonStyle } from './TTSGenderStyles'

interface TTSGenderButtonProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}

export const TTSGenderButton = ({
  selected,
  onClick,
  children,
}: TTSGenderButtonProps) => {
  return (
    <button
      onClick={onClick}
      style={genderButtonStyle(selected)}
    >
      {children}
    </button>
  );
};