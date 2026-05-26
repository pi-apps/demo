import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTracking } from '../hooks/useTracking';

export default function TrackingPage() {
  const navigate = useNavigate();
  const { orders, loading } = useTracking();

  return (
    <div style={pageContainer}>
      <div style={roleBar}>
        <span>🔎 Tracking</span>
        <button onClick={() => navigate('/ca-nhan')} style={changeRoleBtn}>Đổi vai trò</button>
      </div>

      <h1 style={titleStyle}>🔎 TRA CỨU ĐƠN HÀNG</h1>

      <div style={cardStyle}>
        <h3 style={sectionTitle}>Danh sách đơn hàng ({orders.length})</h3>

        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</p>
        ) : orders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '60px 20px' }}>Chưa có đơn hàng nào</p>
        ) : (
          orders.map((order) => (
            <div 
              key={order.maDon} 
              style={orderCardStyle} 
              onClick={() => navigate(`/tracking/${order.maDon}`)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ color: '#4c1d95' }}>{order.maDon}</strong>
                  <p style={{ margin: '4px 0', fontSize: '15px' }}>{order.nguoiNhan}</p>
                  <p style={{ fontSize: '13px', color: '#666' }}>{order.diaChiNhan}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#22d3ee', fontWeight: '700' }}>{order.trangThai}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* Styles thống nhất */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8f7ff', padding: '20px' };
const roleBar: React.CSSProperties = { background: '#4c1d95', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between', borderRadius: '12px' };
const changeRoleBtn: React.CSSProperties = { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '99px', padding: '4px 12px' };
const titleStyle: React.CSSProperties = { fontSize: '22px', color: '#4c1d95', textAlign: 'center', margin: '20px 0' };
const cardStyle: React.CSSProperties = { background: '#ffffff', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const sectionTitle: React.CSSProperties = { color: '#4c1d95', marginBottom: '15px', fontSize: '18px' };
const orderCardStyle: React.CSSProperties = { 
  background: '#f8f7ff', padding: '16px', borderRadius: '12px', marginBottom: '12px', 
  border: '1px solid #e0e7ff', cursor: 'pointer' 
};