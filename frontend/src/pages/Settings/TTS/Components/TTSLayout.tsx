export const TTSHeader = ({ onBack }: { onBack: () => void }) => (
  <header style={{ display: 'flex', justifyContent: 'flex-end', padding: '40px 60px 20px' }}>
    <button 
      onClick={onBack}
      style={{ width: '48px', height: '48px', border: 'none', borderRadius: '8px', backgroundColor: '#fff', cursor: 'pointer' }}
    >
      ✕
    </button>
  </header>
);

export const TTSFooter = ({ onConfirm, disabled }: { onConfirm: () => void, disabled: boolean }) => (
  <footer style={{ padding: '40px 60px', display: 'flex', justifyContent: 'center' }}>
    <button 
      id="btn_tts_confirm"
      onClick={onConfirm}
      disabled={disabled}
      style={{ 
        width: '100%', maxWidth: '400px', height: '60px', borderRadius: '12px', border: 'none',
        color: '#fff', fontWeight: 'bold', cursor: disabled ? 'not-allowed' : 'pointer',
        backgroundColor: disabled ? '#d0d0d0' : '#007bff'
      }}
    >
      설정 완료
    </button>
  </footer>
);