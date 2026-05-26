import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DriverPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipping' | 'completed'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Dữ liệu mẫu để hiển thị UI (bạn có thể xóa sau)
  const sampleOrders = [
    { maDon: 'GHN784521', customer: 'Nguyễn Văn A', address: '123 Nguyễn Trãi, Q1', fee: '45.000 Pi', status: 'pending', loai: 'Hỏa Tốc' },
    { maDon: 'GHN965874', customer: 'Trần Thị B', address: '456 Lê Lợi, Q1', fee: '32.000 Pi', status: 'shipping', loai: 'Đường Dài' },
    { maDon: 'GHN312456', customer: 'Lê Văn C', address: '789 Trần Hưng Đạo, Q5', fee: '58.000 Pi', status: 'completed', loai: 'Hỏa Tốc' },
  ];

  const filteredOrders = filter === 'all' 
    ? sampleOrders 
    : sampleOrders.filter(o => o.status === filter);

  return (
    <div style={pageContainer}>
      {/* HEADER */}
      <div style={headerStyle}>
        <button onClick={() => navigate('/')} style={backBtn}>⬅ Về trang chủ</button>
        <h2 style={{ color: '#4c1d95', margin: 0 }}>Đơn hàng Tài Xế</h2>
        <div style={{ width: 80 }}></div>
      </div>

      {/* FILTER TABS */}
      <div style={filterContainer}>
        {(['pending', 'shipping', 'completed', 'all'] as const).map(f => (
          <button 
            key={f} 
            onClick={() => setFilter(f)}
            style={filter === f ? activeFilterBtn : filterBtn}
          >
            {f === 'all' ? 'TẤT CẢ' : f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* DANH SÁCH ĐƠN HÀNG (UI) */}
      <div style={{ padding: '0 16px' }}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={index} style={orderCard} onClick={() => setSelectedOrder(order)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: '#4c1d95', fontSize: 17 }}>{order.maDon}</strong>
                <span style={getStatusStyle(order.status)}>{order.status}</span>
              </div>
              <p style={{ margin: '10px 0 6px', color: '#334155' }}>👤 {order.customer}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>📍 {order.address}</p>
              <p style={{ fontWeight: 700, color: '#7c3aed', marginTop: 6 }}>{order.fee}</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>🚚 {order.loai}</p>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', color: '#64748b', marginTop: 40 }}>Không có đơn hàng</p>
        )}
      </div>

      {/* MODAL CHI TIẾT (CHỈ UI) */}
      {selectedOrder && (
        <div style={modalOverlay} onClick={() => setSelectedOrder(null)}>
          <div style={modalContent} onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#4c1d95', marginBottom: 16 }}>Chi tiết đơn hàng</h3>
            
            <div style={{ textAlign: 'left', marginBottom: 24, lineHeight: 1.8 }}>
              <p><strong>Mã đơn:</strong> {selectedOrder.maDon}</p>
              <p><strong>Khách hàng:</strong> {selectedOrder.customer}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
              <p><strong>Loại:</strong> {selectedOrder.loai}</p>
              <p><strong>Phí:</strong> {selectedOrder.fee}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button style={purpleBtn}>🚀 Nhận đơn (Bắt đầu giao)</button>
              <button style={greenBtn}>✅ Hoàn thành đơn hàng</button>
              <button onClick={() => setSelectedOrder(null)} style={closeBtn}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES (GIỮ NGUYÊN ĐẸP) ===================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8fafc', paddingBottom: 90 };
const headerStyle: React.CSSProperties = { padding: '20px 16px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const backBtn: React.CSSProperties = { padding: '8px 14px', background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: 999, fontWeight: 600 };
const filterContainer: React.CSSProperties = { display: 'flex', gap: 8, padding: '0 16px 16px', overflowX: 'auto' };
const filterBtn: React.CSSProperties = { padding: '8px 16px', borderRadius: 999, background: 'white', color: '#64748b', border: '1px solid #e9d5ff', fontWeight: 600, whiteSpace: 'nowrap' };
const activeFilterBtn: React.CSSProperties = { ...filterBtn, background: '#4c1d95', color: 'white', border: 'none' };
const orderCard: React.CSSProperties = { background: 'white', padding: 18, borderRadius: 20, marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' };

const getStatusStyle = (status: string): React.CSSProperties => ({
  fontSize: 12, padding: '4px 10px', borderRadius: 999, fontWeight: 700,
  background: status === 'pending' ? '#fef3c7' : status === 'shipping' ? '#dcfce7' : '#e0e7ff',
  color: status === 'pending' ? '#d97706' : status === 'shipping' ? '#16a34a' : '#4338ca'
});

const modalOverlay: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent: React.CSSProperties = { background: 'white', padding: 28, borderRadius: 24, width: '90%', maxWidth: 360 };
const purpleBtn: React.CSSProperties = { padding: 14, background: '#4c1d95', color: 'white', border: 'none', borderRadius: 999, fontWeight: 700 };
const greenBtn: React.CSSProperties = { ...purpleBtn, background: '#16a34a' };
const closeBtn: React.CSSProperties = { padding: 14, background: '#f3e8ff', color: '#4c1d95', border: 'none', borderRadius: 999, fontWeight: 700 };
