//src/pages/Settings/TTS/Components/VoiceCard.tsx

interface VoiceCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

export function VoiceCard({ id, label, isSelected, onSelect }: VoiceCardProps) {
  return (
    <div 
      id={id}
      onClick={onSelect}
      style={{ 
        height: '300px', cursor: 'pointer', borderRadius: '12px',
        backgroundColor: '#fff', transition: 'all 0.2s',
        border: isSelected ? '3px solid #007bff' : '1px solid #eee',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e0e0e0', marginBottom: '20px' }} />
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{label}</span>
    </div>
  );
}