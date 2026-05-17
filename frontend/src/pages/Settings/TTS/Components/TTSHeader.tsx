//src/pages/Settings/TTS/Components/TTSHeader.tsx

import { AiOutlineClose } from 'react-icons/ai';

interface TTSHeaderProps {
  onBack: () => void;
}

export const TTSHeader = ({ onBack }: TTSHeaderProps) => (
  <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '150px 100px 20px' }}>
    <button 
      onClick={onBack}
      style={{ 
        width: '48px', 
        height: '48px', 
        border: 'none', 
        borderRadius: '8px', 
        backgroundColor: '#CDE6EF', 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <AiOutlineClose size={24} color="#333333" />
    </button>
  </header>
);