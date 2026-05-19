//src/pages/Settings/TTS/TTSSkeleton

import React from 'react';


function TTSSkeleton() {
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
      {/* 1. 상단 타이틀 및 X 버튼 영역 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        alignItems: 'center', 
        padding: '150px 100px 20px' 
      }}>
        {/* 중앙 타이틀: 음성 설정 */}
        {/* <div style={{ width: '200px', height: '40px' }}></div> */}

        {/* 우측 상단 X 버튼 공간 */}
        <div style={{ 
          width: '48px', 
          height: '48px', 
          borderRadius: '8px', 
          backgroundColor: '#d0d0d0' 
        }}></div>
      </div>

      {/* 2. 중앙 목소리 선택 영역 (남/여 카드) */}
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
          maxWidth: '900px' 
        }}>
          {/* 남성 음성 선택 버튼: btn_tts_male */}
          <div id="btn_tts_male" style={{ 
            ...boxStyle, 
            height: '300px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            backgroundColor: '#fff', // 카드는 보통 밝은 배경
            border: '2px solid #e0e0e0'
          }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e0e0e0' }}></div>
            <div style={{ width: '80px', height: '24px', backgroundColor: '#e0e0e0' }}></div>
          </div>

          {/* 여성 음성 선택 버튼: btn_tts_female */}
          <div id="btn_tts_female" style={{ 
            ...boxStyle, 
            height: '300px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            backgroundColor: '#fff',
            border: '2px solid #e0e0e0'
          }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#e0e0e0' }}></div>
            <div style={{ width: '80px', height: '24px', backgroundColor: '#e0e0e0' }}></div>
          </div>
        </div>
      </main>

      {/* 3. 하단 설정 완료 버튼 영역 */}
      <footer style={{ 
        padding: '40px 60px', 
        display: 'flex', 
        justifyContent: 'center' 
      }}>
        {/* 설정 완료 버튼: btn_tts_confirm */}
        <div id="btn_tts_confirm" style={{ 
          ...boxStyle, 
          width: '100%', 
          maxWidth: '400px', 
          height: '60px',
          backgroundColor: '#d0d0d0'
        }}></div>
      </footer>
    </div>
  );
}

export default TTSSkeleton;