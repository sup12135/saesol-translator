// src/pages/Settings/FontSize/Components/FontSizePreview.tsx

import { styles } from './FontSizePreview.style'

export const FontSizePreview = ({ fontSize }: { fontSize: number }) => (
  <div style={styles.previewBox}>
    <span style={{ fontSize: `${fontSize}px`, fontWeight: 'bold', color: '#333' }}>
      가나다라
    </span>
    <p style={styles.infoText}>글자 크기 미리보기</p>
  </div>
);