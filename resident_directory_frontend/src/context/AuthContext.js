import React, { createContext, useContext, useMemo, useState } from "react";

/**
 * Very small auth placeholder.
 * - Stores a token in memory (optionally syncs to localStorage for refresh convenience)
 * - Exposes helpers that future work can wire into real login endpoints
 */

const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function AuthProvider({ children }) {
  /** Auth token (placeholder). Persisting in localStorage for simple demo navigation. */
  const [token, setToken] = useState(() => window.localStorage.getItem("rd_token") || "");

  // PUBLIC_INTERFACE
  const signIn = (newToken) => {
    /** Placeholder sign-in: caller provides a token string. */
    const value = String(newToken || "");
    setToken(value);
    window.localStorage.setItem("rd_token", value);
  };

  // PUBLIC_INTERFACE
  const signOut = () => {
    /** Placeholder sign-out: clears token. */
    setToken("");
    window.localStorage.removeItem("rd_token");
  };

  const value = useMemo(() => {
    return {
      token,
      isAuthenticated: Boolean(token),
      signIn,
      signOut,
    };
  }, [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth() {
  /** Hook to access authentication state. */
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
