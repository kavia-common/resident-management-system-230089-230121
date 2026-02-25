import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import ResidentsListPage from "./pages/ResidentsListPage";
import ResidentDetailPage from "./pages/ResidentDetailPage";
import AdminResidentNewPage from "./pages/AdminResidentNewPage";
import AdminResidentEditPage from "./pages/AdminResidentEditPage";
import "./App.css";

// PUBLIC_INTERFACE
export default function App() {
  /** App entry component: defines the routing tree and high-level layout. */
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/residents" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/residents" element={<ResidentsListPage />} />
        <Route path="/residents/:id" element={<ResidentDetailPage />} />

        {/* Protected admin routes */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="residents/new" element={<AdminResidentNewPage />} />
          <Route path="residents/:id/edit" element={<AdminResidentEditPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/residents" replace />} />
      </Route>
    </Routes>
  );
}
