// src/pages/ReconciliationPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook điều hướng mới

// Đã xóa ReconciliationPageProps vì không còn cần truyền props từ App.tsx

interface Order {
  maDon: string;
  nguoiGui: string;
  nguoiNhan: string;
  totalAmount?: number;
  paymentMethod?: 'prepaid' | 'cod';
  piPaymentId?: string;
  piTx?: string;
  status?: string;
  createdAt?: string;
}

const ReconciliationPage: React.FC = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hook
  const [maDonHang, setMaDonHang] = useState('');
  const [ketQua, setKetQua] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mapped = parsed.map((o: any) => ({
          maDon: o.maDon || o.id,
          nguoiGui: o.nguoiGui,
          nguoiNhan: o.nguoiNhan,
          totalAmount: o.totalAmount,
          paymentMethod: o.paymentMethod,
          piPaymentId: o.piPaymentId,
          piTx: o.piTx,
          status: o.status,
          createdAt: o.createdAt
        }));
        setOrders(mapped);
      } catch (e) {
        console.error("Lỗi đọc đơn hàng:", e);
      }
    }
  }, []);

  return (
    <div style={pageContainer}>
      {/* HEADER GIỮ NGUYÊN UI */}
      <div style={header}>
        <div style={iconTitle}>📊</div>
        <h2 style={title}>Đối soát đơn hàng</h2>
      </div>
      
      <p style={subtitle}>Kiểm tra trạng thái thanh toán Pi Network</p>

      {/* FORM GIỮ NGUYÊN UI */}
      <div style={card}>
        <label style={label}>Nhập mã đơn hàng:</label>
        <input 
          style={input} 
          value={maDonHang} 
          onChange={(e) => setMaDonHang(e.target.value)}
          placeholder="Ví dụ: GHN-12345"
        />
        {/* Nút hành động dùng navigate thay onNavigate */}
        <button style={actionButton} onClick={() => navigate('/admin')}>
          Quay về Trang quản trị
        </button>
      </div>
      
      {/* ĐÃ XÓA BOTTOMNAV Ở ĐÂY - ĐÃ CÓ TRONG MAINLAYOUT */}
    </div>
  );
};

/* STYLES GIỮ NGUYÊN 100% */
const pageContainer: React.CSSProperties = {
  minHeight: '100vh',
  background: '#f3e8ff',
  padding: '16px 14px 90px',
  boxSizing: 'border-box'
};

const header: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center' as const,
  gap: '12px',
  marginBottom: '30px'
};

const iconTitle: React.CSSProperties = { fontSize: '42px' };
const title: React.CSSProperties = { fontSize: '26px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const subtitle: React.CSSProperties = { color: '#6b21a8', fontSize: '14px', textAlign: 'center' as const };
const card: React.CSSProperties = { background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px', border: '1px solid #e0d4ff' };
const label: React.CSSProperties = { fontSize: '15px', color: '#4c1d95', marginBottom: '8px', fontWeight: '600' };
const input: React.CSSProperties = { width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '16px', boxSizing: 'border-box' };
const actionButton: React.CSSProperties = { width: '100%', padding: '12px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600' };

export default ReconciliationPage;