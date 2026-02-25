import React from "react";
import { useParams } from "react-router-dom";

// PUBLIC_INTERFACE
export default function AdminResidentEditPage() {
  /** Placeholder admin edit resident page (protected). */
  const { id } = useParams();

  return (
    <>
      <h1 className="rd-page-title">Admin • Edit Resident</h1>
      <p className="rd-page-subtitle">
        Protected route placeholder. This will become a form to edit a resident.
      </p>

      <div className="rd-card">
        <div className="rd-kv">
          <label>Editing ID</label>
          <div>{id}</div>
        </div>
      </div>
    </>
  );
}
