// src/pages/Settings/FontSize/components/FontSizePreview.tsx
export const FontSizePreview = ({ fontSize }: { fontSize: number }) => (
  <div style={previewBoxStyle}>
    <span style={{ fontSize: `${fontSize}px`, fontWeight: 'bold', color: '#333' }}>
      가나다라
    </span>
    <p style={{ position: 'absolute', bottom: '20px', color: '#999', fontSize: '15px' }}>
      글자 크기 미리보기
    </p>
  </div>
);

const previewBoxStyle: React.CSSProperties = {
  width: '450px',
  height: '280px',
  backgroundColor: '#FFFFFF',
  borderRadius: '24px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  position: 'relative',
  overflow: 'hidden'
};