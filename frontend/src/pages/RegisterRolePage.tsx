// src/pages/RegisterRolePage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../core/auth/AuthContext';

const RegisterRolePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth(); // ✅ Đã cập nhật

  const [isPiConnected, setIsPiConnected] = useState(false);
  const [piUsername, setPiUsername] = useState(user?.username || '');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Ưu tiên lấy từ user trong context trước
    const savedPi = user?.username || localStorage.getItem('piUsername');
    if (savedPi) {
      setIsPiConnected(true);
      setPiUsername(savedPi);
    }
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);
  }, [user?.username]);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarUrl(base64String);
        localStorage.setItem('userAvatar', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Ví dụ hàm kết nối Pi (bạn có thể gọi login() từ context)
  const handlePiConnect = async () => {
    try {
      setIsLoading(true);
      await login(); // ✅ Gọi login từ AuthContext
      setIsPiConnected(true);
    } catch (error) {
      alert('Kết nối Pi thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={container}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Quay lại</button>

      <h2 style={title}>Đăng ký vai trò</h2>

      <div style={roleCard}>
        <p>Kết nối Pi Network để xác thực tài khoản...</p>

        <button 
          style={piLoginButton} 
          onClick={handlePiConnect}
          disabled={isLoading}
        >
          {isPiConnected 
            ? `Đã kết nối: ${piUsername}` 
            : isLoading 
              ? "Đang kết nối..." 
              : "Kết nối Pi Network"
          }
        </button>
      </div>
    </div>
  );
};

/* STYLES GIỮ NGUYÊN */
const container: React.CSSProperties = { padding: '20px', background: '#f3e8ff', minHeight: '100vh' };
const backBtn: React.CSSProperties = { background: 'none', border: 'none', color: '#4c1d95', fontSize: '16px', fontWeight: '600', marginBottom: '20px', cursor: 'pointer' };
const title: React.CSSProperties = { color: '#4c1d95', marginBottom: '20px' };
const roleCard: React.CSSProperties = { background: 'white', borderRadius: '20px', padding: '24px 16px', textAlign: 'center' };
const piLoginButton: React.CSSProperties = { 
  backgroundColor: '#4c1d95', color: '#fff', border: 'none', borderRadius: '9999px', 
  padding: '14px 28px', fontSize: '16px', fontWeight: '600', width: '100%', 
  marginTop: '12px', cursor: 'pointer' 
};

export default RegisterRolePage;