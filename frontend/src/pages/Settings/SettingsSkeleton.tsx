// src/pages/Settings/SettingsSkeleton.tsx


function SettingsSkeleton() {
  const skeletonColors = {
    background: '#f8f9fa',   // 변경된 메인 배경색 통일
    grayElement: '#e9ecef',  // 은은한 스켈레톤 기본 회색
    darkElement: '#dee2e6',  // 조금 더 진한 회색 포인트
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      width: '100vw', 
      backgroundColor: skeletonColors.background,
      padding: '160px 60px 70px 60px', // 실제 화면과 동일한 공통 헤더 안전 여백
      boxSizing: 'border-box',
      overflow: 'hidden'
    }}>
      {/* 상단바 영역: 실물 디자인과 가로선 정렬 통일 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        paddingBottom: '20px'
      }}>
        {/* 왼쪽 '환경 설정 화면' 배지용 스켈레톤 */}
        <div style={{ 
          width: '180px', 
          height: '48px', 
          borderRadius: '30px', 
          backgroundColor: skeletonColors.grayElement 
        }} />

        {/* 오른쪽 원형 닫기 버튼용 스켈레톤 (56px) */}
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          backgroundColor: skeletonColors.darkElement 
        }} />
      </div>

      {/* 중앙 메뉴 카드 영역 */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        width: '100%',
        marginTop: '-20px'
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '40px', 
          width: '100%', 
          maxWidth: '1000px' 
        }}>
          {/* 음성 설정 버튼 플레이스홀더 */}
          <div style={{ 
            height: '350px', 
            borderRadius: '12px', 
            backgroundColor: skeletonColors.grayElement,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: skeletonColors.darkElement }} />
            <div style={{ width: '140px', height: '32px', borderRadius: '6px', backgroundColor: skeletonColors.darkElement }} />
          </div>

          {/* 글자 크기 버튼 플레이스홀더 */}
          <div style={{ 
            height: '350px', 
            borderRadius: '12px', 
            backgroundColor: skeletonColors.grayElement,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px'
          }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: skeletonColors.darkElement }} />
            <div style={{ width: '140px', height: '32px', borderRadius: '6px', backgroundColor: skeletonColors.darkElement }} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default SettingsSkeleton;
