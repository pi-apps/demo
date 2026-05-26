import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DonHangForm {
  loaiDon: 'hoatoc' | 'duongdai';
  nguoiGui: string;
  sdtGui: string;
  diaChiGui: string;
  nguoiNhan: string;
  sdtNhan: string;
  diaChiNhan: string;
  trongLuong: number;
  dai: number;
  rong: number;
  cao: number;
  ghiChu: string;
}

export default function CreateShipmentPage() {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [maDon, setMaDon] = useState('');

  const [form, setForm] = useState<DonHangForm>({
    loaiDon: 'hoatoc',
    nguoiGui: '',
    sdtGui: '',
    diaChiGui: '',
    nguoiNhan: '',
    sdtNhan: '',
    diaChiNhan: '',
    trongLuong: 1,
    dai: 20,
    rong: 15,
    cao: 10,
    ghiChu: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'prepaid' | 'cod'>('prepaid');

  const calculateFee = (): number => {
    const weight = form.trongLuong;
    const volWeight = (form.dai * form.rong * form.cao) / 5000;
    const chargeWeight = Math.max(weight, volWeight);
    const baseFee = form.loaiDon === 'hoatoc' ? chargeWeight * 35000 : chargeWeight * 22000;
    return Math.round(baseFee + 8000);
  };

  const piAmount = calculateFee();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.nguoiGui || !form.sdtGui || !form.diaChiGui ||
        !form.nguoiNhan || !form.sdtNhan || !form.diaChiNhan) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newMaDon = `GHN${Date.now().toString().slice(-8)}`;
      setMaDon(newMaDon);
      setIsProcessing(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>GỬI HÀNG</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* Loại đơn */}
        <div>
          <label style={labelStyle}>Loại đơn hàng</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'hoatoc' })}
              style={form.loaiDon === 'hoatoc' ? activeToggle : inactiveToggle}>
              ⚡ Hỏa Tốc
            </button>
            <button type="button" onClick={() => setForm({ ...form, loaiDon: 'duongdai' })}
              style={form.loaiDon === 'duongdai' ? activeToggle : inactiveToggle}>
              🛣️ Đường Dài
            </button>
          </div>
        </div>

        {/* Phương thức thanh toán */}
        <div>
          <label style={labelStyle}>Phương thức thanh toán</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={() => setPaymentMethod('prepaid')}
              style={paymentMethod === 'prepaid' ? activeToggle : inactiveToggle}>
              💰 Thanh toán trước
            </button>
            <button type="button" onClick={() => setPaymentMethod('cod')}
              style={paymentMethod === 'cod' ? activeToggle : inactiveToggle}>
              📦 Thu hộ (COD Pi)
            </button>
          </div>
        </div>

        {/* Người gửi */}
        <div>
          <label style={labelStyle}>Người gửi</label>
          <input type="text" placeholder="Họ tên người gửi" value={form.nguoiGui} onChange={(e) => setForm({ ...form, nguoiGui: e.target.value })} style={inputStyle} />
          <input type="tel" placeholder="Số điện thoại" value={form.sdtGui} onChange={(e) => setForm({ ...form, sdtGui: e.target.value })} style={{ ...inputStyle, marginTop: '8px' }} />
          <input type="text" placeholder="Địa chỉ người gửi" value={form.diaChiGui} onChange={(e) => setForm({ ...form, diaChiGui: e.target.value })} style={{ ...inputStyle, marginTop: '8px' }} />
        </div>

        {/* Người nhận */}
        <div>
          <label style={labelStyle}>Người nhận</label>
          <input type="text" placeholder="Họ tên người nhận" value={form.nguoiNhan} onChange={(e) => setForm({ ...form, nguoiNhan: e.target.value })} style={inputStyle} />
          <input type="tel" placeholder="Số điện thoại" value={form.sdtNhan} onChange={(e) => setForm({ ...form, sdtNhan: e.target.value })} style={{ ...inputStyle, marginTop: '8px' }} />
          <input type="text" placeholder="Địa chỉ nhận hàng" value={form.diaChiNhan} onChange={(e) => setForm({ ...form, diaChiNhan: e.target.value })} style={{ ...inputStyle, marginTop: '8px' }} />
        </div>

        {/* Thông tin kiện hàng */}
        <div>
          <label style={labelStyle}>Thông tin kiện hàng</label>
          <div style={{ marginBottom: '12px' }}>
            <label style={smallLabel}>Trọng lượng (kg)</label>
            <input type="number" value={form.trongLuong} onChange={(e) => setForm({ ...form, trongLuong: parseFloat(e.target.value) || 1 })} style={inputStyle} />
          </div>
          <div>
            <label style={smallLabel}>Kích thước (cm)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <input type="number" placeholder="Dài" value={form.dai} onChange={(e) => setForm({ ...form, dai: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              <input type="number" placeholder="Rộng" value={form.rong} onChange={(e) => setForm({ ...form, rong: parseFloat(e.target.value) || 0 })} style={inputStyle} />
              <input type="number" placeholder="Cao" value={form.cao} onChange={(e) => setForm({ ...form, cao: parseFloat(e.target.value) || 0 })} style={inputStyle} />
            </div>
          </div>
        </div>

        <div>
          <label style={labelStyle}>Ghi chú</label>
          <input type="text" placeholder="Ghi chú cho tài xế..." value={form.ghiChu} onChange={(e) => setForm({ ...form, ghiChu: e.target.value })} style={inputStyle} />
        </div>

        {/* Ước tính cước */}
        <div style={feeBoxStyle}>
          <p style={{ color: '#6b21a8', marginBottom: '6px' }}>Ước tính cước vận chuyển</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#22d3ee' }}>
            {piAmount.toLocaleString()} <span style={{ fontSize: '18px' }}>Pi</span>
          </p>
          {paymentMethod === 'cod' && (
            <p style={{ color: '#10b981', fontSize: '15px', marginTop: '8px' }}>
              💰 Người nhận sẽ thanh toán khi nhận hàng
            </p>
          )}
        </div>

        <button type="submit" disabled={isProcessing} style={submitButton}>
          {isProcessing
            ? 'Đang xử lý...'
            : paymentMethod === 'prepaid'
              ? `TẠO ĐƠN & THANH TOÁN ${piAmount.toLocaleString()} Pi`
              : `TẠO ĐƠN THU HỘ ${piAmount.toLocaleString()} Pi`}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccess && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <h2 style={{ color: '#22d3ee', marginBottom: '16px' }}>✅ Tạo đơn thành công!</h2>
            <p><strong>Mã đơn hàng:</strong> <span style={{ color: '#22d3ee', fontSize: '18px' }}>{maDon}</span></p>
            <p style={{ marginTop: '8px' }}>
              {paymentMethod === 'prepaid'
                ? 'Đã thanh toán trước bằng Pi.'
                : 'Thu hộ (COD Pi) - Người nhận thanh toán khi nhận hàng.'}
            </p>
            <p style={{ marginTop: '12px', color: '#94a3b8' }}>Đơn hàng đã được ghi nhận và chờ tài xế nhận.</p>

            <button onClick={() => { setShowSuccess(false); navigate('/don-hang'); }} style={modalButton}>
              Xem danh sách đơn hàng
            </button>

            <button onClick={() => { setShowSuccess(false); navigate('/tracking'); }} style={{ ...modalButton, background: '#64748b', marginTop: '10px' }}>
              Theo dõi đơn hàng ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES (GIỮ NGUYÊN) ===================== */
const pageContainer = { minHeight: '100vh', background: '#f3e8ff', padding: '16px 14px 100px', boxSizing: 'border-box' as const };
const headerStyle = { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' };
const titleStyle = { fontSize: '26px', fontWeight: '700', color: '#4c1d95', margin: 0 };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: '600', color: '#4c1d95' };
const smallLabel = { display: 'block', marginBottom: '5px', color: '#6b21a8', fontSize: '13.5px' };
const inputStyle = {
  width: '100%', padding: '14px 16px', backgroundColor: '#ede9fe',
  border: '1px solid #c4b5fd', borderRadius: '12px', color: '#4c1d95', fontSize: '15.5px'
};
const activeToggle = { flex: 1, padding: '13px', borderRadius: '9999px', background: '#22d3ee', color: '#0f172a', fontWeight: '700' };
const inactiveToggle = { flex: 1, padding: '13px', borderRadius: '9999px', background: '#e0e7ff', color: '#4c1d95', border: '1px solid #c4b5fd', fontWeight: '600' };
const feeBoxStyle = { backgroundColor: '#ede9fe', padding: '20px', borderRadius: '16px', border: '1px solid #c4b5fd', textAlign: 'center' as const };
const submitButton = {
  width: '100%', padding: '18px', fontSize: '17px', fontWeight: '700',
  background: 'linear-gradient(90deg, #22d3ee, #67e8f9)', color: '#0f172a',
  border: 'none', borderRadius: '9999px', boxShadow: '0 8px 25px rgba(34,211,238,0.5)'
};
const modalOverlay = { position: 'fixed' as const, top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.95)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 };
const modalContent = { background:'#1e2937', padding:'40px', borderRadius:'24px', textAlign:'center' as const, maxWidth:'380px', border:'1px solid #22d3ee' };
const modalButton = { padding:'16px', background:'#22d3ee', color:'#0f172a', border:'none', borderRadius:'9999px', fontWeight:'700', width:'100%', marginTop:'20px' };