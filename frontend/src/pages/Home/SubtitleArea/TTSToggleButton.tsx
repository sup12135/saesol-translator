// // src/pages/Home/SubtitleArea/TTSToggleButton.tsx

// import { styles } from './SubtitleArea.style'

// interface Props {
//   isTTSEnabled: boolean;
//   onToggleTTS: () => void;
// }

// export function TTSToggleButton({
//   isTTSEnabled,
//   onToggleTTS,
// }: Props) {
//   return (
//     <button
//       id="btn_toggle_tts"
//       onClick={onToggleTTS}
//       style={{
//         ...styles.ttsButton,

//         backgroundColor: isTTSEnabled
//           ? '#5BB6D6'
//           : '#D3DCE2',
//       }}
//     >
//       {isTTSEnabled
//         ? '🔊 음성 ON'
//         : '🔇 음성 OFF'}
//     </button>
//   );
// }