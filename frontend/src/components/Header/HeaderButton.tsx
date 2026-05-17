// src/components/Header/HeaderButtons.tsx
import { Link } from 'react-router-dom';
import { FiSettings, FiPower } from 'react-icons/fi';

const HeaderButtons = () => {
  const handleCloseApp = () => {
    console.log('프로그램 종료 버튼 클릭됨 - Electron 연동 필요');
  };

  return (
    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
      <Link to="/Settings" style={{ color: '#333', display: 'flex', alignItems: 'center' }} title="환경설정">
        <FiSettings size={26} />
      </Link>
      <button
        onClick={handleCloseApp}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          color: '#333',
          display: 'flex',
          alignItems: 'center',
        }}
        title="프로그램 종료"
      >
        <FiPower size={26} />
      </button>
    </div>
  );
};

export default HeaderButtons;