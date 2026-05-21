// src/pages/Settings/SettingsView.style.ts

export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f8f9fa',
    
    padding: '160px 60px 70px 60px', // 위, 오른쪽, 아래, 왼쪽
    
    boxSizing: 'border-box',
  } as const,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: '1000px',
    margin: '0 auto',
    paddingBottom: '20px',
    borderBottom: '2px solid #e9ecef',
  } as const,

  titleBadge: {
    backgroundColor: '#CDE6EF',
    color: '#2b4c59',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '12px 28px',
    borderRadius: '30px',
    border: '2px solid rgba(255,255,255,0.9)',
    boxShadow: '0 4px 10px rgba(205, 230, 239, 0.3)',
  } as const,

  titleText: {
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '-0.3px',
  } as const,

  closeButton: {
    width: '56px',
    height: '56px',
    border: 'none',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'all 0.2s ease',
  } as const,

  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: '-20px',
  } as const,

  menuGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '30px',
    width: '100%',
    maxWidth: '1000px',
  } as const,
};