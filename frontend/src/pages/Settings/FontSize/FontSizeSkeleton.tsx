// src/pages/Settings/FontSize/FontSizeSkeleton.tsx

import React from 'react';

function FontSizeSkeleton() {
  const colors = {
    background: '#f5f5f5',
    primaryGray: '#e0e0e0',  
    secondaryGray: '#d0d0d0', 
    darkGray: '#bcbcbc'       
  };

  const roundButtonStyle: React.CSSProperties = {
    backgroundColor: colors.secondaryGray,
    borderRadius: '30px'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: colors.background,
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* 1. 상단/좌측 고정 요소 (X 버튼 및 타이틀) */}
      <div style={{ 
        padding: '150px 100px 20px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start'
      }}>
        {/* 타이틀 버튼: '글자 크기' 공간 */}
        {/* <div style={{
          ...roundButtonStyle,
          width: '200px',
          height: '70px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        </div> */}

        {/* 우측 상단 X 버튼 공간 */}
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '50%', 
          backgroundColor: colors.secondaryGray,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ width: '24px', height: '24px', backgroundColor: colors.darkGray }}></div>
        </div>
      </div>

      {/* 2. 메인 설정 영역 (중앙 배치) */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '50px' 
      }}>
        {/* 중앙 조절 섹션 (테두리 프레임 내부 구성만 유지) */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '40px',
          padding: '20px'
        }}>
          {/* 수치 표시 영역: input_font_size */}
          <div id="input_font_size" style={{
            width: '440px',
            height: '280px',
            backgroundColor: colors.primaryGray,
            borderRadius: '12px'
          }}></div>

          {/* 증감 버튼 수직 배치 그룹 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 증가 버튼: btn_font_up */}
            <div id="btn_font_up" style={{ 
              ...roundButtonStyle, 
              width: '140px', 
              height: '140px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ width: '0', height: '0', borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderBottom: '28px solid #bcbcbc' }}></div>
            </div>

            {/* 감소 버튼: btn_font_down */}
            <div id="btn_font_down" style={{ 
              ...roundButtonStyle, 
              width: '140px', 
              height: '140px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{ width: '0', height: '0', borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: '28px solid #bcbcbc' }}></div>
            </div>
          </div>
        </div>

        {/* 3. 하단 설정 완료 버튼: btn_font_confirm */}
        <div id="btn_font_confirm" style={{
          ...roundButtonStyle,
          width: '300px',
          height: '75px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
        </div>
      </main>

      {/* 하단 여백 유지 */}
      <footer style={{ height: '100px' }}></footer>
    </div>
  );
}

export default FontSizeSkeleton;