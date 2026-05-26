import { useState } from 'react';

interface Order {
  maDon: string;
  nguoiGui: string;
  nguoiNhan: string;
  diaChiNhan: string;
  trangThai: string;
  paymentMethod?: 'prepaid' | 'cod';
  totalAmount?: number;
}

export const useReceivePackage = () => {
  const [activeTab, setActiveTab] = useState<'danhSach' | 'lichSu' | 'doiTra'>('danhSach');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Có thể load từ localStorage sau
  return {
    activeTab,
    setActiveTab,
    orders,
    selectedOrder,
    setSelectedOrder,
  };
};