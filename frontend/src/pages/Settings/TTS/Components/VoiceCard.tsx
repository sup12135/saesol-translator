//src/pages/Settings/TTS/Components/VoiceCard.tsx

interface VoiceCardProps {
  id: string;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  icon?: React.ReactNode; 
}

export function VoiceCard({ id, label, isSelected, onSelect, icon }: VoiceCardProps) {
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
      <div style={{ 
        width: '100px', 
        height: '100px', 
        borderRadius: '50%', 
        backgroundColor: 'transparent', 
        border: '2px solid #ccc',
        marginBottom: '20px',
        display: 'flex',       
        alignItems: 'center',
        justifyContent: 'center',
        color: '#555'          
      }}>
        {icon}
      </div>
      
      <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{label}</span>
    </div>
  );
}