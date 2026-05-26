import { useState, useEffect } from 'react';

interface Order {
  maDon: string;
  status: 'pending' | 'shipping' | 'completed' | 'cancelled';
  customer: string;
  address: string;
  fee: string;
  time: string;
  loai: string;
  paymentType?: string;
  ghiChu?: string;
}

export const useDriver = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'shipping' | 'completed'>('pending');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = () => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mapped: Order[] = parsed.map((o: any) => ({
          maDon: o.maDon || `DH${Date.now()}`,
          status: o.status === 'cho-lay-hang' || o.status === 'pending' ? 'pending' :
                  o.status === 'dang-giao' || o.status === 'shipping' ? 'shipping' : 'completed',
          customer: o.nguoiNhan || 'Khách hàng',
          address: o.diaChiNhan || '',
          fee: o.totalAmount ? `${o.totalAmount} Pi` : '0 Pi',
          time: o.createdAt || new Date().toLocaleString('vi-VN'),
          loai: o.loaiDon || 'Thường',
          paymentType: o.paymentMethod,
          ghiChu: o.ghiChu,
        }));
        setOrders(mapped);
      } catch (e) {
        console.error("Lỗi parse orders:", e);
      }
    }
  };

  useEffect(() => {
    loadOrders();
    const handleStorage = () => loadOrders();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const filteredOrders = orders.filter(o => filter === 'all' || o.status === filter);

  return {
    filter,
    setFilter,
    orders: filteredOrders,
    selectedOrder,
    setSelectedOrder,
    loadOrders,
  };
};