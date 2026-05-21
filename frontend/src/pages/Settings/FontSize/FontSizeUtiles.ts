// src/pages/Settings/FontSize/fontSizeUtils.ts

/**
 * 설계서 준수: 입력값을 최소 24px ~ 최대 80px 범위로 제한하고
 * 홀수인 경우 짝수로 올림(단, 80을 넘으면 내림) 보정하는 함수
 */
export const correctFontSize = (value: number): number => {
  let corrected = value;

  // 1. 범위 보정
  if (corrected < 24) {
    corrected = 24;
  } else if (corrected > 80) {
    corrected = 80;
  }

  // 2. 홀수 판별 및 짝수 보정
  if (corrected % 2 !== 0) {
    corrected = corrected + 1 > 80 ? corrected - 1 : corrected + 1;
  }

  return corrected;
};