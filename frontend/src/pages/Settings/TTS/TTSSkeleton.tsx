// src/pages/Settings/TTS/TTSSkeleton.tsx

import React from 'react';

function TTSSkeleton() {
  const skeletonColors = {
    background: '#f8f9fa',
    grayElement: '#e9ecef',
    darkElement: '#dee2e6',
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: skeletonColors.background,
      padding: '160px 60px 70px 60px', // 여백 동기화
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* 상단바 영역 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        paddingBottom: '20px'
      }}>
        {/* 왼쪽 '음성 설정 화면' 배지 */}
        <div style={{ width: '180px', height: '48px', borderRadius: '30px', backgroundColor: skeletonColors.grayElement }} />

        {/* 오른쪽 원형 닫기 버튼 */}
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: skeletonColors.darkElement }} />
      </div>

      {/* 중앙 남/여 보이스 카드 선택 영역 */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        marginTop: '-20px'
      }}>
        {/* 실제 화면 크기에 똑같이 맞춤 (maxWidth: 1000px, gap: 40px) */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px', 
          width: '100%', 
          maxWidth: '1000px' 
        }}>
          {/* 남성 목소리 카드 플레이스홀더 */}
          <div style={{ 
            height: '350px', 
            borderRadius: '12px', 
            backgroundColor: skeletonColors.grayElement,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px'
          }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: skeletonColors.darkElement }} />
            <div style={{ width: '160px', height: '35px', borderRadius: '6px', backgroundColor: skeletonColors.darkElement }} />
          </div>

          {/* 여성 목소리 카드 플레이스홀더 */}
          <div style={{ 
            height: '350px', 
            borderRadius: '12px', 
            backgroundColor: skeletonColors.grayElement,
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px'
          }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: skeletonColors.darkElement }} />
            <div style={{ width: '160px', height: '35px', borderRadius: '6px', backgroundColor: skeletonColors.darkElement }} />
          </div>
        </div>
      </main>

      {/* 하단 공통 규격 완료 버튼 영역 */}
      <footer style={{ padding: '30px 0 10px', width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ 
          width: '100%', 
          height: '60px', 
          borderRadius: '30px', 
          backgroundColor: skeletonColors.grayElement 
        }} />
      </footer>
    </div>
  );
}

export default TTSSkeleton;