// src/pages/Home/Home.style.ts

export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
  } as const,

  contentWrapper: {
    flexDirection: 'column',
    height: '100%',
  } as const,

  main: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    minHeight: 0,
  } as const,

  videoContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '1000px',
  } as const,
};