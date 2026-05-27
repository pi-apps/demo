  import { Link } from "react-router-dom";
import styles from "./HomePage.module.css";
import AppLayout from "../layouts/AppLayout";

const HomePage = () => {
  return (
    <AppLayout>
      <main className={styles.homePage}>
        <section className={styles.homeHero}>
          <div className={styles.homeHeroGrid}>
            <div>
              <span className={styles.homeKicker}>SMAJ PI HUB ECOSYSTEM</span>
              <h1>All Your Pi Services in One Place.</h1>
              <p>
                Connect once and access services like jobs, healthcare, education, transport, housing, charity, and
                more through Pi wallet access and expanding SMAJ Token utility.
              </p>
              <div className="home-hero-cta">
                <Link to="/services">Platform Directory</Link>
                <Link to="/white-paper">Read White Paper</Link>
              </div>
              <div className="home-proof">
                <div>
                  <strong>Pi Native</strong>
                  <span>Built for Pi transactions</span>
                </div>
                <div>
                  <strong>Secure Flow</strong>
                  <span>Escrow and verified delivery</span>
                </div>
                <div>
                  <strong>Growing Hub</strong>
                  <span>More services launching</span>
                </div>
              </div>
            </div>

            <article className="home-hero-card">
              <img src="/smaj-hero.png" alt="SMAJ PI HUB platform overview" />
              <div>
                <h3>Everything in one Pi ecosystem</h3>
                <p>Access real utility services from a single trusted platform.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <h2>Services Preview</h2>
            <p>A glimpse into our ecosystem.</p>
          </div>
          <div className="home-service-grid">
            <article className="home-service-card">
              <h3>PI Jobs</h3>
              <p>Freelance and job opportunities.</p>
            </article>
            <article className="home-service-card">
              <h3>SMAJ STORE</h3>
              <p>Buy products and services with Pi.</p>
            </article>
            <article className="home-service-card">
              <h3>Healthcare</h3>
              <p>Medical discovery and booking tools.</p>
            </article>
            <article className="home-service-card">
              <h3>Education</h3>
              <p>Learning, upskilling, and mentorship.</p>
            </article>
            <article className="home-service-card">
              <h3>Transport</h3>
              <p>Mobility services and rides.</p>
            </article>
            <article className="home-service-card">
              <h3>Housing</h3>
              <p>Property listings and rental support.</p>
            </article>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <h2>Why Users Trust SMAJ PI HUB</h2>
            <p>Designed for clarity, security, and real Pi utility.</p>
          </div>
          <div className="home-highlight-grid">
            <article className="home-highlight-card">
              <h3>Unified Wallet</h3>
              <p>Connect your Pi wallet once to access ecosystem services.</p>
            </article>
            <article className="home-highlight-card">
              <h3>Verified Escrow System</h3>
              <p>Secure transactions with built-in escrow protection.</p>
            </article>
            <article className="home-highlight-card">
              <h3>Pi-Powered Utility</h3>
              <p>Services and products payable in Pi.</p>
            </article>
            <article className="home-highlight-card">
              <h3>Global Access</h3>
              <p>Access services from anywhere.</p>
            </article>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <h2>Trust & Verification</h2>
            <p>
              A multi-layered verification model is planned to reduce fraud, improve safety, and help users transact
              with confidence across the ecosystem.
            </p>
          </div>
          <div className="home-trust-grid">
            <article className="home-trust-card">
              <h3>KYC + Account Signals</h3>
              <p>Identity and account-level checks to strengthen platform credibility.</p>
            </article>
            <article className="home-trust-card">
              <h3>Escrow-First Payments</h3>
              <p>Transaction protection with milestone-based fund release patterns.</p>
            </article>
            <article className="home-trust-card">
              <h3>Reputation Layer</h3>
              <p>Ratings and history to help users choose reliable sellers and service providers.</p>
            </article>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default HomePage;
