// src/pages/Settings/FontSize/index.tsx (SL_SC_04)

import { useFontSize } from './useFontSize';
import { FontSizeHeader } from "./Components/FontSizeHeader"; 
import { FontSizePreview } from "./Components/FontSizePreview";
import { FontSizeInput } from "./Components/FontSizeInput";
import { ControlButtons } from "./Components/ControlButtons";
import { ConfirmButton } from "./Components/ConfirmButton";
import FontSizeSkeleton from "./FontSizeSkeleton";

function FontSize() {
  const { 
    fontSize, isLoading, handleIncrease, handleDecrease, 
    handleInputChange, handleInputBlur, handleConfirm 
  } = useFontSize();

  if (isLoading) return <FontSizeSkeleton />;

  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        width: '100vw', 
        backgroundColor: '#f8f9fa', // 통일된 소프트 화이트
        padding: '160px 60px 70px 60px', // 공통 헤더 완벽 대응
        boxSizing: 'border-box',
        overflow: 'hidden' 
      }}
    >
      {/* 완벽하게 가로줄 정렬선이 일치하는 헤더 */}
      <FontSizeHeader onBack={() => handleConfirm()} />

      {/* 중앙 메인 컨텐츠 영역 */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: '-20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px', width: '100%', maxWidth: '1000px', justifyContent: 'center' }}>
          <FontSizePreview fontSize={fontSize} />
          
          <FontSizeInput 
            value={fontSize} 
            onChange={handleInputChange} 
            onBlur={handleInputBlur} 
          />
          
          <ControlButtons onUp={handleIncrease} onDown={handleDecrease} />
        </div>
      </main>

      {/* 하단 공통 규격 완료 버튼 */}
      <ConfirmButton onClick={handleConfirm} />
    </div>
  );
}

export default FontSize;
