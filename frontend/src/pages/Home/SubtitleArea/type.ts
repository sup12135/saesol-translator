// src/pages/Home/SubtitleArea/types.ts

export interface SubtitleAreaProps {
  translatedText?: string;

  systemMsg?: string;

  isTTSEnabled: boolean;

  onToggleTTS: () => void;
}