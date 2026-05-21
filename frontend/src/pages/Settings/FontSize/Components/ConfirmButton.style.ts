// src/pages/Settings/FontSize/Components/ConfirmButton.style.ts

export const styles = {
  footer: {
    padding: '30px 0 10px',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
  } as const,

  confirmButton: {
    width: '100%', // 가로폭을 채워서 TTS페이지 완료 버튼과 동일한 선상 배치
    height: '60px',
    borderRadius: '30px', // 일관된 알약 모양 크롬 라운딩
    backgroundColor: '#CDE6EF',
    color: '#2b4c59',          
    fontSize: '18px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(205, 230, 239, 0.4)',
    transition: 'all 0.2s ease',
  } as const,
};