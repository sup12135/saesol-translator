//src/pages/Home/HomeSkeleton.tsx

import React from 'react';

function HomeSkeleton() {
  // 공통 네모칸 스타일
  const lineStyle: React.CSSProperties = {
    backgroundColor: '#e0e0e0',
    borderRadius: '4px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      
      {/* 1. 메인 콘텐츠 영역 (CameraView 스켈레톤) [cite: 12, 16] */}
      <main style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        backgroundColor: '#f5f5f5'
      }}>
        {/* 카메라 스트림 뷰 영역: cam_stream_view  */}
        <div id="cam_stream_view" style={{
          width: '100%',
          maxWidth: '1000px',
          aspectRatio: '16 / 9',
          backgroundColor: '#ccc',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* 로딩 인디케이터 Placeholder */}
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#e0e0e0' }}></div>
        </div>
      </main>

      {/* 2. 하단 자막 영역 (SubtitleArea 스켈레톤) [cite: 13, 16] */}
      <footer style={{
        height: '160px',
        padding: '20px 40px',
        backgroundColor: '#fff',
        borderTop: '1px solid #eee',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '12px'
      }}>
        {/* 번역 결과 텍스트 영역: txt_translated_result  */}
        <div id="txt_translated_result" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ ...lineStyle, width: '100%', height: '28px' }}></div>
          <div style={{ ...lineStyle, width: '60%', height: '20px' }}></div>
        </div>

        {/* 시스템 안내 메시지 영역: msg_system_alert  */}
        <div id="msg_system_alert" style={{ ...lineStyle, width: '250px', height: '16px', marginTop: '5px' }}></div>
        
        {/* 오디오 요소: audio_tts_output  */}
        <audio id="audio_tts_output" style={{ display: 'none' }} />
      </footer>

    </div>
  );
}

export default HomeSkeleton;