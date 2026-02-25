import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Layout() {
  /** Main app shell layout with retro/light header + sidebar. */
  const { isAuthenticated, signIn, signOut } = useAuth();

  return (
    <div className="rd-app">
      <header className="rd-header">
        <div className="rd-header-inner">
          <div className="rd-brand">
            <div className="rd-brand-badge" aria-hidden="true" />
            <div>
              <div>Resident Directory</div>
              <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>
                retro light • primary {`#3b82f6`} • success {`#06b6d4`}
              </div>
            </div>
          </div>

          <div className="rd-header-actions">
            {!isAuthenticated ? (
              <button className="rd-btn rd-btn-primary" onClick={() => signIn("demo-token")}>
                Demo Sign In
              </button>
            ) : (
              <button className="rd-btn" onClick={signOut}>
                Sign Out
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="rd-shell">
        <aside className="rd-sidebar" aria-label="Sidebar navigation">
          <h3>Navigate</h3>
          <nav className="rd-nav">
            <NavLink
              to="/login"
              className={({ isActive }) => `rd-nav-link ${isActive ? "rd-nav-link-active" : ""}`}
            >
              Login
            </NavLink>
            <NavLink
              to="/residents"
              className={({ isActive }) => `rd-nav-link ${isActive ? "rd-nav-link-active" : ""}`}
            >
              Residents
            </NavLink>
            <NavLink
              to="/admin/residents/new"
              className={({ isActive }) => `rd-nav-link ${isActive ? "rd-nav-link-active" : ""}`}
            >
              Admin: New Resident
            </NavLink>
          </nav>

          <div className="rd-footer-note">
            Admin routes are protected (redirect to Login when signed out).
          </div>
        </aside>

        <main className="rd-content" aria-label="Main content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
