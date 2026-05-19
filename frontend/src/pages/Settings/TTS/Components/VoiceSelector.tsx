//src/pages/Settings/TTS/Components/VoiceSelect.tsx

import { IoIosMan, IoIosWoman } from 'react-icons/io';
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
          icon={<IoIosMan size={48} />} // 원하는 크기로 size 조절 가능해
        />
        <VoiceCard 
          id="btn_tts_female"
          label="여성 목소리"
          isSelected={selectedVoice === 'female'}
          onSelect={() => onSelect('female')}
          icon={<IoIosWoman size={48} />} // 원하는 크기로 size 조절 가능해
        />
      </div>
    </main>
  );
}