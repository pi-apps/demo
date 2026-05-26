import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useWarehouse } from '../hooks/useWarehouse';

export default function WarehousePage() {
  const navigate = useNavigate();
  const { 
    activeTab, setActiveTab, 
    orders, scanCode, setScanCode, 
    handleScan, addMockOrder 
  } = useWarehouse();

  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  // Khởi tạo QR Scanner
  useEffect(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scannerRef.current.render(
        (decodedText: string) => handleScan(decodedText),
        (error: any) => console.warn(error)
      );
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    };
  }, [handleScan]);

  return (
    <div style={pageContainer}>
      <div style={roleBar}>
        <span>📦 Kho Hub</span>
        <button onClick={() => navigate('/ca-nhan')} style={changeRoleBtn}>Đổi vai trò</button>
      </div>

      <h1 style={titleStyle}>📦 QUẢN LÝ KHO HUB</h1>

      {/* Tabs */}
      <div style={tabContainer}>
        <button 
          style={activeTab === 'nhap' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('nhap')}
        >Nhập kho</button>
        <button 
          style={activeTab === 'xuat' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('xuat')}
        >Xuất kho</button>
        <button 
          style={activeTab === 'ton' ? activeTabStyle : inactiveTabStyle}
          onClick={() => setActiveTab('ton')}
        >Tồn kho</button>
      </div>

      {/* Card chính */}
      <div style={cardStyle}>
        <h3 style={sectionTitle}>
          {activeTab === 'nhap' && '📥 Nhập kho'}
          {activeTab === 'xuat' && '📤 Xuất kho'}
          {activeTab === 'ton' && '📦 Tồn kho'}
        </h3>

        {/* QR Scanner */}
        <div id="qr-reader" style={{ marginBottom: '20px' }}></div>

        {/* Input manual */}
        <label style={labelStyle}>Mã đơn hàng</label>
        <input 
          style={inputStyle}
          value={scanCode}
          onChange={(e) => setScanCode(e.target.value)}
          placeholder="Nhập hoặc quét mã đơn hàng..."
        />

        <button 
          style={submitButton} 
          onClick={addMockOrder}
        >
          + Thêm đơn mẫu
        </button>

        {/* Danh sách đơn hàng */}
        <h4 style={{ margin: '20px 0 10px', color: '#4c1d95' }}>Danh sách đơn ({orders.length})</h4>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {orders.map((order, index) => (
            <div key={index} style={orderItemStyle}>
              <strong>{order.maDon}</strong> - {order.nguoiNhan}
              <span style={{ color: '#22d3ee', fontSize: '13px' }}> {order.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== STYLES (thống nhất với GuiHangPage) ==================== */
const pageContainer: React.CSSProperties = { minHeight: '100vh', background: '#f8f7ff', padding: '20px' };
const roleBar: React.CSSProperties = { background: '#4c1d95', color: 'white', padding: '12px', display: 'flex', justifyContent: 'space-between', borderRadius: '12px' };
const changeRoleBtn: React.CSSProperties = { background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '99px', padding: '4px 12px' };
const titleStyle: React.CSSProperties = { fontSize: '22px', color: '#4c1d95', textAlign: 'center', margin: '20px 0' };

const tabContainer: React.CSSProperties = { display: 'flex', gap: '8px', marginBottom: '20px' };
const activeTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#22d3ee', color: '#fff', border: 'none', fontWeight: '700' };
const inactiveTabStyle: React.CSSProperties = { flex: 1, padding: '12px', borderRadius: '12px', background: '#f3f4f6', color: '#4c1d95', border: '1px solid #d1d5db', fontWeight: '600' };

const cardStyle: React.CSSProperties = { background: '#ffffff', padding: '20px', borderRadius: '16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const sectionTitle: React.CSSProperties = { color: '#4c1d95', marginBottom: '15px', fontSize: '18px' };
const labelStyle: React.CSSProperties = { fontWeight: '700', color: '#4c1d95', marginBottom: '8px', display: 'block' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #d1d5db', boxSizing: 'border-box', marginBottom: '16px' };

const submitButton: React.CSSProperties = { 
  padding: '14px', background: '#4c1d95', color: 'white', border: 'none', 
  borderRadius: '12px', fontWeight: '700', width: '100%', marginBottom: '20px' 
};

const orderItemStyle: React.CSSProperties = {
  padding: '12px',
  background: '#f8f7ff',
  borderRadius: '12px',
  marginBottom: '8px',
  border: '1px solid #e0e7ff'
};