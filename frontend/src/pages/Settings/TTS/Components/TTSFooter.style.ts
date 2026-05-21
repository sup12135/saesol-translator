// src/pages/Settings/TTS/Components/TTSFooter.style.ts

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
    width: '100%', 
    height: '60px', 
    borderRadius: '30px', // 헤더 타이틀과 일치하는 라운딩 캡슐 스타일
    border: 'none',
    fontSize: '18px',
    fontWeight: '700', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'all 0.2s ease',
  } as const,
};