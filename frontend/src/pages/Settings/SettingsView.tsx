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
      
      {/* 상단 뼈대 라인 */}
      <header style={styles.header}>
        <div style={styles.titleBadge}>
          <span style={styles.titleText}>환경 설정 화면</span>
        </div>

        <button onClick={() => onNavigate('/')} style={styles.closeButton}>
          <AiOutlineClose size={26} color="#495057" />
        </button>
      </header>
      
      {/* 중앙 메인 컨텐츠 영역 */}
      <main style={styles.main}>
        <div style={styles.menuGrid}>
          
          <MenuButton 
            label="음성 설정" 
            onClick={() => onNavigate('/TTS')} 
            icon={<AiFillSound size={64} color="#2b4c59" />} // 아이콘 크기를 약간 키워 확실한 테마 전달
          />

          <MenuButton 
            label="글자 크기" 
            onClick={() => onNavigate('/FontSize')} 
            icon={<AiOutlineFontSize size={64} color="#2b4c59" />} 
          />

        </div>
      </main>

    </div>
  );
};

export default SettingsView;