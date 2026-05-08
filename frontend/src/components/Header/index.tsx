//src/components/Header/index.tsx

import { Link } from 'react-router-dom';

//페이지 전환 경로 데이터 정의
const NAV_ITEMS = [
  { name: '홈', path: '/'},
  { name: '관리자', path: '/Admin'},
  { name: '설정', path: '/Settings'},
  { name: '폰트크기', path: '/FontSize'},
  { name: '음성안내(TTS)', path: '/TTS'},
];

const Header = () => {
  return(
    <header>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '20px', padding: 0}}>
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <Link to={item.path}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header;