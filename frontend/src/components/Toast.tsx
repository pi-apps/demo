import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2800);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: '#10b981', icon: '✅' },
    error: { bg: '#ef4444', icon: '❌' },
    info: { bg: '#3b82f6', icon: 'ℹ️' },
  };

  const { bg, icon } = colors[type];

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: bg,
      color: 'white',
      padding: '14px 24px',
      borderRadius: '9999px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: 2000,
      fontWeight: '600',
      minWidth: '280px',
      justifyContent: 'center',
    }}>
      <span>{icon}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;