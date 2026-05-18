//src/pages/Settings/SettingsView.tsx

import MenuButton from './Components/MenuButton';
import { AiOutlineClose } from 'react-icons/ai';

interface SettingsViewProps {
  onNavigate: (path: string) => void;
}

const SettingsView = ({ onNavigate }: SettingsViewProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* TTSHeader의 스타일과 동일하게 수정 */}
      <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '150px 100px 20px' }}>
        <button 
          onClick={() => onNavigate('/')} 
          style={{ 
            width: '48px', 
            height: '48px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#CDE6EF',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <AiOutlineClose size={24} color="#333333" />
        </button>
      </header>
      
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%', maxWidth: '1000px' }}>
          <MenuButton label="음성 설정" onClick={() => onNavigate('/TTS')} />
          <MenuButton label="글자 크기" onClick={() => onNavigate('/FontSize')} />
        </div>
      </main>
      <footer style={{ height: '80px' }} />
    </div>
  );
};

export default SettingsView;