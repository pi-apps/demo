import React from 'react';

interface BottomNavProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const BottomNav: React.FC<BottomNavProps> = ({
  onNavigate,
  currentPage
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3">
      <button onClick={() => onNavigate('home')}>
        Home
      </button>

      <button onClick={() => onNavigate('tracking')}>
        Tracking
      </button>

      <button onClick={() => onNavigate('orders')}>
        Orders
      </button>

      <button onClick={() => onNavigate('profile')}>
        Profile
      </button>
    </div>
  );
};

export default BottomNav;