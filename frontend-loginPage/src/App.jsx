import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthProvider";

import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Bookings from "./pages/Bookings";
import Telemetry from "./pages/Telemetry";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";

// ROLE-BASED ROUTE GUARD
function RoleRoute({ children, allowed }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" replace />;

  // If role NOT allowed – redirect appropriately
  if (!allowed.includes(role)) {
    if (role === "CUSTOMER") return <Navigate to="/bookings" replace />;
    if (role === "DISPATCHER") return <Navigate to="/vehicles" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />

        {/* Dashboard - Only ADMIN + DISPATCHER */}
        <Route
          path="/dashboard"
          element={
            <RoleRoute allowed={["ADMIN", "DISPATCHER"]}>
              <Dashboard />
            </RoleRoute>
          }
        />

        {/* Vehicles - ADMIN + DISPATCHER */}
        <Route
          path="/vehicles"
          element={
            <RoleRoute allowed={["ADMIN", "DISPATCHER"]}>
              <Vehicles />
            </RoleRoute>
          }
        />

        {/* Telemetry - ADMIN only */}
        <Route
          path="/telemetry"
          element={
            <RoleRoute allowed={["ADMIN"]}>
              <Telemetry />
            </RoleRoute>
          }
        />

        {/* Bookings - ALL ROLES */}
        <Route
          path="/bookings"
          element={
            <RoleRoute allowed={["ADMIN", "DISPATCHER", "CUSTOMER"]}>
              <Bookings />
            </RoleRoute>
          }
        />

        {/* Maintenance - ADMIN + DISPATCHER */}
        <Route
          path="/maintenance"
          element={
            <RoleRoute allowed={["ADMIN", "DISPATCHER"]}>
              <Maintenance />
            </RoleRoute>
          }
        />

        {/* Reports - ADMIN only */}
        <Route
          path="/reports"
          element={
            <RoleRoute allowed={["ADMIN"]}>
              <Reports />
            </RoleRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </AuthProvider>
  );
}
