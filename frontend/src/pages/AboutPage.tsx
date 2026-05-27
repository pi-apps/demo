import AppLayout from "../layouts/AppLayout";

const AboutPage = () => {
  return (
    <AppLayout>
      <main className="home-page">
        <section className="home-hero">
          <div className="content-hero-grid">
            <div>
              <span className="home-kicker">ABOUT SMAJ PI HUB</span>
              <h1>One Ecosystem. Real Pi Utility. Global Opportunity.</h1>
              <p>
                SMAJ PI HUB is a Pi-powered ecosystem where users connect once and access essential services including
                jobs, education, health, transport, housing, and charity.
              </p>
            </div>
            <aside className="content-panel">
              <h3>What We Stand For</h3>
              <ul>
                <li>Utility-first digital economy</li>
                <li>Global access for skills and services</li>
                <li>Secure and transparent platform flow</li>
                <li>Long-term ecosystem expansion</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="home-section">
          <div className="home-service-grid">
            <article className="home-service-card">
              <h3>Mission</h3>
              <p>
                Create real economic utility for Pi by building a trusted platform where users and providers transact
                and grow together.
              </p>
            </article>
            <article className="home-service-card">
              <h3>Vision</h3>
              <p>
                Empower a borderless ecosystem where anyone can use their skills and services to generate sustainable
                opportunity.
              </p>
            </article>
            <article className="home-service-card">
              <h3>Trust</h3>
              <p>Ensure secure transactions, transparent process, and reliable standards across every service flow.</p>
            </article>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default AboutPage;
