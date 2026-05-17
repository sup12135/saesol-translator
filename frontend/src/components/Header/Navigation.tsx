// src/components/Header/Navigation.tsx
import { Link } from 'react-router-dom';

const NAV_ITEMS = [
  { name: '홈', path: '/' },
  { name: '관리자', path: '/Admin' },
  { name: '설정', path: '/Settings' },
  { name: '폰트크기', path: '/FontSize' },
  { name: '음성안내(TTS)', path: '/TTS' },
];

const Navigation = () => {
  return (
    <nav>
      <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', padding: 0, margin: 0 }}>
        {NAV_ITEMS.map((item) => (
          <li key={item.path}>
            <Link to={item.path} style={{ textDecoration: 'none', color: '#333', fontWeight: '500' }}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;