import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

const steps = [
  ["01", "Connect Wallet", "Link your Pi wallet once to unlock the hub."],
  ["02", "Explore Services", "Browse services and choose what fits your need."],
  ["03", "Use Services", "Order, book, or hire and pay with Pi."],
  ["04", "Contribute/Support", "Rate, share, and support community growth."],
];

const HowItWorksPage = () => {
  return (
    <AppLayout>
      <main className="home-page">
        <section className="home-hero">
          <span className="home-kicker">SMAJ PI HUB PROCESS</span>
          <h1>How It Works in 4 Simple Steps</h1>
          <p>Connect once, explore what you need, use services with Pi, and support the community.</p>
          <div className="home-hero-cta">
            <Link to="/services">Explore Services</Link>
            <a href="https://officialsmaj.github.io/smaj-ecosystem-dashboard/" target="_blank" rel="noreferrer">
              Open Dashboard
            </a>
          </div>
        </section>

        <section className="home-section">
          <div className="content-step-grid">
            {steps.map(([num, title, description]) => (
              <article key={num} className="home-highlight-card">
                <strong>{num}</strong>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default HowItWorksPage;
