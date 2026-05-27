import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

const modules = [
  "SMAJ STORE",
  "SMAJ FOOD DELIVERY",
  "SMAJ PI JOBS",
  "SMAJ PI HEALTH",
  "SMAJ PI EDU",
  "SMAJ PI TRANSPORT",
  "SMAJ PI AGRO",
  "SMAJ PI ENERGY",
  "SMAJ PI CHARITY",
  "SMAJ PI HOUSING",
  "SMAJ PI EVENTS",
  "SMAJ PI SWAP",
  "SMAJ TOKEN",
];

const roadmap = [
  ["Q1-Q2 2026", "Phase 1", "Core infrastructure launch with SMAJ PI HUB and SMAJ STORE."],
  ["Q3 2026", "Phase 2", "Jobs and marketplace expansion."],
  ["Q4 2026", "Phase 3", "Health, education, and housing integration."],
  ["Q1 2027", "Phase 4", "AI system expansion across the ecosystem."],
  ["Q2 2027", "Phase 5", "Token utility expansion and broader adoption."],
  ["Q3-Q4 2027", "Phase 6", "Global scaling and strategic partnerships."],
];

const WhitePaperPage = () => {
  return (
    <AppLayout>
      <main className="home-page">
        <section className="home-hero">
          <div className="content-hero-grid">
            <div>
              <span className="home-kicker">SMAJ ECOSYSTEM WHITE PAPER</span>
              <h1>A Unified Digital Ecosystem Connecting Services, Commerce, and Innovation</h1>
              <p>
                Version 2.0, published 2026. The SMAJ Ecosystem is designed as one connected digital infrastructure
                with wallet-first access, verified identity, and multi-service utility.
              </p>
              <div className="home-hero-cta">
                <a href="/docs/SMAJ_ECOSYSTEM_White_Paper_v2.0.pdf" target="_blank" rel="noreferrer">
                  Open PDF v2.0
                </a>
                <Link to="/services">Explore Platforms</Link>
              </div>
            </div>
            <aside className="content-panel">
              <h3>White Paper Snapshot</h3>
              <ul>
                <li>13 integrated ecosystem platforms</li>
                <li>Blockchain-powered identity and payments</li>
                <li>AI-guided navigation and automation</li>
                <li>Pi payments with SMAJ Token utility expansion</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <h2>Executive Summary</h2>
            <p>One access point, one wallet flow, one verified identity, and one AI-supported ecosystem.</p>
          </div>
          <div className="home-highlight-grid">
            <article className="home-highlight-card">
              <h3>One Access Point</h3>
              <p>SMAJ PI HUB is the central gateway for users, partners, and developers.</p>
            </article>
            <article className="home-highlight-card">
              <h3>One Wallet Flow</h3>
              <p>Single wallet connection for service access and transaction continuity.</p>
            </article>
            <article className="home-highlight-card">
              <h3>One Verified Identity</h3>
              <p>Identity-backed trust layer for safer cross-platform participation.</p>
            </article>
            <article className="home-highlight-card">
              <h3>AI Guidance</h3>
              <p>Recommendations, fraud monitoring, and workflow assistance across modules.</p>
            </article>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <h2>Problem Statement</h2>
          </div>
          <div className="content-panel">
            <ol className="wp-list">
              <li>Digital services are fragmented across too many separate apps and accounts.</li>
              <li>Users repeatedly recreate identity, login, and payment flows.</li>
              <li>Many digital currencies still lack broad real-world utility.</li>
              <li>Trust gaps remain across vendors and service providers.</li>
              <li>Small enterprises lack shared infrastructure to scale online.</li>
            </ol>
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <h2>The 13 Integrated Platforms</h2>
          </div>
          <div className="wp-modules-grid">
            {modules.map((module, index) => (
              <article key={module} className="home-service-card">
                <h3>
                  {index + 1}. {module}
                </h3>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section" id="roadmap">
          <div className="home-section-head">
            <h2>Roadmap</h2>
          </div>
          <div className="wp-roadmap-grid">
            {roadmap.map(([time, phase, detail]) => (
              <article key={phase} className="home-highlight-card">
                <strong>{time}</strong>
                <h3>{phase}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="home-section-head">
            <h2>Disclaimer</h2>
            <p>
              This page summarizes the SMAJ Ecosystem White Paper v2.0 for informational purposes and does not
              constitute financial, legal, or investment advice.
            </p>
            <Link to="/contact">Contact The Team</Link>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default WhitePaperPage;
