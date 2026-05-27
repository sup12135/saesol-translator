// src/pages/Settings/FontSize/Components/ControlButtons.tsx

import { styles, triangleStyle } from './ControlButtons.style'

export const ControlButtons = ({ onUp, onDown }: { onUp: () => void; onDown: () => void }) => (
  <div style={styles.container}>
    <button id="btn_font_up" onClick={onUp} style={styles.button}>
      <div style={triangleStyle('bottom')} />
    </button>
    <button id="btn_font_down" onClick={onDown} style={styles.button}>
      <div style={triangleStyle('top')} />
    </button>
  </div>
);
