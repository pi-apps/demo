import AppLayout from "../layouts/AppLayout";

const plans = [
  ["Free", "0 Pi", "Try the hub with no cost"],
  ["Starter", "0.0000318 Pi", "Use popular services more often"],
  ["Pro", "0.0000636 Pi", "Priority support and faster access"],
  ["Premium", "0.000159 Pi", "Team scale and advanced workflows"],
];

const PricingPage = () => {
  return (
    <AppLayout>
      <main className="home-page">
        <section className="home-hero">
          <span className="home-kicker">SMAJ PI HUB PLANS</span>
          <h1>Simple Pricing That Fits Your Journey</h1>
          <p>Start free, upgrade when ready, and keep everything easy.</p>
        </section>

        <section className="home-section">
          <div className="price-grid">
            {plans.map(([name, price, desc]) => (
              <article key={name} className="home-service-card">
                <h3>{name}</h3>
                <p className="plan-price">{price}</p>
                <p>{desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default PricingPage;
