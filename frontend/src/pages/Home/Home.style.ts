// src/pages/Home/Home.style.ts

export const styles = {
  headerOffset: 81,

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
    height: 'calc(100% - 81px)',
    marginTop: '81px',
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
    width: '100%',
    height: '100%',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'center',
  } as const,

  videoStage: {
    position: 'relative',
    width: '100%',
    flex: 1,
    minHeight: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  } as const,

  controlsRow: {
    width: '100%',
    maxWidth: '1000px',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as const,

  modeGroup: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  } as const,

  modeBtn: {
    border: '1px solid #a6b0b8',
    backgroundColor: '#ffffff',
    color: '#22313f',
    borderRadius: '999px',
    padding: '7px 14px',
    fontWeight: 700,
    cursor: 'pointer',
  } as const,

  modeBtnActive: {
    backgroundColor: '#2f7fb5',
    color: '#fff',
    border: '1px solid #2f7fb5',
  } as const,

  fileInput: {
    maxWidth: '420px',
  } as const,
};
