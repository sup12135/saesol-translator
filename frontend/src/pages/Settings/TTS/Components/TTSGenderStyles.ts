// src/pages/Settings/TTS/Components/ttsGenderStyles.ts

export const genderButtonStyle = (
  isSelected: boolean
): React.CSSProperties => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: isSelected ? '#CDE6EF' : '#E0E0E0',
  transition: 'background-color 0.2s ease',
});

export const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  gap: '40px',
  padding: '20px 0',
};