import React, { useState, useEffect } from 'react';

interface PullToRefreshProps {
  onRefresh: () => void;
  children: React.ReactNode;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => setStartY(e.touches[0].clientY);
    const handleTouchMove = (e: TouchEvent) => {
      const distance = e.touches[0].clientY - startY;
      if (distance > 0 && window.scrollY === 0) {
        setPullDistance(Math.min(distance * 0.6, 85));
      }
    };

    const handleTouchEnd = () => {
      if (pullDistance > 65 && !isRefreshing) {
        setIsRefreshing(true);
        onRefresh();
        // Tăng thời gian hiển thị để thấy vòng quay rõ
        setTimeout(() => {
          setIsRefreshing(false);
          setPullDistance(0);
        }, 1500);
      } else {
        setPullDistance(0);
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [pullDistance, isRefreshing, onRefresh, startY]);

  return (
    <div style={{ position: 'relative' }}>
      {isRefreshing && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          padding: '12px',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '50%',
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            border: '4px solid #e0d4ff',
            borderTopColor: '#7c3aed',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
        </div>
      )}
      {children}
    </div>
  );
};

export default PullToRefresh;