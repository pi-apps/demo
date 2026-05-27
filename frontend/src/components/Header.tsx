import { NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const Header = () => {
  const { user, isAuthenticated, signIn, signOut, isLoading } = useAuthContext();

  return (
    <header className="smaj-header">
      <div className="smaj-header-inner">
        <NavLink to="/" className="smaj-logo-link" aria-label="SMAJ PI HUB Home">
          <img src="/logo.png" alt="SMAJ PI HUB Logo" className="smaj-logo" />
        </NavLink>
        <nav className="smaj-nav" aria-label="Primary">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/white-paper">White Paper</NavLink>
          <NavLink to="/how-it-works">How It Works</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>
        <div className="smaj-auth-section">
          {isAuthenticated && user ? (
            <div className="smaj-user-info">
              <span className="smaj-username">{user.username}</span>
              <button 
                onClick={signOut} 
                className="smaj-signout-btn"
                disabled={isLoading}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button 
              onClick={signIn} 
              className="smaj-login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Login with Pi"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
