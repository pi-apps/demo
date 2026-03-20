import type { CSSProperties } from "react";
import type { User } from "../types/pi.ts";

interface HeaderProps {
  onSignIn: () => void;
  onSignOut: () => void;
  onSendTestNotification: () => void;
  user: User | null;
  isLoading?: boolean;
}

const headerStyle: CSSProperties = {
  padding: 8,
  backgroundColor: "gray",
  color: "white",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const userSectionStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const Header = ({ user, onSignIn, onSignOut, onSendTestNotification, isLoading }: HeaderProps) => {
  return (
    <header style={headerStyle}>
      <div style={{ fontWeight: "bold" }}>Pi Bakery</div>

      <div style={userSectionStyle}>
        {user ? (
          <>
            <span>@{user.username}</span>
            <button type="button" onClick={onSignOut} disabled={isLoading}>
              Sign out
            </button>
            {user.roles.includes("core_team") && (
              <button onClick={onSendTestNotification}>Send Test Notification to yourself</button>
            )}
          </>
        ) : (
          <button onClick={onSignIn} disabled={isLoading}>
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
