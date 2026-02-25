/**
 * Simple API client using fetch.
 * Reads base URL from REACT_APP_API_BASE_URL (CRA convention).
 *
 * NOTE: Ensure REACT_APP_API_BASE_URL is set in the environment for the frontend container.
 * Example: REACT_APP_API_BASE_URL=https://your-backend-host
 */

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the configured API base URL (no trailing slash). */
  const raw = process.env.REACT_APP_API_BASE_URL || "";
  return raw.replace(/\/+$/, "");
}

function buildUrl(path) {
  const base = getApiBaseUrl();
  const normalizedPath = String(path || "").startsWith("/") ? path : `/${path}`;
  if (!base) return normalizedPath; // Allow relative calls for local proxy setups.
  return `${base}${normalizedPath}`;
}

// PUBLIC_INTERFACE
export async function apiRequest(path, options = {}) {
  /**
   * Makes an API request and returns parsed JSON when possible.
   * Automatically attaches Authorization header if a token is present in localStorage (rd_token).
   */
  const token = window.localStorage.getItem("rd_token") || "";
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(buildUrl(path), { ...options, headers });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const errorBody = isJson ? await res.json().catch(() => ({})) : await res.text().catch(() => "");
    const err = new Error(`API request failed: ${res.status} ${res.statusText}`);
    err.status = res.status;
    err.body = errorBody;
    throw err;
  }

  if (res.status === 204) return null;
  return isJson ? res.json() : res.text();
}
