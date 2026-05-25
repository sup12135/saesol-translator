// src/pages/Home/SubtitleArea.tsx

import { useFontSize } from '../../hooks/UseFontSize';

interface SubtitleAreaProps {
  translatedText?: string;
  systemMsg?: string;

  isTTSEnabled: boolean;
  onToggleTTS: () => void;
}

const SubtitleArea = ({
  translatedText,
  systemMsg = '카메라 앞에서 수어를 시작하면 자동으로 인식합니다.',

  isTTSEnabled,
  onToggleTTS,
}: SubtitleAreaProps) => {
  // 전역 폰트 크기
  const fontSize = useFontSize(24);

  return (
    <footer style={styles.footer}>
      {/* 상단 버튼 */}
      <div style={styles.topRow}>
        <button
          id="btn_toggle_tts"
          onClick={onToggleTTS}
          style={{
            ...styles.ttsButton,

            backgroundColor: isTTSEnabled
              ? '#5BB6D6'
              : '#D3DCE2',
          }}
        >
          {isTTSEnabled
            ? '🔊 음성 ON'
            : '🔇 음성 OFF'}
        </button>
      </div>

      {/* 번역 자막 */}
      <div
        id="txt_translated_result"
        style={{
          ...styles.translatedResult,
          fontSize: `${fontSize}px`,
        }}
      >
        {translatedText || '번역 준비 완료'}
      </div>

      {/* 시스템 메시지 */}
      <div
        id="msg_system_alert"
        style={styles.systemAlert}
      >
        {systemMsg}
      </div>

      {/* 오디오 */}
      <audio
        id="audio_tts_output"
        style={styles.audioHidden}
      />
    </footer>
  );
};

const styles = {
  footer: {
    height: '160px',

    padding: '20px 40px',

    backgroundColor: '#fff',

    borderTop: '1px solid #eee',

    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  } as const,

  topRow: {
    display: 'flex',

    justifyContent: 'flex-end',

    marginBottom: '12px',
  } as const,

  ttsButton: {
    border: 'none',

    borderRadius: '12px',

    padding: '10px 18px',

    color: '#fff',

    fontSize: '14px',

    fontWeight: 600,

    cursor: 'pointer',

    transition: '0.2s ease',
  } as const,

  translatedResult: {
    fontWeight: 'bold',

    transition: 'font-size 0.2s',
  } as const,

  systemAlert: {
    fontSize: '14px',

    color: '#888',

    marginTop: '10px',
  } as const,

  audioHidden: {
    display: 'none',
  } as const,
};

export default SubtitleArea;