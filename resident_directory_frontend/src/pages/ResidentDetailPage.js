import React from "react";
import { useParams } from "react-router-dom";

// PUBLIC_INTERFACE
export default function ResidentDetailPage() {
  /** Placeholder resident detail page. */
  const { id } = useParams();

  return (
    <>
      <h1 className="rd-page-title">Resident Details</h1>
      <p className="rd-page-subtitle">Route param captured from URL.</p>

      <div className="rd-card">
        <div className="rd-kv">
          <label>Resident ID</label>
          <div>{id}</div>
        </div>
      </div>
    </>
  );
}
