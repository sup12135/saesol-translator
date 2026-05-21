// src/pages/Settings/Components/MenuButton.style.ts

export const styles = {
  button: {
    height: '350px', 
    borderRadius: '12px', 
    backgroundColor: '#ADDFF1', 
    fontSize: '2rem', 
    cursor: 'pointer',
    border: '1px solid #ddd',
    width: '100%', // 그리드 내부에서 꽉 차게 배치되도록 안전하게 추가
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const,

  contentWrapper: {
    display: 'flex',
    flexDirection: 'column', // 아이콘이 글자 위쪽으로 오도록 세로 정렬
    alignItems: 'center',
    justifyContent: 'center',
    gap: '20px', // 아이콘과 글자 사이의 여백 간격
  } as const,

  labelText: {
    fontWeight: 'bold',
    color: '#333333'
  } as const
};