// src/pages/Settings/TTS/Components/TTSGenderSelection.tsx

import { MdMan, MdWoman } from 'react-icons/md';
import { TTSGenderButton } from './TTSGenderButton';
import { containerStyle } from './TTSGenderStyles'

interface TTSGenderProps {
  selectedGender: 'male' | 'female' | null;
  onSelectGender: (gender: 'male' | 'female') => void;
}

export const TTSGenderSelection = ({
  selectedGender,
  onSelectGender,
}: TTSGenderProps) => {
  return (
    <div style={containerStyle}>
      <TTSGenderButton
        selected={selectedGender === 'female'}
        onClick={() => onSelectGender('female')}
      >
        <MdWoman size={48} color="#333333" />
      </TTSGenderButton>

      <TTSGenderButton
        selected={selectedGender === 'male'}
        onClick={() => onSelectGender('male')}
      >
        <MdMan size={48} color="#333333" />
      </TTSGenderButton>
    </div>
  );
};