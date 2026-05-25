// src/pages/Settings/TTS/services/azureTTSService.ts

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

interface PlayAzureSpeechParams {
  text: string;
  voiceName: string;
}

export async function playAzureSpeech({
  text,
  voiceName,
}: PlayAzureSpeechParams) {
  const speechKey =
    import.meta.env.VITE_AZURE_SPEECH_KEY;

  const speechRegion =
    import.meta.env.VITE_AZURE_SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    throw new Error(
      'Azure Speech API 설정이 누락되었습니다.'
    );
  }

  const speechConfig =
    SpeechSDK.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );

  speechConfig.speechSynthesisVoiceName =
    voiceName;

  const audioConfig =
    SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

  const synthesizer =
    new SpeechSDK.SpeechSynthesizer(
      speechConfig,
      audioConfig
    );

  return new Promise<void>((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,

      () => {
        synthesizer.close();
        resolve();
      },

      (error) => {
        synthesizer.close();
        reject(error);
      }
    );
  });
}