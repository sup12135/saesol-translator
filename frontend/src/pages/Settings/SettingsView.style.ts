// src/pages/Settings/SettingsView.style.ts

export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f5f5f5',
  } as const,

  header: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '150px 100px 20px',
  } as const,

  closeButton: {
    width: '48px',
    height: '48px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#CDE6EF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const,

  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0 60px',
  } as const,

  menuGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    width: '100%',
    maxWidth: '1000px',
  } as const,

  // ==========================================
  // [새로 추가된 스타일] 아이콘 + 글자 세로 정렬 레이아웃
  // ==========================================
  menuItemWrapper: {
    display: 'flex',
    flexDirection: 'column', // 아이콘 아래에 글자가 오도록 세로 배치
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px', // 아이콘과 글자 사이의 여백 간격
    width: '100%',
    height: '100%',
  } as const,

  menuText: {
    fontSize: '20px', // 글자 크기도 시원시원하게 조절
    fontWeight: 'bold',
    color: '#333333',
  } as const,

  footer: {
    height: '80px',
  } as const,
};