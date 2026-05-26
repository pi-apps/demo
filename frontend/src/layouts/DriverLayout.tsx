import React from 'react';

// Định nghĩa dữ liệu truyền vào qua props thay vì tự gọi SDK
interface ShipLayoutProps {
  children: React.ReactNode;
  isPiConnected: boolean;
  piUsername: string;
}

const ShipLayout: React.FC<ShipLayoutProps> = ({ 
  children, 
  isPiConnected,
  piUsername 
}) => {
  return (
    <div style={container}>
      {/* HEADER - TÀI XẾ (UI Thuần túy) */}
      <div style={shipHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🏍️</span>
          <h2 style={title}>GHN.PI - TÀI XẾ</h2>
        </div>
        
        <div style={rightSection}>
          {isPiConnected ? (
            <div style={piBadge}>✅ @{piUsername}</div>
          ) : (
            <div style={piBadge}>🔗 Pi Network</div>
          )}
          <div style={roleBadge}>🏍️ Tài Xế</div>
        </div>
      </div>

      {/* Nội dung chính */}
      <main style={mainContent}>
        {children}
      </main>
    </div>
  );
};

/* STYLES (Giữ nguyên giao diện của bạn) */
const container = { minHeight: '100vh', background: '#f3e8ff', boxSizing: 'border-box' as const };
const shipHeader = { background: '#1e3a8a', color: '#fff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' };
const title = { margin: 0, fontSize: '22px', fontWeight: '800' };
const rightSection = { display: 'flex', alignItems: 'center', gap: '12px' };
const roleBadge = { background: '#22d3ee', color: '#0f172a', padding: '6px 16px', borderRadius: '9999px', fontWeight: '700', fontSize: '14px' };
const piBadge = { background: '#67e8f9', color: '#0f172a', padding: '6px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600' };
const mainContent = { padding: '20px 16px' };

export default ShipLayout;