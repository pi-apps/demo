import { useState } from "react";
import type { FormEvent } from "react";
import AppLayout from "../layouts/AppLayout";

const ContactPage = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Thanks. Your message has been recorded for the support team.");
  };

  return (
    <AppLayout>
      <main className="home-page">
        <section className="home-hero">
          <span className="home-kicker">GET IN TOUCH</span>
          <h1>Contact SMAJ PI HUB</h1>
          <p>Ask a question or share feedback and we will reply quickly.</p>
        </section>

        <section className="home-section contact-grid">
          <form onSubmit={handleSubmit} className="contact-form">
            <h2>Send a Message</h2>
            <label htmlFor="name">Name</label>
            <input id="name" type="text" required />
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required />
            <label htmlFor="contact-message">Message</label>
            <textarea id="contact-message" rows={6} required />
            <button type="submit">Send Message</button>
            {message ? <p>{message}</p> : null}
          </form>

          <aside className="home-highlight-card">
            <h3>Other Ways to Reach Us</h3>
            <p>Email: smajpihub@gmail.com</p>
            <p>Office Hours: Mon - Sat, 9:00 AM to 6:00 PM</p>
          </aside>
        </section>
      </main>
    </AppLayout>
  );
};

export default ContactPage;
