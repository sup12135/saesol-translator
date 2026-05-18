import { useState, useEffect } from 'react';

export function useTTSSetting() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  useEffect(() => {
    // 0.1초 비동기 처리 시뮬레이션
    const timer = setTimeout(() => {
      const savedVoice = localStorage.getItem('user_tts_voice');
      if (savedVoice) {
        setSelectedVoice(savedVoice);
      }
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleVoiceSelect = (voiceType: string) => {
    setSelectedVoice(voiceType);
  };

  const saveVoiceSetting = () => {
    if (selectedVoice) {
      localStorage.setItem('user_tts_voice', selectedVoice);
      return true;
    }
    return false;
  };

  return { isLoading, selectedVoice, handleVoiceSelect, saveVoiceSetting };
}