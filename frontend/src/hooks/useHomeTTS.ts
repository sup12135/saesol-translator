// src/pages/Home/hooks/useHomeTTS.ts

import { useEffect, useRef } from 'react';

import { playAzureSpeech } from '../pages/Settings/TTS/services/azureTTSService'

import { TTS_VOICES } from '../pages/Settings/TTS/constants/Voices'

interface Props {
  subtitleText: string;
  isTTSEnabled: boolean;
}

export function useHomeTTS({
  subtitleText,
  isTTSEnabled,
}: Props) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 첫 렌더링 방지
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // 자막 없음
    if (!subtitleText) return;

    // OFF 상태
    if (!isTTSEnabled) return;

    const runTTS = async () => {
      try {
        const selectedVoice =
          localStorage.getItem(
            'user_tts_voice'
          ) || 'female';

        const voiceName =
          TTS_VOICES[
            selectedVoice as
              | 'male'
              | 'female'
          ];

        await playAzureSpeech({
          text: subtitleText,
          voiceName,
        });
      } catch (error) {
        console.error(
          '자동 TTS 실행 실패:',
          error
        );
      }
    };

    runTTS();
  }, [subtitleText, isTTSEnabled]);
}