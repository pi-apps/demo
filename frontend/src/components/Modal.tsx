import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText = "Xác nhận",
  cancelText = "Đóng",
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div style={overlay}>
      <div style={modalContent} className="modal-enter">
        {/* Header */}
        <div style={modalHeader}>
          <h2 style={modalTitle}>{title}</h2>
        </div>

        {/* Body */}
        <div style={modalBody}>
          {children}
        </div>

        {/* Footer Buttons */}
        <div style={modalFooter}>
          <button onClick={onClose} style={cancelBtn}>
            {cancelText}
          </button>
          {onConfirm && (
            <button onClick={onConfirm} style={confirmBtn} className="btn-press">
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ===================== STYLES + ANIMATION ===================== */
const overlay: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.65)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 2000,
  backdropFilter: 'blur(8px)',
};

const modalContent: React.CSSProperties = {
  background: 'white',
  borderRadius: '24px',
  width: '92%',
  maxWidth: '420px',
  overflow: 'hidden',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
};

const modalHeader: React.CSSProperties = {
  padding: '20px 24px 16px',
  borderBottom: '1px solid #f3e8ff',
  background: 'linear-gradient(135deg, #4c1d95, #7c3aed)',
  color: 'white',
};

const modalTitle: React.CSSProperties = {
  margin: 0,
  fontSize: '20px',
  fontWeight: '700',
  textAlign: 'center' as const,
};

const modalBody: React.CSSProperties = {
  padding: '24px',
  maxHeight: '55vh',
  overflowY: 'auto',
};

const modalFooter: React.CSSProperties = {
  padding: '16px 24px 24px',
  display: 'flex',
  gap: '12px',
  borderTop: '1px solid #f3e8ff',
};

const cancelBtn: React.CSSProperties = {
  flex: 1,
  padding: '16px',
  background: '#f1f5f9',
  color: '#475569',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
};

const confirmBtn: React.CSSProperties = {
  flex: 1,
  padding: '16px',
  background: '#22d3ee',
  color: '#0f172a',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '16px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 4px 15px rgba(34, 211, 238, 0.4)',
};

export default Modal;