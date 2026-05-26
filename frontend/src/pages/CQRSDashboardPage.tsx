import React, { useEffect, useState } from "react";

import { queryService } from "@/core/cqrs/queryService";

export default function CQRSDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [cache, setCache] = useState<any>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(queryService.getOrders());
      setCache(queryService.debug());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>⚡ CQRS READ MODEL DASHBOARD</h2>

      <div style={section}>
        <h3>📦 Orders</h3>

        {orders.map((o, idx) => (
          <div key={idx} style={card}>
            <div>Order: {o.orderId}</div>
            <div>Status: {o.status}</div>
          </div>
        ))}
      </div>

      <div style={section}>
        <h3>🧠 Query Cache</h3>

        <pre style={box}>
          {JSON.stringify(cache, null, 2)}
        </pre>
      </div>
    </div>
  );
}

const section = {
  marginBottom: "30px",
};

const card = {
  background: "#fff",
  padding: "12px",
  borderRadius: "10px",
  marginBottom: "10px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};

const box = {
  background: "#111827",
  color: "#22c55e",
  padding: "16px",
  borderRadius: "12px",
  overflow: "auto",
};