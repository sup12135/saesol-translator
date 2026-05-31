// src/pages/Settings/TTS/Components/VoiceSelector.tsx

import { IoIosMan, IoIosWoman } from 'react-icons/io';
import { VoiceCard } from './VoiceCard';
import './VoiceSelector.css';

interface VoiceSelectorProps {
  selectedVoice: string | null;
  onSelect: (type: string) => void;
  onPlayPreview: (type: 'male' | 'female') => void;
}

export function VoiceSelector({
  selectedVoice,
  onSelect,
  onPlayPreview,
}: VoiceSelectorProps) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '30px',
          width: '100%',
        }}
      >
        {/* 남성 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            alignItems: 'center',
          }}
        >
          <VoiceCard
            id="btn_tts_male"
            label="남성 목소리"
            isSelected={selectedVoice === 'male'}
            onSelect={() => onSelect('male')}
            icon={<IoIosMan size={64} />}
          />

          <button
            className="voice-preview-btn"
            onClick={() => onPlayPreview('male')}
          >
            목소리 듣기
          </button>
        </div>

        {/* 여성 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            alignItems: 'center',
          }}
        >
          <VoiceCard
            id="btn_tts_female"
            label="여성 목소리"
            isSelected={selectedVoice === 'female'}
            onSelect={() => onSelect('female')}
            icon={<IoIosWoman size={64} />}
          />

          <button
            className="voice-preview-btn"
            onClick={() => onPlayPreview('female')}
          >
            목소리 듣기
          </button>
        </div>
      </div>
    </div>
  );
}