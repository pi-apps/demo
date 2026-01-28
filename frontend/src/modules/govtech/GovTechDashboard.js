import React from "react";

export default function GovTechDashboard() {
  return (
    <div>
      <h2>Royal Mix GovTech Dashboard</h2>
      <p>Government Revenue, Taxes, Licenses & Permits</p>

      <div className="grid">
        <button>Tax Collection</button>
        <button>License Payments</button>
        <button>Permit Services</button>
        <button>Fines & Utilities</button>
      </div>
    </div>
  );
    }
