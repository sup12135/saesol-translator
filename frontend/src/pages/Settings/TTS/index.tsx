//src/pages/Settings/TTS/index.tsx

import { useNavigate } from 'react-router-dom';
import TTSSkeleton from './TTSSkeleton';
import { useTTSSetting } from './useTTSSetting';
import { TTSHeader, TTSFooter } from './Components/TTSLayout';
import { VoiceSelector } from './Components/VoiceSelector';

function TTSSettingPage() {
  const navigate = useNavigate();
  const { isLoading, selectedVoice, handleVoiceSelect, saveVoiceSetting } = useTTSSetting();

  if (isLoading) return <TTSSkeleton />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '95vh', width: '100vw', backgroundColor: '#f5f5f5' }}>
      <TTSHeader onBack={() => navigate(-1)} />
      
      <VoiceSelector 
        selectedVoice={selectedVoice} 
        onSelect={handleVoiceSelect} 
      />

      <TTSFooter 
        onConfirm={() => saveVoiceSetting() && navigate(-1)} 
        disabled={!selectedVoice} 
      />
    </div>
  );
}

export default TTSSettingPage;