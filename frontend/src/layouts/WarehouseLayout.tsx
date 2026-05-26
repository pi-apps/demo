import React from 'react';

// 1. Định nghĩa Props nhận từ ngoài (thay vì tự gọi SDK)
interface KhoHubLayoutProps {
  children: React.ReactNode;
  isPiConnected: boolean;
  piUsername: string;
}

const KhoHubLayout: React.FC<KhoHubLayoutProps> = ({ 
  children, 
  isPiConnected,
  piUsername 
}) => {
  return (
    <div style={container}>
      {/* HEADER - KHO TRUNG CHUYỂN */}
      <div style={khoHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>🏬</span>
          <h2 style={title}>GHN.PI - KHO TRUNG CHUYỂN</h2>
        </div>
        
        <div style={rightSection}>
          {isPiConnected ? (
            <div style={piBadge}>✅ @{piUsername}</div>
          ) : (
            <div style={piBadge}>🔗 Pi Network</div>
          )}
          <div style={roleBadge}>📦 Kho Hub Partner</div>
        </div>
      </div>

      {/* Nội dung chính */}
      <main style={mainContent}>
        {children}
      </main>
      
      {/* BottomNav đã bị xóa bỏ khỏi file này vì nó sẽ nằm ở MainLayout */}
    </div>
  );
};

/* STYLES (Giữ nguyên giao diện gốc) */
const container = { minHeight: '100vh', background: '#f3e8ff', boxSizing: 'border-box' as const };
const khoHeader = { background: '#1e3a8a', color: '#fff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' };
const title = { margin: 0, fontSize: '22px', fontWeight: '800' };
const rightSection = { display: 'flex', alignItems: 'center', gap: '12px' };
const roleBadge = { background: '#22d3ee', color: '#0f172a', padding: '6px 16px', borderRadius: '9999px', fontSize: '14px', fontWeight: '700' };
const piBadge = { background: '#67e8f9', color: '#0f172a', padding: '6px 12px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600' };
const mainContent = { padding: '20px 16px' };

export default KhoHubLayout;