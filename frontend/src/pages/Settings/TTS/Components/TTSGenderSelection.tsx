//src/pages/Settings/TTS/Components/TTSGenderSelection.tsx

import { MdMan, MdWoman } from 'react-icons/md'; 

interface TTSGenderProps {
  selectedGender: 'male' | 'female' | null;
  onSelectGender: (gender: 'male' | 'female') => void;
}

export const TTSGenderSelection = ({ selectedGender, onSelectGender }: TTSGenderProps) => (
  <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', padding: '20px 0' }}>
    <button
      onClick={() => onSelectGender('female')}
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selectedGender === 'female' ? '#CDE6EF' : '#E0E0E0',
        transition: 'background-color 0.2s ease'
      }}
    >
      <MdWoman size={48} color="#333333" />
    </button>

    <button
      onClick={() => onSelectGender('male')}
      style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: selectedGender === 'male' ? '#CDE6EF' : '#E0E0E0',
        transition: 'background-color 0.2s ease'
      }}
    >
      <MdMan size={48} color="#333333" />
    </button>
  </div>
);