// src/pages/Settings/TTS/Components/TTSFooter.tsx

import { styles } from './TTSFooter.style';

interface TTSFooterProps {
  onConfirm: () => void;
  disabled: boolean;
}

export const TTSFooter = ({ onConfirm, disabled }: TTSFooterProps) => (
  <footer style={styles.footer}>
    <button 
      id="btn_tts_confirm"
      onClick={onConfirm}
      disabled={disabled}
      style={{ 
        ...styles.confirmButton,
        color: disabled ? '#aaaaaa' : '#2b4c59', 
        cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled ? '#e9ecef' : '#CDE6EF',
        boxShadow: disabled ? 'none' : '0 4px 12px rgba(205, 230, 239, 0.4)'
      }}
    >
      설정 완료
    </button>
  </footer>
);