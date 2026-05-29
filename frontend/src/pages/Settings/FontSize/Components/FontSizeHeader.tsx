// src/pages/Settings/FontSize/Components/FontSizeHeader.tsx

import { AiOutlineClose } from 'react-icons/ai';
import { styles } from './FontSizeHeader.style'

interface FontSizeHeaderProps {
  onBack: () => void;
}

export const FontSizeHeader = ({ onBack }: FontSizeHeaderProps) => (
  <header style={styles.header}>
    <div style={styles.titleBadge}>
      <span style={styles.titleText}>글자 크기 화면</span>
    </div>

    <button onClick={onBack} style={styles.closeButton}>
      <AiOutlineClose size={26} color="#495057" />
    </button>
  </header>
);
