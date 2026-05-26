import React from 'react';
import BottomNav from '../components/BottomNav';

interface ShopLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
  // Truyền dữ liệu từ ngoài vào (đã tách logic SDK ra khỏi file này)
  isPiConnected: boolean;
  piUsername: string;
  role: string;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ 
  children, 
  onNavigate, 
  currentPage,
  isPiConnected,
  piUsername,
  role
}) => {
  return (
    <div style={container}>
      <div style={header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🛒</span>
          <h2 style={title}>GHN.PI</h2>
        </div>

        <div style={rightSection}>
          {isPiConnected ? (
            <div style={piBadge}>✅ @{piUsername}</div>
          ) : (
            <div style={piBadge}>🔗 Pi Network</div>
          )}
          <div style={roleBadge}>
            {role === 'shop' && '🛒 Shop'}
            {role === 'driver' && '🏍️ Tài Xế'}
            {role === 'warehouse' && '🏬 Kho Hub'}
            {role === 'admin' && '👑 Admin'}
            {role === 'seller' && '📦 Seller'}
            {role === 'buyer' && '🚚 Buyer'}          
          </div>
        </div>
      </div>

      <main style={mainContent}>
        {children}
      </main>

      <BottomNav onNavigate={onNavigate} currentPage={currentPage} />
    </div>
  );
};

/* STYLES GIỮ NGUYÊN */
const container = { minHeight: '100vh', background: '#f3e8ff', paddingBottom: '90px', boxSizing: 'border-box' as const };
const header = { background: '#4c1d95', color: '#fff', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' };
const title = { margin: 0, fontSize: '22px', fontWeight: '700' };
const rightSection = { display: 'flex', alignItems: 'center', gap: '8px' };
const roleBadge = { background: '#22d3ee', color: '#0f172a', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '700' };
const piBadge = { background: '#67e8f9', color: '#0f172a', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600' };
const mainContent = { padding: '20px 16px' };

export default ShopLayout;