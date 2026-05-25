// src/pages/Home/hooks/useSubtitleTest.ts

export function getRandomTestSentence() {
  const testSentences = [
    '안녕하세요.',
    '수어 번역 테스트입니다.',
    '오늘 날씨가 정말 좋습니다.',
    'AI 음성 출력 기능 테스트 중입니다.',
    '실시간 자막 음성 변환 기능입니다.',
  ];

  return testSentences[
    Math.floor(
      Math.random() *
        testSentences.length
    )
  ];
}