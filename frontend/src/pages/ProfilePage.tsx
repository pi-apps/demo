import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';
import { ROLES, AppRole } from '../utils/constants';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const getRoleDisplayName = (role: AppRole | null) => {
    if (!role) return 'Chưa xác định';
    switch (role) {
      case ROLES.ADMIN: return 'Quản trị viên (Admin)';
      case ROLES.WAREHOUSE: return 'Quản lý Kho Hub';
      case ROLES.DRIVER: return 'Tài xế giao hàng';
      case ROLES.BUYER: return 'Người gửi hàng';
      case ROLES.SELLER: return 'Người nhận hàng';
      default: return role;
    }
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      logout();
      navigate('/dang-ky');
    }
  };

  // Lấy username từ user object (tùy theo cấu trúc PiUser)
  const username = user?.username || null;

  return (
    <div style={pageContainer}>
      <div style={roleBar}>
        <span>👤 Cá nhân</span>
        <button onClick={() => navigate('/ca-nhan')} style={changeRoleBtn}>
          Đổi vai trò
        </button>
      </div>

      <h1 style={titleStyle}>👤 TRANG CÁ NHÂN</h1>

      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={avatarStyle}>👤</div>
          <h2 style={{ fontSize: '24px', margin: '12px 0 4px' }}>
            {username ? `@${username}` : 'Khách vãng lai'}
          </h2>
          <p style={{ color: '#666', fontSize: '14px' }}>Mã thành viên: T.H97</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Vai trò hiện tại</label>
          <div style={roleBadgeStyle}>
            ✨ {getRoleDisplayName(role)}
          </div>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={labelStyle}>Trạng thái</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontWeight: '600' }}>
            <span style={statusDotStyle}></span>
            Đang trực tuyến
          </div>
        </div>

        <button onClick={handleLogout} style={logoutButtonStyle}>
          Đăng xuất 🚪
        </button>
      </div>
    </div>
  );
}

/* ===================== STYLES (GIỮ NGUYÊN) ===================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8f7ff', padding: '20px' };
const roleBar: React.CSSProperties = { background: '#4c1d95', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between', borderRadius: '12px' };
const changeRoleBtn: React.CSSProperties = { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '99px', padding: '4px 12px' };
const titleStyle: React.CSSProperties = { fontSize: '22px', color: '#4c1d95', textAlign: 'center', margin: '20px 0' };
const cardStyle: React.CSSProperties = { background: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };

const avatarStyle: React.CSSProperties = { 
  width: '90px', height: '90px', background: '#f3e8ff', borderRadius: '9999px', 
  margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', 
  fontSize: '42px', border: '6px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
};

const labelStyle: React.CSSProperties = { fontWeight: '700', color: '#4c1d95', marginBottom: '8px', fontSize: '14px' };
const roleBadgeStyle: React.CSSProperties = { 
  display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', 
  background: '#f3e8ff', color: '#4c1d95', borderRadius: '9999px', fontWeight: '600' 
};
const statusDotStyle: React.CSSProperties = { 
  display: 'inline-block', width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%' 
};
const logoutButtonStyle: React.CSSProperties = { 
  width: '100%', padding: '16px', background: '#ef4444', color: 'white', 
  border: 'none', borderRadius: '12px', fontWeight: '700', marginTop: '20px' 
};