// src/pages/Settings/TTS/index.tsx (SL_SC_03)

import { useNavigate } from 'react-router-dom';
import TTSSkeleton from './TTSSkeleton';
import { useTTSSetting } from './useTTSSetting';
import { TTSHeader } from './Components/TTSHeader';
import { TTSFooter } from './Components/TTSFooter';
import { VoiceSelector } from './Components/VoiceSelector';

function TTSSettingPage() {
  const navigate = useNavigate();
  const { isLoading, selectedVoice, handleVoiceSelect, saveVoiceSetting } = useTTSSetting();

  if (isLoading) return <TTSSkeleton />;

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        width: '100vw', 
        backgroundColor: '#f8f9fa', // SettingsView와 동일한 부드러운 화이트
        padding: '160px 60px 70px 60px', // 공통 헤더 안전 여백 유지
        boxSizing: 'border-box'
      }}
    >
      {/* 완벽하게 가로줄 정렬선이 일치하는 헤더 */}
      <TTSHeader onBack={() => navigate(-1)} />
      
      {/* 정돈된 2열 보이스 셀렉터 그리드 */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%', marginTop: '-20px' }}>
        <VoiceSelector 
          selectedVoice={selectedVoice} 
          onSelect={handleVoiceSelect} 
        />
      </main>

      {/* 하단 캡슐형 설정 완료 버튼 */}
      <TTSFooter 
        onConfirm={() => saveVoiceSetting() && navigate(-1)} 
        disabled={!selectedVoice} 
      />
    </div>
  );
}

export default TTSSettingPage;