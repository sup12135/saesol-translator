// src/pages/Settings/TTS/Components/TTSHeader.tsx

import { AiOutlineClose } from 'react-icons/ai';
import { styles } from './TTSHeader.style';

interface TTSHeaderProps {
  onBack: () => void;
}

export const TTSHeader = ({ onBack }: TTSHeaderProps) => (
  <header style={styles.header}>
    <div style={styles.titleBadge}>
      <span style={styles.titleText}>음성 설정 화면</span>
    </div>

    <button onClick={onBack} style={styles.closeButton}>
      <AiOutlineClose size={26} color="#495057" />
    </button>
  </header>
);