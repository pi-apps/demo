import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BoltIcon from '@mui/icons-material/Bolt';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import styles from './Header.module.css';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user`, { withCredentials: true });
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        // No active session found or backend unreachable
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  const onIncompletePaymentFound = async (payment: any) => {
    console.log('Incomplete payment found:', payment);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/incomplete`,
        { payment },
        { withCredentials: true }
      );
    } catch (err) {
      console.error('Failed to handle incomplete payment:', err);
    }
  };

  const handlePiLogin = async () => {
    try {
      const scopes = ['username', 'payments'];

      const authResponse = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signin`, 
        { auth: authResponse }, 
        { withCredentials: true }
      );
      setUser(authResponse.user);
      console.log('Pi Auth Success:', authResponse);
    } catch (err) {
      console.error('Pi Authentication failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`, {}, { withCredentials: true });
      setUser(null);
      closeMenu();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link to="/" className={styles.logoLink} onClick={closeMenu}>
          <img src="/logo.png" alt="SMAJ PI HUB Logo" className={styles.logo} />
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/white-paper">White Paper</NavLink>
          <NavLink to="/how-it-works">How It Works</NavLink>
          <NavLink to="/pricing">Pricing</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className={styles.headerActions}>
          {isLoading ? (
            <div className={styles.loader} />
          ) : user ? (
            <div className={styles.userContainer}>
              <div className={styles.userInfo} onClick={toggleUserMenu}>
                <AccountCircleIcon />
                <span>{user.username}</span>
              </div>
              
              {isUserMenuOpen && (
                <div className={styles.userDropdown}>
                  <Link to="/profile" onClick={closeMenu}>My Profile</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <button className={styles.piLoginBtn} onClick={handlePiLogin}>
              <BoltIcon /> 
              <span>Login with Pi</span>
            </button>
          )}

          {/* Hamburger Menu Toggle */}
          <button 
            className={styles.menuToggle} 
            onClick={toggleMenu} 
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className={styles.menuOverlay} onClick={closeMenu} />}

      {/* Mobile Navigation Drawer */}
      <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}>
        <div className={styles.mobileNavLinks}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/services" onClick={closeMenu}>Services</NavLink>
          <NavLink to="/white-paper" onClick={closeMenu}>White Paper</NavLink>
          <NavLink to="/how-it-works" onClick={closeMenu}>How It Works</NavLink>
          <NavLink to="/pricing" onClick={closeMenu}>Pricing</NavLink>
          <NavLink to="/faq" onClick={closeMenu}>FAQ</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
        </div>
      </nav>
    </header>
  );
};

export default Header;