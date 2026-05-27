// src/pages/Settings/FontSize/Components/ConfirmButton.tsx

import { styles } from './ConfirmButton.style';

export const ConfirmButton = ({ onClick }: { onClick: () => void }) => (
  <footer style={styles.footer}>
    <button 
      id="btn_font_confirm"
      onClick={onClick}
      style={styles.confirmButton}
    >
      설정 완료
    </button>
  </footer>
);
