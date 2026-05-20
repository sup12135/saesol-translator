// src/components/Header/HeaderButtons.tsx

import { Link } from 'react-router-dom';
import { FiSettings } from 'react-icons/fi';

const HeaderButtons = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '15px',
        alignItems: 'center',
      }}
    >
      <Link
        to="/Settings"
        title="환경설정"
        style={{
          backgroundColor: '#CDE6EF',
          color: '#333',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textDecoration: 'none',
          width: '150px',
          padding: '10px 18px',
          borderRadius: '30px',
          border: '2px solid rgba(255,255,255,0.8)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',

          transition: 'all 0.2s ease-in-out',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span
            style={{
              fontSize: '15px',
              fontWeight: '600',
              lineHeight: 1,
            }}
          >
            환경설정
          </span>

          <FiSettings size={24} />
        </div>
      </Link>
    </div>
  );
};

export default HeaderButtons;