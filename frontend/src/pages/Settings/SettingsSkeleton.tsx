//src/pages/Settings/SettingsSkeleton.tsx

import React from 'react';


function SettingsSkeleton() {
  const boxStyle: React.CSSProperties = {
    backgroundColor: '#e0e0e0',
    borderRadius: '12px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: '#f5f5f5',
      overflow: 'hidden'
    }}>
      {/* 상단바 영역: 왼쪽과 중앙을 비우고 오른쪽 X 버튼만 배치 */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'flex-end', 
        padding: '150px 100px 20px' 
      }}>
        {/* 우측 상단 X 버튼 공간: btn_back_to_main 대응  */}
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '8px', 
          backgroundColor: '#d0d0d0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* X 모양 플레이스홀더  */}
          <div style={{ width: '20px', height: '20px', backgroundColor: '#bcbcbc' }}></div>
        </div>
      </div>

      {/* 중앙 메뉴 선택 영역 [cite: 42, 43] */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '0 60px' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px', 
          width: '100%', 
          maxWidth: '1000px' 
        }}>
          {/* 음성 설정 버튼 영역: btn_nav_tts  */}
          <div id="btn_nav_tts" style={{ 
            ...boxStyle, 
            height: '350px', 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '40px',
            gap: '20px'
          }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#d0d0d0' }}></div>
            <div style={{ width: '60%', height: '32px', backgroundColor: '#d0d0d0' }}></div>
            <div style={{ width: '100%', height: '20px', backgroundColor: '#d0d0d0' }}></div>
          </div>

          {/* 글자 크기 버튼 영역: btn_nav_font  */}
          <div id="btn_nav_font" style={{ 
            ...boxStyle, 
            height: '350px', 
            display: 'flex', 
            flexDirection: 'column', 
            padding: '40px',
            gap: '20px'
          }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#d0d0d0' }}></div>
            <div style={{ width: '60%', height: '32px', backgroundColor: '#d0d0d0' }}></div>
            <div style={{ width: '100%', height: '20px', backgroundColor: '#d0d0d0' }}></div>
          </div>
        </div>
      </main>

      {/* 하단 여백  */}
      <footer style={{ height: '80px' }}></footer>
    </div>
  );
}

export default SettingsSkeleton;