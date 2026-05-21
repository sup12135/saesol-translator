// src/pages/Settings/TTS/Components/VoiceSelect.tsx

import { IoIosMan, IoIosWoman } from 'react-icons/io';
import { VoiceCard } from './VoiceCard';

interface VoiceSelectorProps {
  selectedVoice: string | null;
  onSelect: (type: string) => void;
}

export function VoiceSelector({ selectedVoice, onSelect }: VoiceSelectorProps) {
  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', width: '100%' }}>
        <VoiceCard 
          id="btn_tts_male"
          label="남성 목소리"
          isSelected={selectedVoice === 'male'}
          onSelect={() => onSelect('male')}
          icon={<IoIosMan size={64} />} // 아이콘도 더 큼직하게 조정
        />
        <VoiceCard 
          id="btn_tts_female"
          label="여성 목소리"
          isSelected={selectedVoice === 'female'}
          onSelect={() => onSelect('female')}
          icon={<IoIosWoman size={64} />}
        />
      </div>
    </div>
  );
}