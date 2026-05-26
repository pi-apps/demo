import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  status: 'pending' | 'shipping' | 'completed' | 'cancelled' | 'complaint';
  customer: string;
  address: string;
  fee: string;
  time: string;
}

const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  return (
    <div style={pageContainer}>
      <div style={header}>
        <h2 style={title}>Quản lý đơn hàng</h2>
        <button onClick={() => navigate('/')} style={backBtn}>Trang chủ</button>
      </div>

      <div style={listContainer}>
        {orders.map(order => (
          <div key={order.id} style={card}>
            <p><strong>Mã:</strong> {order.id}</p>
            <p>Trạng thái: {order.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const pageContainer = { minHeight: '100vh', background: '#f8fafc', padding: '20px' };
const header = { display: 'flex', justifyContent: 'space-between', marginBottom: '20px' };
const title = { color: '#4c1d95', margin: 0 };
const backBtn = { background: '#4c1d95', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px' };
const listContainer = { display: 'flex', flexDirection: 'column' as const, gap: '10px' };
const card = { background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' };

export default OrdersPage;