import React from 'react';
import { navigate } from '@/core/router/navigationService';

// Định nghĩa dữ liệu cần thiết cho giao diện Admin
interface AdminLayoutProps {
  children: React.ReactNode;
  isPiConnected: boolean;
  piUsername: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  isPiConnected,
  piUsername 
}) => {

  return (
    <div style={container}>
      {/* HEADER - ADMIN (UI Thuần túy) */}
      <div style={adminHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '32px' }}>👑</div>
          <h2 style={adminTitle}>GHN.PI - ADMIN</h2>
        </div>
        
        <div style={rightHeader}>
          {isPiConnected ? (
            <div style={piBadge}>✅ @{piUsername}</div>
          ) : (
            <div style={piBadge}>🔗 Pi Network</div>
          )}
          
          <div style={roleBadge}>Quản trị viên</div>

          {/* ================= SYSTEM DASHBOARD BUTTON (STEP 12) ================= */}
          <button
            onClick={() => navigate("/system")}
            style={dashboardBtn}
          >
            🔥 System
          </button>
        </div>
      </div>

      {/* Nội dung trang */}
      <main style={mainContent}>
        {children}
      </main>
    </div>
  );
};

/* STYLES (Giữ nguyên giao diện gốc của bạn) */
const container = {
  minHeight: '100vh',
  background: '#f3e8ff',
  boxSizing: 'border-box' as const
};

const adminHeader = {
  background: '#1e2937',
  color: '#fff',
  padding: '16px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
};

const adminTitle = { margin: 0, fontSize: '22px', fontWeight: '800' };
const rightHeader = { display: 'flex', alignItems: 'center', gap: '10px' };

const roleBadge = { 
  background: '#f59e0b', 
  color: '#0f172a', 
  padding: '6px 16px', 
  borderRadius: '9999px', 
  fontSize: '14px', 
  fontWeight: '700' 
};

const piBadge = { 
  background: '#67e8f9', 
  color: '#0f172a', 
  padding: '6px 12px', 
  borderRadius: '9999px', 
  fontSize: '13px', 
  fontWeight: '600' 
};

const dashboardBtn = {
  background: '#10b981',
  color: '#fff',
  padding: '6px 12px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '13px',
  fontWeight: '700',
  cursor: 'pointer'
};

const mainContent = { padding: '20px 16px' };

export default AdminLayout;