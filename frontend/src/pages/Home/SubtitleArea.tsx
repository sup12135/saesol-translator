// src/pages/Home/SubtitleArea.tsx

import { useState, useEffect } from 'react';

interface SubtitleAreaProps {
  translatedText?: string;
  systemMsg?: string;
}

const SubtitleArea = ({ 
  translatedText = "번역 준비 완료", 
  systemMsg = "카메라 앞에서 수어를 시작하면 자동으로 인식합니다." 
}: SubtitleAreaProps) => {
  // [설계 준수] 초기 폰트 크기를 로컬 스토리지에서 로드 (기본값 24px)
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('app-font-size');
    return saved ? parseInt(saved, 10) : 24;
  });

  useEffect(() => {
    // 설정이 변경되었을 때 호출될 핸들러
    const handleStorageChange = () => {
      const updatedSize = localStorage.getItem('app-font-size');
      if (updatedSize) setFontSize(parseInt(updatedSize, 10));
    };

    // 동일 윈도우 내 Custom Event 감지 및 타 탭/윈도우의 storage 변경 감지
    window.addEventListener('font-size-changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('font-size-changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

return (
    <footer style={{
      height: '160px',
      padding: '20px 40px',
      backgroundColor: '#fff',
      borderTop: '1px solid #eee',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center' // 괄호를 제거하고 justifyContent로 수정
    }}>
      {/* [설계 준수] 전역 설정된 fontSize를 인라인 스타일로 적용 */}
      <div 
        id="txt_translated_result" 
        style={{ 
          fontSize: `${fontSize}px`, 
          fontWeight: 'bold', 
          transition: 'font-size 0.2s' 
        }}
      >
        {translatedText}
      </div>
      
      {/* 시스템 안내 메시지 영역  */}
      <div id="msg_system_alert" style={{ fontSize: '14px', color: '#888', marginTop: '10px' }}>
        {systemMsg}
      </div>
      
      <audio id="audio_tts_output" style={{ display: 'none' }} />
    </footer>
  );
};

export default SubtitleArea;