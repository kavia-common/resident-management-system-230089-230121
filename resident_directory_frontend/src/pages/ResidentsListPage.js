import React from "react";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function ResidentsListPage() {
  /** Placeholder residents list page. */
  return (
    <>
      <h1 className="rd-page-title">Residents</h1>
      <p className="rd-page-subtitle">
        Placeholder list. Next step will load residents from the backend API.
      </p>

      <div className="rd-card">
        <p style={{ marginTop: 0 }}>
          Try navigating to a resident detail route:
        </p>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          <li>
            <Link to="/residents/123">/residents/123</Link>
          </li>
          <li>
            <Link to="/residents/abc">/residents/abc</Link>
          </li>
        </ul>
      </div>
    </>
  );
}
