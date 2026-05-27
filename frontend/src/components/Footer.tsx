import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="smaj-footer">
      <div className="smaj-footer-grid">
        <div>
          <h4>SMAJ PI HUB</h4>
          <p>Built for Pi wallet access, with SMAJ Token utility expanding across the ecosystem.</p>
        </div>
        <div>
          <h4>Platform</h4>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/white-paper">White Paper</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div>
          <h4>Programs</h4>
          <Link to="/affiliate">Affiliate Program</Link>
          <Link to="/collaborate">Collaborate With Us</Link>
          <Link to="/partners">Partners</Link>
          <Link to="/community">Community</Link>
          <Link to="/developers">Developers</Link>
        </div>
        <div>
          <h4>Legal</h4>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms & Conditions</Link>
          <Link to="/cookies">Cookie Policy</Link>
          <Link to="/report-abuse">Report Abuse</Link>
        </div>
      </div>
      <p className="smaj-copyright">&copy; 2026 SMAJ PI HUB. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
