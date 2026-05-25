// src/pages/Home/components/TTSTestButton.tsx

interface Props {
  onClick: () => void;
}

function TTSTestButton({
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',

        top: '20px',
        right: '20px',

        zIndex: 999,

        padding: '12px 18px',

        border: 'none',
        borderRadius: '12px',

        backgroundColor: '#5BB6D6',
        color: '#fff',

        fontSize: '14px',
        fontWeight: 600,

        cursor: 'pointer',

        boxShadow:
          '0 4px 12px rgba(91, 182, 214, 0.25)',

        transition: '0.2s ease',
      }}
    >
      TTS 테스트
    </button>
  );
}

export default TTSTestButton;