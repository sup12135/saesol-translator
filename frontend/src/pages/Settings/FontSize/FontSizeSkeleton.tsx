// src/pages/Settings/FontSize/FontSizeSkeleton.tsx


function FontSizeSkeleton() {
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
        {/* 왼쪽 '글자 크기 화면' 배지 */}
        <div style={{ width: '180px', height: '48px', borderRadius: '30px', backgroundColor: skeletonColors.grayElement }} />

        {/* 오른쪽 원형 닫기 버튼 */}
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: skeletonColors.darkElement }} />
      </div>

      {/* 중앙 설정 영역 조작판 */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        marginTop: '-20px'
      }}>
        {/* 중앙 프리뷰 + 인풋 + 증감컴포넌트 레이아웃 동기화 (gap: 40px) */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '40px',
          width: '100%',
          maxWidth: '1000px',
          justifyContent: 'center'
        }}>
          {/* 가나다라 프리뷰 박스 플레이스홀더 */}
          <div style={{
            width: '450px',
            height: '300px',
            backgroundColor: skeletonColors.grayElement,
            borderRadius: '24px'
          }} />

          {/* px 입력창 플레이스홀더 */}
          <div style={{
            width: '200px',
            height: '300px',
            backgroundColor: skeletonColors.grayElement,
            borderRadius: '24px'
          }} />

          {/* 증감 버튼 수직 쌍 플레이스홀더 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '24px', backgroundColor: skeletonColors.grayElement }} />
            <div style={{ width: '140px', height: '140px', borderRadius: '24px', backgroundColor: skeletonColors.grayElement }} />
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

export default FontSizeSkeleton;
