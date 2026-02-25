import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function isValidEmail(value) {
  // Pragmatic email validation (frontend-only); backend remains source of truth.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

// PUBLIC_INTERFACE
export default function LoginPage() {
  /** Login page with email/password form wired to POST /auth/login. */
  const { isAuthenticated, isRestoring, authError, login, logout, setAuthToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/residents";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [touched, setTouched] = useState({ email: false, password: false });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailError = useMemo(() => {
    if (!touched.email) return "";
    if (!email.trim()) return "Email is required.";
    if (!isValidEmail(email)) return "Enter a valid email address.";
    return "";
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    if (!touched.password) return "";
    if (!password) return "Password is required.";
    if (String(password).length < 6) return "Password must be at least 6 characters.";
    return "";
  }, [password, touched.password]);

  const canSubmit = !emailError && !passwordError && email.trim() && password && !isSubmitting;

  async function onSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setFormError("");

    if (!email.trim() || !password) {
      setFormError("Please fill in your email and password.");
      return;
    }
    if (emailError || passwordError) return;

    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch {
      // authError is set by AuthProvider; keep a small local fallback.
      if (!authError) setFormError("Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1 className="rd-page-title">Login</h1>
      <p className="rd-page-subtitle">
        Sign in to access admin pages. Backend auth endpoints are still being implemented, so you may see a graceful
        error if they are unavailable.
      </p>

      <div className="rd-card">
        <div className="rd-kv">
          <label>Status</label>
          <div>
            {isRestoring
              ? "Restoring session…"
              : isAuthenticated
                ? "Authenticated"
                : "Signed out"}
          </div>

          <label>After login</label>
          <div>{from}</div>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={onSubmit} style={{ marginTop: 14 }}>
            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontWeight: 650, color: "var(--muted)" }} htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  aria-invalid={Boolean(emailError)}
                  aria-describedby={emailError ? "email-error" : undefined}
                  style={{
                    border: `1px solid ${emailError ? "rgba(239, 68, 68, 0.5)" : "var(--border)"}`,
                    borderRadius: 12,
                    padding: "10px 12px",
                    font: "inherit",
                    outline: "none",
                  }}
                />
                {emailError ? (
                  <div id="email-error" style={{ color: "var(--color-error)", fontSize: 12, fontWeight: 600 }}>
                    {emailError}
                  </div>
                ) : null}
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ fontWeight: 650, color: "var(--muted)" }} htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby={passwordError ? "password-error" : undefined}
                  style={{
                    border: `1px solid ${passwordError ? "rgba(239, 68, 68, 0.5)" : "var(--border)"}`,
                    borderRadius: 12,
                    padding: "10px 12px",
                    font: "inherit",
                    outline: "none",
                  }}
                />
                {passwordError ? (
                  <div id="password-error" style={{ color: "var(--color-error)", fontSize: 12, fontWeight: 600 }}>
                    {passwordError}
                  </div>
                ) : null}
              </div>

              {formError || authError ? (
                <div style={{ color: "var(--color-error)", fontSize: 13, fontWeight: 700 }}>
                  {formError || authError}
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button className="rd-btn rd-btn-primary" type="submit" disabled={!canSubmit}>
                  {isSubmitting ? "Signing in…" : "Sign In"}
                </button>

                <button
                  className="rd-btn"
                  type="button"
                  onClick={() => {
                    // Keep a demo escape hatch while backend isn't ready.
                    setAuthToken("demo-token");
                    navigate(from, { replace: true });
                  }}
                >
                  Demo Sign In
                </button>
              </div>

              <div style={{ color: "var(--muted)", fontSize: 12, lineHeight: 1.4 }}>
                Demo Sign In stores a placeholder token locally (no server call).
              </div>
            </div>
          </form>
        ) : (
          <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="rd-btn" onClick={logout}>
              Sign Out
            </button>
            <button className="rd-btn rd-btn-primary" onClick={() => navigate("/admin/residents/new")}>
              Go to Admin
            </button>
          </div>
        )}
      </div>
    </>
  );
}
