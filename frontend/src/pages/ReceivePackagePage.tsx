import React from 'react';

export default function ReceivePackagePage() {
  const orders = [
    { id: 'GHN784521', from: 'Hà Nội', status: 'Đang giao', time: '14:30' },
    { id: 'GHN965874', from: 'TP.HCM', status: 'Chờ nhận', time: '09:15' },
    { id: 'GHN312456', from: 'Đà Nẵng', status: 'Đang giao', time: '16:45' },
    { id: 'GHN147852', from: 'Cần Thơ', status: 'Chờ nhận', time: '11:20' },
  ];

  return (
    <div style={{ padding: 40 }}>
      <div style={{ textAlign: 'center', marginBottom: 30 }}>
        <div style={{ fontSize: 48, marginBottom: 10 }}>📥</div>
        <h1 style={{ color: '#4c1d95', fontSize: 30, margin: 0 }}>ĐƠN CHỜ NHẬN</h1>
        <p style={{ color: '#6b7280', marginTop: 6 }}>Danh sách đơn hàng đang chờ bạn nhận</p>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', display: 'grid', gap: 14 }}>
        {orders.map((order, i) => (
          <div key={i} style={{ background: 'white', padding: '20px 24px', borderRadius: 16, boxShadow: '0 4px 15px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#1f2937' }}>{order.id}</div>
              <div style={{ color: '#6b7280', fontSize: 14 }}>Từ: {order.from}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#22c55e', fontWeight: 600, fontSize: 15 }}>{order.status}</div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>{order.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}