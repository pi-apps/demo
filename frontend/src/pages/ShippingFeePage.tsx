import React, { useState } from 'react';

export default function ShippingFeePage() {
  const [result, setResult] = useState<any>(null);

  const calculateFee = () => {
    const fee = Math.floor(Math.random() * 50000) + 15000;
    setResult({
      fee: fee.toLocaleString('vi-VN'),
      time: '2-4 ngày',
      service: 'Tiết kiệm'
    });
  };

  return (
    <div style={{ padding: 40, maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#4c1d95' }}>📊 TRA CỨU CƯỚC PHÍ</h1>
      <p style={{ color: '#666', marginBottom: 30 }}>Nhập thông tin đơn hàng để ước tính chi phí</p>
      
      <button onClick={calculateFee} style={{ padding: '16px 50px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: 12, fontSize: 18, fontWeight: 700, cursor: 'pointer' }}>
        📈 TÍNH CƯỚC PHÍ
      </button>

      {result && (
        <div style={{ marginTop: 40, background: 'white', padding: 30, borderRadius: 20, boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#22c55e' }}>KẾT QUẢ ƯỚC TÍNH</h3>
          <div style={{ fontSize: 32, fontWeight: 700, color: '#4c1d95', margin: '20px 0' }}>{result.fee}đ</div>
          <div>Thời gian: <strong>{result.time}</strong></div>
          <div>Dịch vụ: <strong>{result.service}</strong></div>
        </div>
      )}
    </div>
  );
}