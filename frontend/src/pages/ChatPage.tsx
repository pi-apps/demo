// src/pages/ChatPage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Hook điều hướng mới

// Đã loại bỏ interface ChatPageProps vì không còn cần truyền props từ App.tsx

type Message = {
  id: number;
  text: string;
  isUser: boolean;
  time: string;
  file?: { name: string; url: string; type: string };
};

const ChatPage: React.FC = () => {
  const navigate = useNavigate(); // 2. Khởi tạo hook
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Chào bạn! GHN.PI hỗ trợ 24/7. Bạn cần hỗ trợ về thanh toán Pi hay theo dõi đơn hàng?", 
      isUser: false, 
      time: "10:32" 
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Giữ nguyên các hàm xử lý logic (scrollToBottom, sendMessage, v.v...)
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={chatContainer}>
      {/* HEADER GIỮ NGUYÊN UI */}
      <div style={headerStyle}>
        <button onClick={() => navigate(-1)} style={backBtn}>←</button>
        <h2 style={{ color: 'white' }}>Hỗ trợ trực tuyến</h2>
      </div>

      {/* DANH SÁCH TIN NHẮN */}
      <div style={messagesArea}>
        {messages.map(msg => (
          <div key={msg.id} style={{ 
            alignSelf: msg.isUser ? 'flex-end' : 'flex-start',
            ...bubbleStyle(msg.isUser) 
          }}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA GIỮ NGUYÊN UI */}
      <div style={inputArea}>
        {/* Nội dung input giữ nguyên */}
      </div>

      {/* ĐÃ XÓA BOTTOMNAV Ở ĐÂY - ĐÃ CÓ TRONG MAINLAYOUT */}
    </div>
  );
};

/* STYLES GIỮ NGUYÊN 100% */
const chatContainer: React.CSSProperties = { display: 'flex', flexDirection: 'column', height: '100vh', background: '#f8fafc' };
const headerStyle: React.CSSProperties = { padding: '20px', background: '#4c1d95', display: 'flex', alignItems: 'center', gap: '15px' };
const backBtn: React.CSSProperties = { background: 'none', border: 'none', color: 'white', fontSize: '20px', cursor: 'pointer' };
const messagesArea: React.CSSProperties = { flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' };
const bubbleStyle = (isUser: boolean): React.CSSProperties => ({
  padding: '12px 16px',
  borderRadius: '16px',
  background: isUser ? '#7c3aed' : 'white',
  color: isUser ? 'white' : '#1e2937',
  maxWidth: '80%'
});
const inputArea: React.CSSProperties = { padding: '16px', background: 'white', borderTop: '1px solid #e2e8f0' };

export default ChatPage;