// src/core/router/index.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import MapPage from "@/core/map/MapPage";
import OrderJourneyPage from "@/pages/OrderJourneyPage";
import EventReplayPage from "@/pages/EventReplayPage";
import CQRSDashboardPage from "@/pages/CQRSDashboardPage";
import WorkflowDashboardPage from "@/pages/WorkflowDashboardPage";
import DistributedRuntimePage from "@/pages/DistributedRuntimePage";
import SystemDashboardPage from "@/pages/SystemDashboardPage";

// TRANG MỚI
import WarehousePage from "@/pages/WarehousePage";
import DriverPage from "@/pages/DriverPage";
import TrackingPage from "@/pages/TrackingPage";
import CreateShipmentPage from "@/pages/CreateShipmentPage.tsx";
import ShippingFeePage from "@/pages/ShippingFeePage";
import ReceivePackagePage from "@/pages/ReceivePackagePage";

export default function AppRouter() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* CÁC TRANG ĐÃ CÓ */}
        <Route path="/map" element={<MapPage />} />
        <Route path="/journey" element={<OrderJourneyPage />} />
        <Route path="/event-replay" element={<EventReplayPage />} />
        <Route path="/cqrs" element={<CQRSDashboardPage />} />
        <Route path="/workflow" element={<WorkflowDashboardPage />} />
        <Route path="/distributed" element={<DistributedRuntimePage />} />
        <Route path="/system" element={<SystemDashboardPage />} />        
        
        {/* TRANG MỚI (ĐÃ CÓ UI) */}
        <Route path="/gui-hang" element={<CreateShipmentPage />} />
        <Route path="/tra-cuu-cuoc" element={<ShippingFeePage />} />
        <Route path="/nhan-hang" element={<ReceivePackagePage />} />
        <Route path="/driver" element={<DriverPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/warehouse" element={<WarehousePage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}