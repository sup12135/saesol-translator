// src/components/Header/HeaderTitle.tsx

import { Link } from 'react-router-dom';

const HeaderTitle = () => {
  return (
    <Link 
      to="/" 
      style={{ 
        fontSize: '20px', 
        fontWeight: 'bold', 
        color: '#333', 
        textDecoration: 'none' 
      }}
    >
      AI 수어 번역 플랫폼
    </Link>
  );
};

export default HeaderTitle;