import React from 'react';
import { useNavigate } from 'react-router-dom';

const CongDongGopY: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={pageContainer}>
      <button onClick={() => navigate('/')} style={backButton}>⬅ Quay lại</button>
      
      <div style={contentContainer}>
        <h2 style={titleStyle}>❤️ Đóng góp Cộng đồng</h2>
        <p style={descStyle}>Mọi ý kiến của bạn đều giúp GHN.PI hoàn thiện hơn. Hãy gửi góp ý tại đây!</p>

        {/* Nhúng Google Form vào iframe */}
        <div style={iframeWrapper}>
           <iframe 
             src="LINK_GOOGLE_FORM_CUA_BAN" 
             width="100%" 
             height="600px" 
             frameBorder="0"
           >Đang tải...</iframe>
        </div>

        <div style={warningStyle}>
          ⚠️ <b>Lưu ý:</b> Admin KHÔNG BAO GIỜ yêu cầu Passphrase ví Pi của bạn.
        </div>
      </div>
    </div>
  );
};

/* --- STYLE CỐ ĐỊNH --- */
const pageContainer: React.CSSProperties = { padding: '20px', minHeight: '100vh', background: '#fcfcfc' };
const backButton: React.CSSProperties = { background: 'none', border: 'none', color: '#4c1d95', marginBottom: '20px', cursor: 'pointer', fontWeight: 'bold' };
const contentContainer: React.CSSProperties = { maxWidth: '500px', margin: '0 auto' };
const titleStyle: React.CSSProperties = { color: '#4c1d95', textAlign: 'center' };
const descStyle: React.CSSProperties = { color: '#6b7280', textAlign: 'center', marginBottom: '20px' };
const iframeWrapper: React.CSSProperties = { borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' };
const warningStyle: React.CSSProperties = { marginTop: '20px', padding: '15px', background: '#fef2f2', color: '#991b1b', borderRadius: '12px', fontSize: '12px', textAlign: 'center' };

export default CongDongGopY;