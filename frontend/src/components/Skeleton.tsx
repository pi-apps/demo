import React from 'react';

const Skeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={skeletonCard}>
          <div style={skeletonHeader} />
          <div style={skeletonLine} />
          <div style={skeletonLineShort} />
        </div>
      ))}
    </>
  );
};

const skeletonCard: React.CSSProperties = {
  background: '#fff',
  borderRadius: '20px',
  padding: '20px',
  marginBottom: '16px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
};

const skeletonHeader: React.CSSProperties = {
  height: '20px',
  width: '60%',
  background: 'linear-gradient(90deg, #e0d4ff 25%, #f3e8ff 50%, #e0d4ff 75%)',
  backgroundSize: '200% 100%',
  borderRadius: '8px',
  animation: 'loading 1.4s infinite',
  marginBottom: '16px',
};

const skeletonLine: React.CSSProperties = {
  height: '14px',
  background: 'linear-gradient(90deg, #e0d4ff 25%, #f3e8ff 50%, #e0d4ff 75%)',
  backgroundSize: '200% 100%',
  borderRadius: '8px',
  animation: 'loading 1.4s infinite',
  marginBottom: '10px',
};

const skeletonLineShort: React.CSSProperties = {
  ...skeletonLine,
  width: '70%',
};

export default Skeleton;