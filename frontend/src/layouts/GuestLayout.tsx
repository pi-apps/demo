import React from 'react';

// 1. Định nghĩa Props: Nhận hàm mở modal từ cha truyền vào
interface KhachMoiLayoutProps {
  children: React.ReactNode;
  onOpenLogin: () => void; // Thay vì tự chứa state showLogin, ta nhận hàm này từ ngoài
}

const KhachMoiLayout: React.FC<KhachMoiLayoutProps> = ({ 
  children, 
  onOpenLogin 
}) => {
  return (
    <div style={pageContainer}>
      {/* GUEST HEADER - UI thuần túy */}
      <div style={guestHeader}>
        <div style={logo}>🚚 GHN.PI</div>
        <p style={subtitle}>Giao hàng nhanh • Thanh toán bằng Pi</p>

        <button 
          onClick={onOpenLogin}
          style={loginButton}
        >
          ⭐ Đăng nhập Pi Network
        </button>
      </div>

      <main style={mainContent}>
        {children}
      </main>
      
      {/* Lưu ý: Modal sẽ không nằm ở đây nữa. 
         Nó sẽ được quản lý tại MainLayout hoặc trang cha để tránh re-render layout.
      */}
    </div>
  );
};

/* STYLES (Giữ nguyên giao diện của bạn) */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3e8ff',
  boxSizing: 'border-box'
};

const guestHeader: React.CSSProperties = {
  background: '#4c1d95',
  color: 'white',
  padding: '20px 16px',
  textAlign: 'center' as const,
  position: 'sticky',
  top: 0,
  zIndex: 100,
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
};

const logo: React.CSSProperties = { fontSize: '32px', fontWeight: '800', marginBottom: '8px' };
const subtitle: React.CSSProperties = { color: '#c4b5fd', fontSize: '14px', marginBottom: '16px' };
const loginButton: React.CSSProperties = {
  background: '#ffffff',
  color: '#4c1d95',
  border: 'none',
  padding: '12px 24px',
  borderRadius: '9999px',
  fontWeight: '700',
  cursor: 'pointer'
};
const mainContent: React.CSSProperties = { padding: '20px 16px' };

export default KhachMoiLayout;