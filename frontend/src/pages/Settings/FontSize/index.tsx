//src/pages/Settings/FontSize/index.tsx (SL_SC_04)

import FontSizeSkeleton from "./FontSizeSkeleton";

function FontSize() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <FontSizeSkeleton />
    </div>
  );
}

export default FontSize;