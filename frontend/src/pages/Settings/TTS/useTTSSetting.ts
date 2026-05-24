// src/pages/Settings/TTS/useTTSSetting.ts

import { useState, useEffect } from 'react';
import { TTS_VOICES } from './constants/Voices';
import { playAzureSpeech } from './services/azureTTSService';

export function useTTSSetting() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);

  // 기존 설정 불러오기
  useEffect(() => {
    const savedVoice = localStorage.getItem('user_tts_voice');

    setSelectedVoice(savedVoice || 'female');
    setIsLoading(false);
  }, []);

  // 카드 선택
  const handleVoiceSelect = (voiceType: string) => {
    setSelectedVoice(voiceType);
  };

  // 설정 저장
  const saveVoiceSetting = () => {
    if (selectedVoice) {
      localStorage.setItem('user_tts_voice', selectedVoice);
      return true;
    }

    return false;
  };

  // 미리듣기
  const handlePlayPreview = async (
    voiceType: 'male' | 'female'
  ) => {
    setIsLoading(true);

    try {
      const azureVoiceName = TTS_VOICES[voiceType];

      await playAzureSpeech({
        text: '안녕하세요.',
        voiceName: azureVoiceName,
      });
    } catch (error: any) {
      console.error('TTS 실행 중 에러:', error);

      alert(
        error.message || '음성 합성 중 오류가 발생했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    selectedVoice,
    handleVoiceSelect,
    saveVoiceSetting,
    handlePlayPreview,
  };
}