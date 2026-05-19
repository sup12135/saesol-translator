// src/components/Header/HeaderButtons.tsx

import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';

const HeaderButtons = () => {
  return (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      <Link 
        to="/Settings" 
        style={{ 
          color: '#333', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          textDecoration: 'none'
        }} 
        title="환경설정"
      >
        <span style={{ fontSize: '15px', fontWeight: '500' }}>환경설정</span>
        <FiSettings size={26} />
      </Link>
    </div>
  );
};

export default HeaderButtons;