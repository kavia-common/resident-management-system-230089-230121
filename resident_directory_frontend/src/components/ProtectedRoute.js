import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function ProtectedRoute() {
  /** Protects nested routes: if not authenticated, redirects to /login. */
  const { isAuthenticated, isRestoring } = useAuth();
  const location = useLocation();

  // Avoid redirecting while we are still attempting to restore session from an existing token.
  if (isRestoring) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
