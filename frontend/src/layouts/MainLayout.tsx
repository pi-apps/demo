import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hàm điều hướng chuẩn cho các Layout con
  const handleNavigate = (page: string) => {
    navigate(`/${page === 'home' ? '' : page}`);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '80px', background: '#f3e8ff' }}>
      <main>
        <Outlet /> 
      </main>
      {/* Truyền đủ props để hết lỗi đỏ */}
      <BottomNav 
        onNavigate={handleNavigate} 
        currentPage={location.pathname.replace('/', '') || 'home'} 
      />
    </div>
  );
};

export default MainLayout;