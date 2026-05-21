// src/components/Header/HeaderButtons.style.ts

export const styles = {
  container: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  } as const,

  linkButton: {
    backgroundColor: '#CDE6EF',
    color: '#333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'none',
    width: '150px',
    padding: '10px 18px',
    borderRadius: '30px',
    border: '2px solid rgba(255,255,255,0.8)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    transition: 'all 0.2s ease-in-out',
  } as const,

  contentWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  } as const,

  buttonText: {
    fontSize: '15px',
    fontWeight: '600',
    lineHeight: 1,
  } as const,
};