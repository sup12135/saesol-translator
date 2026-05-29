//src/pages/Settings/index.tsx (SL_SC_02)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsSkeleton from './SettingsSkeleton';
import SettingsView from "./SettingsView";

function Settings() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <SettingsSkeleton />;

  return <SettingsView onNavigate={(path) => navigate(path)} />;
}

export default Settings;
