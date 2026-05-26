// src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook điều hướng mới

const AdminPage: React.FC = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hook

  // Lưu ý: Logic SDK (isPiConnected) nên được chuyển vào AuthContext
  // Ở đây chúng ta chỉ giữ lại giao diện
  
  return (
    <div style={pageContainer}>
      {/* HEADER GIỮ NGUYÊN UI */}
      <div style={header}>
        <div style={{ fontSize: '48px' }}>👑</div>
        <div>
          <h1 style={title}>BẢNG ĐIỀU KHIỂN ADMIN</h1>
          <p style={subtitle}>Quản trị hệ thống GHN.PI • Pi Network</p>
        </div>
      </div>

      {/* CÁC NÚT BẤM ĐIỀU HƯỚNG */}
      <div style={grid}>
        <button style={adminButton} onClick={() => navigate('/admin/don-hang')}>
          📦 Quản lý đơn hàng
        </button>
        <button style={adminButton} onClick={() => navigate('/admin/bao-cao')}>
          💰 Báo cáo tài chính Pi
        </button>
        <button style={adminButton} onClick={() => navigate('/admin/cai-dat')}>
          ⚙️ Cài đặt hệ thống
        </button>
        <button style={adminButton} onClick={() => navigate('/admin/thong-ke')}>
          📊 Thống kê thanh toán Pi
        </button>
      </div>
    </div>
  );
};

/* STYLES GIỮ NGUYÊN 100% */
const pageContainer = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 100px',
  boxSizing: 'border-box' as const
};

const header = { 
  textAlign: 'center' as const, 
  marginBottom: '30px',
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center'
};

const title = { fontSize: '28px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle = { color: '#6b21a8', marginTop: '8px' };

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '14px',
  marginBottom: '30px'
};

const adminButton = {
  padding: '20px',
  background: 'white',
  border: '1px solid #e9d5ff',
  borderRadius: '20px',
  fontWeight: '600',
  color: '#4c1d95',
  cursor: 'pointer'
};

export default AdminPage;