//src/pages/Settings/FontSize/index.tsx (SL_SC_04)

import React from 'react';
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
    handleInputChange, handleInputBlur, handleConfirm, navigate 
  } = useFontSize();

  if (isLoading) return <FontSizeSkeleton />;

  return (
    <div style={pageLayout}>
      <FontSizeHeader onBack={() => navigate('/Settings')} />

      <main style={mainStyle}>
        <div style={configContainer}>
          <FontSizePreview fontSize={fontSize} />
          <FontSizeInput 
            value={fontSize} 
            onChange={handleInputChange} 
            onBlur={handleInputBlur} 
          />
          <ControlButtons onUp={handleIncrease} onDown={handleDecrease} />
        </div>

        <ConfirmButton onClick={handleConfirm} />
      </main>
      <footer style={{ height: '100px' }} />
    </div>
  );
}

const pageLayout: React.CSSProperties = { display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', backgroundColor: '#f5f5f5', overflow: 'hidden' };
const mainStyle: React.CSSProperties = { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '60px' };
const configContainer: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '30px' };

export default FontSize;