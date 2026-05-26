// src/core/map/MapPage.tsx

import React, { useEffect, useState } from "react";

import { initMapListener } from "@/core/map/mapListener";
import { routeAnimationEngine } from "@/core/map/routeAnimationEngine";

type DriverMarker = {
  driverId: string;
  current: {
    lat: number;
    lng: number;
  };
};

export default function MapPage() {
  const [drivers, setDrivers] = useState<DriverMarker[]>([]);

  useEffect(() => {
    /**
     * INIT MAP LISTENER (SAFE)
     */
    try {
      initMapListener();
    } catch (err) {
      console.error("[Map] initMapListener error:", err);
    }

    /**
     * ANIMATION LOOP
     * - chống multiple interval (React StrictMode)
     * - tránh memory leak
     */
    const interval = setInterval(() => {
      try {
        routeAnimationEngine.tick();

        const data = routeAnimationEngine.getDrivers?.() || [];

        setDrivers([...data]);
      } catch (err) {
        console.error("[Map] animation error:", err);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>🗺️ GHN.PI LIVE ROUTE ANIMATION</h2>

      <div style={mapBox}>
        {drivers.length === 0 && (
          <div style={emptyState}>
            No drivers running...
          </div>
        )}

        {drivers.map((d) => (
          <div
            key={d.driverId}
            style={{
              ...marker,

              /**
               * SAFE POSITIONING
               * tránh NaN nếu engine chưa có data
               */
              left: `${((d?.current?.lng ?? 0) % 1) * 80}%`,
              top: `${((d?.current?.lat ?? 0) % 1) * 80}%`,
            }}
          >
            🚚 {d.driverId}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * MAP CONTAINER
 */
const mapBox: React.CSSProperties = {
  height: "600px",
  background: "#0f172a",
  position: "relative",
  borderRadius: "12px",
  overflow: "hidden",
};

/**
 * DRIVER MARKER
 */
const marker: React.CSSProperties = {
  position: "absolute",
  width: "120px",
  background: "#22c55e",
  color: "white",
  padding: "6px",
  borderRadius: "8px",
  transition: "all 0.05s linear",
  fontSize: "12px",
};

/**
 * EMPTY STATE
 */
const emptyState: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  color: "#94a3b8",
  fontSize: "14px",
};