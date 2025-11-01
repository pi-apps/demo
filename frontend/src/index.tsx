// --- File: frontend/src/index.tsx ---

import React from "react";
// --- PERBAIKAN 1: Impor 'react-dom' (bukan 'react-dom/client') ---
import ReactDOM from "react-dom";

// Impor CSS global Anda
import "./defaults.css";

// Impor komponen utama Shop Anda
import Shop from "./Shop";

// --- PERBAIKAN 2: Gunakan sintaks 'ReactDOM.render' yang lama ---
ReactDOM.render(
  <React.StrictMode>
    <Shop />
  </React.StrictMode>,
  document.getElementById("root")
);
