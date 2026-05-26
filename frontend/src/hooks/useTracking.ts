import { useState, useEffect } from 'react';

interface TrackingOrder {
  maDon: string;
  loaiDon: string;
  nguoiNhan: string;
  diaChiNhan: string;
  trangThai: string;
  totalAmount?: number;
  createdAt?: string;
}

export const useTracking = () => {
  const [orders, setOrders] = useState<TrackingOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = () => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mapped = parsed.map((o: any) => ({
          maDon: o.maDon || `DH${Date.now()}`,
          loaiDon: o.loaiDon || 'hoatoc',
          nguoiNhan: o.nguoiNhan || 'Người nhận',
          diaChiNhan: o.diaChiNhan || '',
          trangThai: o.status || 'Đang giao',
          totalAmount: o.totalAmount,
          createdAt: o.createdAt || new Date().toISOString(),
        }));
        setOrders(mapped);
      } catch (e) {
        console.error("Lỗi load tracking:", e);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return { orders, loading, loadOrders };
};