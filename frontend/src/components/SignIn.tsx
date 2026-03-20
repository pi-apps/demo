import type { CSSProperties } from "react";

interface SignInProps {
  onSignIn: () => void;
  onModalClose: () => void;
  disabled?: boolean;
}

const modalStyle: CSSProperties = {
  background: "white",
  position: "absolute",
  left: "15vw",
  top: "40%",
  width: "70vw",
  height: "25vh",
  border: "1px solid black",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "1rem",
  gap: "1rem",
};

const buttonContainerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "1rem",
};

const SignIn = ({ onSignIn, onModalClose, disabled }: SignInProps) => {
  return (
    <div style={modalStyle}>
      <p style={{ fontWeight: "bold" }}>You need to sign in first.</p>
      <div style={buttonContainerStyle}>
        <button onClick={onSignIn} disabled={disabled}>
          Sign in
        </button>
        <button onClick={onModalClose}>Close</button>
      </div>
    </div>
  );
};

export default SignIn;
