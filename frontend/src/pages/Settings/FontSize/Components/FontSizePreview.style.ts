// src/pages/Settings/FontSize/Components/FontSizePreview.style.ts

export const styles = {
  previewBox: {
    width: '450px',
    height: '300px', // 전체적인 입체감 밸런스를 맞추기 위해 세로폭 살짝 조정
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid #e9ecef',
  } as const,
  infoText: {
    position: 'absolute',
    bottom: '20px',
    color: '#adb5bd',
    fontSize: '15px',
    fontWeight: '500',
  } as const,
};
