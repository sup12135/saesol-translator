//src/pages/Home/SubtitleArea.tsx

interface SubtitleAreaProps {
  translatedText?: string;
  systemMsg?: string;
}

const SubtitleArea = ({ 
  translatedText = "번역 준비 완료", 
  systemMsg = "카메라 앞에서 수어를 시작하면 자동으로 인식합니다." 
}: SubtitleAreaProps) => (
  <footer style={{
    height: '160px',
    padding: '20px 40px',
    backgroundColor: '#fff',
    borderTop: '1px solid #eee',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    {/* 번역 결과 텍스트 영역 */}
    <div id="txt_translated_result" style={{ fontSize: '24px', fontWeight: 'bold' }}>
      {translatedText}
    </div>
    {/* 시스템 안내 메시지 영역 */}
    <div id="msg_system_alert" style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>
      {systemMsg}
    </div>
    {/* 오디오 출력 엘리먼트 */}
    <audio id="audio_tts_output" style={{ display: 'none' }} />
  </footer>
);

export default SubtitleArea;