// --- SignIn.tsx ---

import React from "react";
import "./SignIn.css"; // <- Impor file CSS baru Anda

interface Props {
  onSignIn: () => void;
  onModalClose: () => void;
}

export default function SignIn(props: Props) {
  return (
    <div className="modal-overlay" onClick={props.onModalClose}>
      {" "}
      {/* Klik di luar modal untuk menutup */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {" "}
        {/* Mencegah penutupan saat klik di dalam modal */}
        <h2>Login Diperlukan</h2>
        <p>Anda perlu masuk (sign in) terlebih dahulu untuk melanjutkan pembelian ini.</p>
        <div className="modal-buttons">
          <button onClick={props.onSignIn} className="modal-button primary">
            Sign In dengan Pi
          </button>
          <button onClick={props.onModalClose} className="modal-button secondary">
            Batal
          </button>
        </div>
      </div>
    </div>
  );
}
