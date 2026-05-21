// src/components/Header/HeaderButtons.tsx

import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';
import { styles } from './HeaderButton.style'

const HeaderButtons = () => {
  return (
    <div style={styles.container}>
      <Link to="/Settings" title="환경설정" style={styles.linkButton}>
        <div style={styles.contentWrapper}>
          <span style={styles.buttonText}>
            환경설정
          </span>
          <FiSettings size={24} />
        </div>
      </Link>
    </div>
  );
};

export default HeaderButtons;