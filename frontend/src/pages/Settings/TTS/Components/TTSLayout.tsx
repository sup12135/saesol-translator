//src/pages/Settings/TTS/Components/TTSLayout.tsx

import { TTSHeader } from './TTSHeader'
import { TTSGenderSelection } from './TTSGenderSelection'
import { TTSFooter } from './TTSFooter'

interface TTSLayoutProps {
  onBack: () => void;
  onConfirm: () => void;
  disabled: boolean;
  selectedGender: 'male' | 'female' | null;
  onSelectGender: (gender: 'male' | 'female') => void;
}

export const TTSLayout = ({ 
  onBack, 
  onConfirm, 
  disabled, 
  selectedGender, 
  onSelectGender 
}: TTSLayoutProps) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <TTSHeader onBack={onBack} />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <TTSGenderSelection selectedGender={selectedGender} onSelectGender={onSelectGender} />
      </main>

      <TTSFooter onConfirm={onConfirm} disabled={disabled} />
    </div>
  );
};