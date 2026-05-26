import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DisputePage: React.FC = () => {
  const navigate = useNavigate();
  const [moTa, setMoTa] = useState('');

  return (
    <div style={container}>
      <button style={backButton} onClick={() => navigate(-1)}>← Quay lại</button>
      <h2 style={title}>Gửi khiếu nại</h2>
      
      <div style={formGroup}>
        <label>Nội dung khiếu nại</label>
        <textarea 
          style={textarea} 
          value={moTa}
          onChange={(e) => setMoTa(e.target.value)}
          placeholder="Mô tả vấn đề..."
        />
      </div>

      <button style={submitButton} onClick={() => alert("Đã gửi khiếu nại!")}>
        Gửi yêu cầu
      </button>
    </div>
  );
};

const container = { padding: '20px', background: '#fff', minHeight: '100vh' };
const backButton = { background: 'none', border: 'none', color: '#4c1d95', fontWeight: '600', marginBottom: '20px' };
const title = { color: '#4c1d95' };
const formGroup = { display: 'flex', flexDirection: 'column' as const, gap: '8px', marginBottom: '16px' };
const textarea = { padding: '14px', border: '1px solid #c4b5fd', borderRadius: '12px', minHeight: '100px' };
const submitButton = { width: '100%', padding: '16px', background: '#4c1d95', color: 'white', border: 'none', borderRadius: '99px' };

export default DisputePage;