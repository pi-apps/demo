import React from 'react';
import './LandingPage.css'; // Optional: for styling

function LandingPage() {
  return (
    <div className="landing-container">
      <h1>Welcome to TrustSphere</h1>
      <p>
        A modular trust infrastructure for the Pi economy — combining escrow, reputation scoring, and dispute resolution.
      </p>

      <ul className="link-list">
        <li><a href="/escrow">🔐 Escrow Demo</a></li>
        <li><a href="/reputation">📊 Reputation Score</a></li>
        <li><a href="/dispute">⚖️ Dispute Form</a></li>
        <li><a href="https://github.com/oreo-collab/demo" target="_blank" rel="noopener noreferrer">📁 GitHub Repo</a></li>
        <li><a href="https://github.com/oreo-collab/demo/blob/main/docs/api.md" target="_blank" rel="noopener noreferrer">📚 API Docs</a></li>
        <li><a href="https://github.com/oreo-collab/demo/blob/main/roadmap.md" target="_blank" rel="noopener noreferrer">🛣️ Roadmap</a></li>
      </ul>
    </div>
  );
}

export default LandingPage;
