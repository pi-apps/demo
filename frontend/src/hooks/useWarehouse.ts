import { useState, useEffect } from 'react';

interface Order {
  maDon: string;
  nguoiNhan: string;
  status: string;
  [key: string]: any;
}

export const useWarehouse = () => {
  const [activeTab, setActiveTab] = useState<'nhap' | 'xuat' | 'ton'>('nhap');
  const [orders, setOrders] = useState<Order[]>([]);
  const [scanCode, setScanCode] = useState<string>('');

  // Load orders từ localStorage
  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error("Lỗi đọc dữ liệu:", e);
      }
    }
  }, []);

  // Auto save orders
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const handleScan = (code: string) => {
    setScanCode(code);
    console.log("✅ Quét mã thành công:", code);
    
    // Ví dụ tự động thêm đơn khi quét (có thể chỉnh theo nhu cầu)
    const newOrder: Order = {
      maDon: code,
      nguoiNhan: "Người nhận mẫu",
      status: activeTab === 'nhap' ? 'Đã nhập kho' : 'Đang xuất kho',
      timestamp: new Date().toISOString(),
    };
    setOrders(prev => [...prev, newOrder]);
  };

  const addMockOrder = () => {
    const mock: Order = {
      maDon: `DH${Date.now().toString().slice(-6)}`,
      nguoiNhan: "Thanh Pi User",
      status: "Hoàn thành",
      timestamp: new Date().toISOString(),
    };
    setOrders(prev => [...prev, mock]);
  };

  return {
    activeTab,
    setActiveTab,
    orders,
    scanCode,
    setScanCode,
    handleScan,
    addMockOrder,
  };
};