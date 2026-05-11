//src/pages/Settings/TTS/index.tsx (SL_SC_03)

import TTSSkeleton from "./TTSSkeleton";

function Settings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <TTSSkeleton />
    </div>
  );
}

export default Settings;