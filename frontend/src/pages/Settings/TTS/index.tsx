// src/pages/Settings/TTS/index.tsx

import { useNavigate } from 'react-router-dom';

import TTSSkeleton from './TTSSkeleton';
import { useTTSSetting } from './useTTSSetting';

import { TTSHeader } from './Components/TTSHeader';
import { TTSFooter } from './Components/TTSFooter';
import { VoiceSelector } from './Components/VoiceSelector';

function TTSSettingPage() {
  const navigate = useNavigate();

  const {
    isLoading,
    selectedVoice,
    handleVoiceSelect,
    saveVoiceSetting,
    handlePlayPreview,
  } = useTTSSetting();

  if (isLoading) return <TTSSkeleton />;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#f8f9fa',
        padding: '160px 60px 70px 60px',
        boxSizing: 'border-box',
      }}
    >
      {/* 헤더 */}
      <TTSHeader onBack={() => navigate(-1)} />

      {/* 메인 */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginTop: '-40px',
        }}
      >
        <VoiceSelector
          selectedVoice={selectedVoice}
          onSelect={handleVoiceSelect}
          onPlayPreview={handlePlayPreview}
        />
      </main>

      {/* 하단 버튼 */}
      <TTSFooter
        onConfirm={() => saveVoiceSetting() && navigate(-1)}
        disabled={!selectedVoice}
      />
    </div>
  );
}

export default TTSSettingPage;