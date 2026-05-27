import { Link } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";

const FaqPage = () => {
  return (
    <AppLayout>
      <main className="home-page">
        <section className="home-hero">
          <span className="home-kicker">HELP CENTER</span>
          <h1>Frequently Asked Questions</h1>
          <p>Quick answers to help you start, explore services, and get support.</p>
        </section>

        <section className="home-section">
          <div className="faq-list">
            <details className="faq-item" open>
              <summary>What is SMAJ PI HUB?</summary>
              <p>SMAJ PI HUB is one place to access services, shops, and community tools.</p>
            </details>
            <details className="faq-item">
              <summary>How do I get started?</summary>
              <p>Connect your wallet, then explore services that match your needs.</p>
            </details>
            <details className="faq-item">
              <summary>What services can I use?</summary>
              <p>Jobs, education, health, transport, housing, and more in one hub.</p>
            </details>
            <details className="faq-item">
              <summary>How do I get support?</summary>
              <p>Use our contact page and the team will respond quickly.</p>
              <Link to="/contact">Contact Support</Link>
            </details>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default FaqPage;
