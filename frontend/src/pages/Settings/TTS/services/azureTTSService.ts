// src/pages/Settings/TTS/services/azureTTSService.ts

import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

interface PlaySpeechParams {
  text: string;
  voiceName: string;
}

/**
 * Azure TTS API를 호출하여 브라우저 스피커로 음성을 즉시 재생합니다.
 */
export const playAzureSpeech = ({ text, voiceName }: PlaySpeechParams): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const azureKey = import.meta.env.VITE_AZURE_TTS_KEY;
      const azureRegion = import.meta.env.VITE_AZURE_TTS_REGION || 'koreacentral';

      if (!azureKey) {
        return reject(new Error('Azure TTS API Key가 설정되지 않았습니다. .env.local 파일을 확인해주세요.'));
      }

      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(azureKey, azureRegion);
      speechConfig.speechSynthesisVoiceName = voiceName;

      const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
      const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            console.log('음성 합성 및 재생 성공!');
            resolve();
          } else {
            reject(new Error(`Azure TTS 변환 실패: ${result.errorDetails}`));
          }
          synthesizer.close();
        },
        (error) => {
          synthesizer.close();
          reject(error);
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};