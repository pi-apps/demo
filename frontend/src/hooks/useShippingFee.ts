import { useState } from 'react';

interface FormData {
  tinhGui: string;
  phuongGui: string;
  tinhNhan: string;
  phuongNhan: string;
  khoiLuong: number;
  dai: number;
  rong: number;
  cao: number;
  loaiHang: string;
}

export const useShippingFee = () => {
  const [activeTab, setActiveTab] = useState<'tim' | 'cuoc'>('cuoc');
  const [ketQua, setKetQua] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);

  const [form, setForm] = useState<FormData>({
    tinhGui: '', 
    phuongGui: '',
    tinhNhan: '', 
    phuongNhan: '',
    khoiLuong: 1,
    dai: 30, 
    rong: 20, 
    cao: 10,
    loaiHang: 'hangthuong',
  });

  const calculateFee = () => {
    setCalculating(true);
    setTimeout(() => {
      const fee = Math.round(form.khoiLuong * 28000 + 12000);
      setKetQua({
        cuocPhi: fee,
        thoiGian: form.loaiHang === 'hangthuong' ? '2-3 ngày' : '1 ngày',
        message: 'Cước phí tạm tính'
      });
      setCalculating(false);
    }, 800);
  };

  return {
    activeTab,
    setActiveTab,
    form,
    setForm,
    ketQua,
    calculating,
    calculateFee,
  };
};