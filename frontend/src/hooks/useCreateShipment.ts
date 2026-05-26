import { useState } from 'react';

export const useCreateShipment = () => {
  const [form, setForm] = useState({
    loaiDon: 'hoatoc' as 'hoatoc' | 'duongdai',
    nguoiGui: 'Thanh Pi User',
    sdtGui: '0912345678',
    diaChiGui: '',
    nguoiNhan: '',
    sdtNhan: '',
    diaChiNhan: '',
    trongLuong: 1,
    dai: 30,
    rong: 20,
    cao: 10,
    ghiChu: '',    
  });
  
  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>('prepaid');
  const [isProcessing, setIsProcessing] = useState(false);
  const [codAmount, setCodAmount] = useState<string>('0');

  const handleQuickFillSeller = () => {
    setForm(prev => ({
      ...prev,
      diaChiGui: '123 Đường XYZ, Quận 1, TP.HCM',
    }));
  };

  const handleQuickFillBuyer = () => {
    setForm(prev => ({
      ...prev,
      nguoiNhan: 'Người nhận mẫu',
      sdtNhan: '0900000000',
      diaChiNhan: '123 Đường ABC, Quận XYZ, TP.HCM',
    }));
  };

  // === MỚI: Lấy nhanh từ tài khoản Pi ===
  const handleQuickFillPi = () => {
    setForm(prev => ({
      ...prev,
      nguoiNhan: 'Thanh Pi User',           // Có thể lấy từ piUsername sau
      sdtNhan: '0987654321',
      diaChiNhan: 'Địa chỉ ví Pi - Quận 7, TP.HCM',
    }));
  };

  // Logic tính toán phí
  const shippingFee = Math.round((form.loaiDon === 'hoatoc' ? form.trongLuong * 35000 : form.trongLuong * 22000) + 8000);
  const totalAmount = shippingFee;

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const orderData = { 
        ...form, 
        paymentMethod, 
        codAmount: paymentMethod === 'cod' ? codAmount : '0', 
        totalAmount 
      };
      console.log("Đang gửi đơn:", orderData);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Đơn hàng đã được tạo thành công! 🚀");
    } catch (err) {
      alert("Lỗi khi tạo đơn.");
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    form, 
    setForm, 
    paymentMethod, 
    setPaymentMethod, 
    codAmount, 
    setCodAmount, 
    handleSubmit, 
    shippingFee, 
    isProcessing, 
    totalAmount, 
    handleQuickFillSeller,
    handleQuickFillBuyer,
    handleQuickFillPi   // ← mới thêm
  };
};