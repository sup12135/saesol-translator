//src/pages/Settings/index.tsx (SL_SC_02)

import SettingsSkeleton from "./SettingsSkeleton";

function Settings() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <SettingsSkeleton />
    </div>
  );
}

export default Settings;