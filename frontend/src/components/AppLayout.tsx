import React from 'react';
import BottomNav from '../components/BottomNav';

interface AdminLayoutProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;   // Thêm ? để optional
  currentPage?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  onNavigate, 
  currentPage = 'admin' 
}) => {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Admin */}
      <div className="bg-purple-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">🛠️ Quản Trị Viên GHN.PI</h1>
          <div className="text-sm opacity-90">Admin Dashboard</div>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="max-w-6xl mx-auto p-4">
        {children}
      </div>

      {/* BottomNav */}
      {onNavigate && (
        <BottomNav 
          onNavigate={onNavigate} 
          currentPage={currentPage} 
        />
      )}
    </div>
  );
};

export default AdminLayout;