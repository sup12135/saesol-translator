// src/pages/Home/SubtitleArea.tsx
import { useFontSize } from '../../hooks/UseFontSize'

interface SubtitleAreaProps {
  translatedText?: string;
  systemMsg?: string;
}

const SubtitleArea = ({ 
  translatedText = "번역 준비 완료", 
  systemMsg = "카메라 앞에서 수어를 시작하면 자동으로 인식합니다." 
}: SubtitleAreaProps) => {
  // [설계 준수] 커스텀 훅을 통해 폰트 크기 상태를 주입받음
  const fontSize = useFontSize(24);

  return (
    <footer style={styles.footer}>
      {/* [설계 준수] 전역 설정된 fontSize를 인라인 스타일로 적용 */}
      <div 
        id="txt_translated_result" 
        style={{ 
          ...styles.translatedResult,
          fontSize: `${fontSize}px` 
        }}
      >
        {translatedText}
      </div>
      
      {/* 시스템 안내 메시지 영역 */}
      <div id="msg_system_alert" style={styles.systemAlert}>
        {systemMsg}
      </div>
      
      <audio id="audio_tts_output" style={styles.audioHidden} />
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
    justifyContent: 'center'
  } as const,
  translatedResult: {
    fontWeight: 'bold', 
    transition: 'font-size 0.2s' 
  } as const,
  systemAlert: {
    fontSize: '14px', 
    color: '#888', 
    marginTop: '10px'
  } as const,
  audioHidden: {
    display: 'none'
  } as const
};

export default SubtitleArea;