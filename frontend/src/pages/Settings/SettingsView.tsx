//src/pages/Settings/SettingsView.tsx

import MenuButton from './Components/MenuButton';

interface SettingsViewProps {
  onNavigate: (path: string) => void;
}

const SettingsView = ({ onNavigate }: SettingsViewProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '40px 60px 20px' }}>
        <button onClick={() => onNavigate('/')} style={{ width: '48px', height: '48px' }}>X</button>
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