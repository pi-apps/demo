import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

const platforms = [
  ["SMAJ STORE", "Shop products and services with Pi.", "Ready Now"],
  ["SMAJ PI JOBS", "Find jobs and freelance opportunities.", "Coming Soon"],
  ["SMAJ PI HEALTH", "Book care and medical services.", "Coming Soon"],
  ["SMAJ PI EDU", "Learn skills from trusted mentors.", "Coming Soon"],
  ["SMAJ PI TRANSPORT", "Access mobility and ride services.", "Coming Soon"],
  ["SMAJ PI HOUSING", "Browse rental and housing options.", "Coming Soon"],
];

const ServicesPage = () => {
  return (
    <AppLayout>
      <main className="home-page">
        <section className="home-hero">
          <div className="content-hero-grid">
            <div>
              <span className="home-kicker">ALL-IN-ONE PI SERVICE HUB</span>
              <h1>Access Every SMAJ Platform From One Place</h1>
              <p>
                Connect your wallet once and unlock ecosystem projects including e-commerce, digital services, and
                upcoming tools.
              </p>
              <div className="home-hero-cta">
                <a href="https://officialsmaj.github.io/smaj-ecosystem-dashboard/" target="_blank" rel="noreferrer">
                  Open Unified Dashboard
                </a>
                <Link to="/how-it-works">How It Works</Link>
              </div>
            </div>
            <aside className="content-panel">
              <h3>Cross-Platform Access</h3>
              <p>One wallet, one identity, one user journey across connected SMAJ services.</p>
            </aside>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <h2>Platform Directory</h2>
            <p>Choose where to go next.</p>
          </div>
          <div className="home-service-grid">
            {platforms.map(([name, description, status]) => (
              <article key={name} className="home-service-card">
                <h3>{name}</h3>
                <p>{description}</p>
                <span className="status-chip">{status}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default ServicesPage;
