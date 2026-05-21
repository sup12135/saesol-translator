// src/pages/Settings/FontSize/Components/FontSizeInput.style.ts

export const styles = {
  inputWrapper: {
    width: '200px',
    height: '300px', // 프리뷰 박스와 수직 밸런스를 맞추기 위해 고도 동기화
    backgroundColor: '#FFFFFF',
    borderRadius: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #e9ecef',
  } as const,
  input: {
    width: '120px',
    border: 'none',
    background: 'transparent',
    fontSize: '54px', // 숫자가 더 시원시원하게 보이도록 확대
    fontWeight: '800',
    textAlign: 'center',
    outline: 'none',
    color: '#2b4c59', // 포인트 컬러 계열로 통일
  } as const,
  unit: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#868e96',
  } as const,
};