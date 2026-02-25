import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Placeholder login page. */
  const { isAuthenticated, signIn, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/residents";

  return (
    <>
      <h1 className="rd-page-title">Login</h1>
      <p className="rd-page-subtitle">
        Placeholder auth only. Use Demo Sign In to simulate an authenticated user.
      </p>

      <div className="rd-card">
        <div className="rd-kv">
          <label>Status</label>
          <div>{isAuthenticated ? "Authenticated (demo)" : "Signed out"}</div>

          <label>After login</label>
          <div>{from}</div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
          {!isAuthenticated ? (
            <button
              className="rd-btn rd-btn-primary"
              onClick={() => {
                signIn("demo-token");
                navigate(from, { replace: true });
              }}
            >
              Demo Sign In & Continue
            </button>
          ) : (
            <>
              <button className="rd-btn" onClick={signOut}>
                Sign Out
              </button>
              <button className="rd-btn rd-btn-primary" onClick={() => navigate("/admin/residents/new")}>
                Go to Admin
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
