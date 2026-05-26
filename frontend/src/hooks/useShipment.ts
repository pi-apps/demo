import { useState } from 'react';

export const useShipment = () => {
  const [form, setForm] = useState({
    nguoiNhan: '',
    sdtNhan: '',
    diaChiNhan: '',
    trongLuong: 1
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm tính phí
  const calculateFee = () => {
    return form.trongLuong * 10; // Ví dụ công thức phí
  };

  // Hàm xử lý khi nhấn nút Gửi
  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Dữ liệu gửi đi:", form);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert("Tạo đơn thành công!");
  };

  // Hàm hỗ trợ
  const handleGetLocation = () => alert("Đang lấy vị trí...");
  const handleQuickFill = () => {
    setForm({ nguoiNhan: "Người nhận mẫu", sdtNhan: "0900000000", diaChiNhan: "Địa chỉ mẫu", trongLuong: 1 });
  };

  return { 
    form, 
    setForm, 
    isSubmitting, 
    calculateFee, 
    handleSubmit, 
    handleGetLocation, 
    handleQuickFill 
  };
};