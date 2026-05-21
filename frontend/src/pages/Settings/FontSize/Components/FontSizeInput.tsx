// src/pages/Settings/FontSize/Components/FontSizeInput.tsx

import React from 'react';
import { styles } from './FontSizeInput.style'

export const FontSizeInput = ({ value, onChange, onBlur }: any) => (
  <div style={styles.inputWrapper}>
    <input
      id="input_font_size"
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      style={styles.input}
    />
    <span style={styles.unit}>px</span>
  </div>
);