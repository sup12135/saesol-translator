// src/pages/Home/SkeletonStatusBadge.tsx

interface BadgeProps {
  showSkeleton: boolean;
}

const SkeletonStatusBadge = ({ showSkeleton }: BadgeProps) => {
  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      padding: '10px 20px',
      borderRadius: '30px',
      fontWeight: 'bold',
      fontSize: '14px',
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      // ON/OFF에 따른 배경색과 글자 변경
      backgroundColor: showSkeleton ? '#00ff88' : '#ff4444',
      color: showSkeleton ? '#000' : '#fff',
    }}>
      <span style={{
        display: 'inline-block',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: showSkeleton ? '#000' : '#fff'
      }} />
      {showSkeleton ? "스켈레톤 모드: ON" : "스켈레톤 모드: OFF"}
    </div>
  );
};

export default SkeletonStatusBadge;