//src/pages/Settings/TTS/Components/TTSFooter.tsx

interface TTSFooterProps {
  onConfirm: () => void;
  disabled: boolean;
}

export const TTSFooter = ({ onConfirm, disabled }: TTSFooterProps) => (
  <footer style={{ padding: '40px 60px', display: 'flex', justifyContent: 'center' }}>
    <button 
      id="btn_tts_confirm"
      onClick={onConfirm}
      disabled={disabled}
      style={{ 
        width: '100%', maxWidth: '400px', height: '60px', borderRadius: '12px', border: 'none',
        color: '#333333', fontWeight: 'bold', cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled ? '#d0d0d0' : '#CDE6EF'
      }}
    >
      설정 완료
    </button>
  </footer>
);