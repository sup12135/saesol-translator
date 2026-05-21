// src/pages/Settings/SettingsView.tsx

import MenuButton from './Components/MenuButton';
import { AiOutlineClose, AiFillSound, AiOutlineFontSize } from 'react-icons/ai';
import { styles } from './SettingsView.style';

interface SettingsViewProps {
  onNavigate: (path: string) => void;
}

const SettingsView = ({ onNavigate }: SettingsViewProps) => {
  return (
    <div style={styles.container}>
      
      {/* 상단 닫기 버튼 영역 */}
      <header style={styles.header}>
        <button onClick={() => onNavigate('/')} style={styles.closeButton}>
          <AiOutlineClose size={24} color="#333333" />
        </button>
      </header>
      
      {/* 메인 메뉴 진입 버튼 영역 */}
      <main style={styles.main}>
        <div style={styles.menuGrid}>
          
          {/* [오류 해결] children 구조를 없애고, icon 속성(Props)으로 아이콘을 전달합니다 */}
          <MenuButton 
            label="음성 설정" 
            onClick={() => onNavigate('/TTS')} 
            icon={<AiFillSound size={56} color="#333333" />} 
          />

          <MenuButton 
            label="글자 크기" 
            onClick={() => onNavigate('/FontSize')} 
            icon={<AiOutlineFontSize size={56} color="#333333" />} 
          />

        </div>
      </main>
      
      <footer style={styles.footer} />

    </div>
  );
};

export default SettingsView;