import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client";

/**
 * Auth context for the Resident Directory frontend.
 *
 * Responsibilities:
 * - Persist JWT access token in localStorage (rd_token)
 * - Provide login/logout methods
 * - Restore session on reload by calling /auth/me when a token exists
 *
 * Backend endpoints are placeholders for now, so the implementation includes
 * graceful error handling when the backend is not ready.
 */

const STORAGE_KEY = "rd_token";

const AuthContext = createContext(null);

function normalizeAuthError(err) {
  const status = err?.status;
  const body = err?.body;

  // Try to extract a backend-provided error message (common patterns).
  const backendMsg =
    (body && typeof body === "object" && (body.message || body.detail || body.error)) || "";

  if (backendMsg) return String(backendMsg);
  if (status === 401) return "Invalid email or password.";
  if (status) return `Login failed (HTTP ${status}).`;

  // Likely network/CORS/backend-not-running.
  return "Unable to reach the server. Please try again later.";
}

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Provides authentication state + actions to the component tree. */
  const [token, setToken] = useState(() => window.localStorage.getItem(STORAGE_KEY) || "");
  const [user, setUser] = useState(null);

  // isRestoring helps ProtectedRoute avoid redirecting during initial session restore.
  const [isRestoring, setIsRestoring] = useState(Boolean(token));
  const [authError, setAuthError] = useState("");

  // PUBLIC_INTERFACE
  const login = async ({ email, password }) => {
    /** Logs in via POST /auth/login, stores token, and returns { token, user? }. */
    setAuthError("");

    const payload = { email: String(email || ""), password: String(password || "") };

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Accept a few common shapes:
      // - { access_token: "...", token_type: "bearer" }
      // - { token: "..." }
      // - { jwt: "..." }
      const nextToken =
        (data && (data.access_token || data.token || data.jwt)) ? String(data.access_token || data.token || data.jwt) : "";

      if (!nextToken) {
        throw new Error("Login response did not include an access token.");
      }

      setToken(nextToken);
      window.localStorage.setItem(STORAGE_KEY, nextToken);

      // Optionally accept user in login response.
      if (data && data.user) {
        setUser(data.user);
      } else {
        // If backend supports /auth/me, refresh user after login.
        try {
          const me = await apiRequest("/auth/me", { method: "GET" });
          setUser(me || null);
        } catch {
          // Backend may not implement /auth/me yet. Ignore.
          setUser(null);
        }
      }

      return { token: nextToken, user: data?.user || null };
    } catch (err) {
      setAuthError(normalizeAuthError(err));
      throw err;
    }
  };

  // PUBLIC_INTERFACE
  const logout = () => {
    /** Logs out locally by clearing token and user. */
    setToken("");
    setUser(null);
    setAuthError("");
    setIsRestoring(false);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  // PUBLIC_INTERFACE
  const setAuthToken = (newToken) => {
    /** Sets token directly (used for demo/temporary flows). */
    const value = String(newToken || "");
    setToken(value);
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Restore session on reload: if a token exists, try /auth/me.
  useEffect(() => {
    let cancelled = false;

    async function restore() {
      if (!token) {
        setIsRestoring(false);
        setUser(null);
        return;
      }

      setIsRestoring(true);
      setAuthError("");

      try {
        const me = await apiRequest("/auth/me", { method: "GET" });
        if (!cancelled) {
          setUser(me || null);
        }
      } catch (err) {
        // Token might be invalid/expired OR endpoint not implemented yet.
        // If it's a 401/403 we should clear the token; otherwise keep token but don't block app.
        if (!cancelled) {
          if (err?.status === 401 || err?.status === 403) {
            window.localStorage.removeItem(STORAGE_KEY);
            setToken("");
            setUser(null);
          } else {
            // Keep token; backend may not be ready. User stays null.
            setUser(null);
          }
        }
      } finally {
        if (!cancelled) setIsRestoring(false);
      }
    }

    restore();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(() => {
    return {
      token,
      user,
      isAuthenticated: Boolean(token),
      isRestoring,
      authError,
      login,
      logout,
      setAuthToken,
    };
  }, [token, user, isRestoring, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export { STORAGE_KEY as RD_TOKEN_STORAGE_KEY };
