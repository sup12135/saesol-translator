//src/pages/Settings/FontSize/index.tsx (SL_SC_04)

import React from 'react';
import { useFontSize } from './useFontSize';
import { FontSizePreview } from "./Components/FontSizePreview";
import { FontSizeInput } from "./Components/FontSizeInput";
import { ControlButtons } from "./Components/ControlButtons";
import { ConfirmButton } from "./Components/ConfirmButton";
import FontSizeSkeleton from "./FontSizeSkeleton";

function FontSize() {
  const { 
    fontSize, isLoading, handleIncrease, handleDecrease, 
    handleInputChange, handleInputBlur, handleConfirm, navigate 
  } = useFontSize();

  if (isLoading) return <FontSizeSkeleton />;

  return (
    <div style={pageLayout}>
      <header style={headerStyle}>
        <button onClick={() => navigate(-1)} style={closeBtnStyle}>✕</button>
      </header>

      <main style={mainStyle}>
        <div style={configContainer}>
          {/* 1. 실제 텍스트 크기를 보여주는 미리보기 박스 */}
          <FontSizePreview fontSize={fontSize} />

          {/* 2. 숫자를 직접 수정하는 입력창 */}
          <FontSizeInput 
            value={fontSize} 
            onChange={handleInputChange} 
            onBlur={handleInputBlur} 
          />

          {/* 3. 증감 버튼 */}
          <ControlButtons onUp={handleIncrease} onDown={handleDecrease} />
        </div>

        <ConfirmButton onClick={handleConfirm} />
      </main>
      <footer style={{ height: '100px' }} />
    </div>
  );
}

// 레이아웃 스타일
const pageLayout: React.CSSProperties = { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#f5f5f5', overflow: 'hidden' };
const mainStyle: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '60px' };
const configContainer: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '30px' };
const headerStyle: React.CSSProperties = { padding: '40px 60px', display: 'flex', justifyContent: 'flex-end' };
const closeBtnStyle: React.CSSProperties = { width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#d0d0d0', border: 'none', cursor: 'pointer', fontSize: '30px', color: '#666' };

export default FontSize;