import React, { useEffect, useState } from "react";

import { journeyStore } from "@/core/journey/journeyStore";

export default function OrderJourneyPage() {
  const [journeys, setJourneys] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setJourneys(journeyStore.getAll());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 ORDER JOURNEY VISUALIZER</h2>

      {journeys.map((journey) => (
        <div key={journey.orderId} style={card}>
          <h3>Order: {journey.orderId}</h3>

          <div style={timeline}>
            {journey.steps.map((step: any, idx: number) => (
              <div key={idx} style={stepBox}>
                <div style={dot} />

                <div>
                  <strong>{step.status}</strong>
                  <div style={{ fontSize: 12 }}>
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const card = {
  background: "#fff",
  borderRadius: "12px",
  padding: "16px",
  marginBottom: "20px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
};

const timeline = {
  marginTop: "16px",
  borderLeft: "3px solid #22c55e",
  paddingLeft: "16px",
};

const stepBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "14px",
};

const dot = {
  width: "12px",
  height: "12px",
  borderRadius: "9999px",
  background: "#22c55e",
};