// src/pages/Settings/TTS/Components/VoiceCard.style.ts

export const styles = {
  cardBase: {
    height: '350px', // MenuButton과 일치감 있게 350px로 밸런싱
    cursor: 'pointer',
    borderRadius: '12px',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    transition: 'all 0.2s ease-in-out',
  } as const,

  iconCircle: {
    width: '120px', 
    height: '120px', 
    borderRadius: '50%', 
    backgroundColor: '#f1f3f5', 
    marginBottom: '24px',
    display: 'flex',       
    alignItems: 'center',
    justifyContent: 'center',
    color: '#2b4c59',
  } as const,
  
  labelText: { 
    fontWeight: '700', 
    fontSize: '2rem', // MenuButton의 글자 크기와 통일
    color: '#333333',
  } as const
};