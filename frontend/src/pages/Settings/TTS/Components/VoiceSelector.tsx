//src/pages/Settings/TTS/Components/VoiceSelect.tsx

import { VoiceCard } from './VoiceCard';

interface VoiceSelectorProps {
  selectedVoice: string | null;
  onSelect: (type: string) => void;
}

export function VoiceSelector({ selectedVoice, onSelect }: VoiceSelectorProps) {
  return (
    <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 60px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', width: '100%', maxWidth: '900px' }}>
        <VoiceCard 
          id="btn_tts_male"
          label="남성 목소리"
          isSelected={selectedVoice === 'male'}
          onSelect={() => onSelect('male')}
        />
        <VoiceCard 
          id="btn_tts_female"
          label="여성 목소리"
          isSelected={selectedVoice === 'female'}
          onSelect={() => onSelect('female')}
        />
      </div>
    </main>
  );
}