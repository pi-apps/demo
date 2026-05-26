import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePiAuth } from '../hooks/usePiAuth';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { piUsername } = usePiAuth();

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={logoContainer}>
        <div style={headerContainer}>
          <div style={logoStyle}>🚚 GHN.PI</div>
          <p style={subtitleStyle}>Giao hàng nhanh • Thanh toán bằng Pi</p>
        </div>
      </div>

      {/* Button Đăng nhập */}
      <div style={piButtonContainer}>
        <button style={piButton} onClick={() => navigate('/dang-ky')}>
          {piUsername ? `Đang kết nối: ${piUsername}` : '⭐ Đăng nhập với Pi Network'}
        </button>
      </div>

      {/* Grid Menu */}
      <div style={cardsGrid}>
        <Card title="GỬI HÀNG" icon="📦" desc="Tạo đơn hàng" onClick={() => navigate('/gui-hang')} />
        <Card title="TRA CỨU CƯỚC" icon="📊" desc="Ước tính phí" onClick={() => navigate('/tra-cuu-cuoc')} />
        <Card title="KHO HUB" icon="🏬" desc="Trung chuyển" onClick={() => navigate('/warehouse')} />
        <Card title="TÀI XẾ" icon="🏍️" desc="Đơn tài xế" onClick={() => navigate('/driver')} />
        <Card title="TRACKING" icon="🔍" desc="Tra cứu đơn" onClick={() => navigate('/tracking')} />
        <Card title="NHẬN HÀNG" icon="📥" desc="Đơn chờ nhận" onClick={() => navigate('/nhan-hang')} />

        {/* ĐÓNG GÓP */}
        <div 
          style={{...cardStyle, borderColor: '#f472b6'}} 
          onClick={() => window.open('LINK_GOOGLE_FORM_CUA_BAN', '_blank')}
        >
          <span style={{fontSize: '32px', marginBottom: '6px', display: 'block'}}>❤️</span>
          <h3 style={{margin: '0', color: '#f472b6', fontSize: '14px'}}>ĐÓNG GÓP</h3>
          <p style={{margin: '5px 0 0', fontSize: '11px', color: '#94a3b8'}}>Ý kiến cộng đồng</p>
        </div>

        {/* Tab mới - CHƯA CÓ VAI TRÒ? (cùng style ĐÓNG GÓP) */}
        <div 
          style={{...cardStyle, borderColor: '#f472b6'}} 
          onClick={() => navigate('/dang-ky')}
        >
          <span style={{fontSize: '32px', marginBottom: '6px', display: 'block'}}>👋</span>
          <h3 style={{margin: '0', color: '#7c3aed', fontSize: '14px'}}>CHƯA CÓ VAI TRÒ?</h3>
          <p style={{margin: '5px 0 0', fontSize: '11px', color: '#64748b'}}>Đăng ký ngay để bắt đầu</p>
        </div>
      </div>

      {/* Cảnh báo */}
      <div style={warningStyle}>
        ⚠️ <b>CẢNH BÁO:</b> Admin GHN.PI <b>KHÔNG BAO GIỜ</b> yêu cầu Passphrase/Mật khẩu ví Pi. Hãy cảnh giác!
      </div>
    </div>
  );
};

const Card = ({ title, icon, desc, onClick }: any) => (
  <div style={cardStyle} onClick={onClick}>
    <div style={iconStyle}>{icon}</div>
    <h3 style={cardTitle}>{title}</h3>
    <p style={cardDesc}>{desc}</p>
  </div>
);

// ==================== STYLES ====================
const pageContainer: React.CSSProperties = { padding: '20px', minHeight: '100vh', background: '#fcfcfc' };
const logoContainer: React.CSSProperties = { textAlign: 'center', marginBottom: '30px' };
const logoStyle: React.CSSProperties = { fontSize: '32px', fontWeight: '700', color: '#4c1d95' };
const subtitleStyle: React.CSSProperties = { color: '#6b21a8', marginTop: '4px' };
const piButtonContainer: React.CSSProperties = { display: 'flex', justifyContent: 'center', marginBottom: '40px' };
const piButton: React.CSSProperties = { 
  padding: '18px 40px', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', color: 'white', 
  border: 'none', borderRadius: '9999px', fontWeight: '700', fontSize: '17px', cursor: 'pointer', maxWidth: '340px', width: '100%' 
};
const cardsGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' };
const cardStyle: React.CSSProperties = { 
  background: 'white', padding: '20px 10px', borderRadius: '20px', textAlign: 'center', 
  border: '1px solid #f472b6', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', cursor: 'pointer' 
};
const iconStyle: React.CSSProperties = { fontSize: '32px', marginBottom: '8px' };
const cardTitle: React.CSSProperties = { fontSize: '14px', fontWeight: '700', color: '#4c1d95', margin: '0 0 4px 0' };
const cardDesc: React.CSSProperties = { fontSize: '11px', color: '#6b7280', margin: 0 };
const warningStyle: React.CSSProperties = { 
  marginTop: '25px', padding: '15px', background: '#fef2f2', color: '#991b1b', 
  borderRadius: '16px', fontSize: '12px', textAlign: 'center', border: '1px solid #4c1d95' 
};
const headerContainer: React.CSSProperties = { 
  border: '2px solid #4c1d95', borderRadius: '16px', padding: '8px', margin: '8px 0', 
  background: '#fcfcfc', boxShadow: '0 4px 6px rgba(0,0,0,0.9)' 
};

export default HomePage;