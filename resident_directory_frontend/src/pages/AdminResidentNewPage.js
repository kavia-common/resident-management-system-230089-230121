import React from "react";

// PUBLIC_INTERFACE
export default function AdminResidentNewPage() {
  /** Placeholder admin new resident page (protected). */
  return (
    <>
      <h1 className="rd-page-title">Admin • New Resident</h1>
      <p className="rd-page-subtitle">
        Protected route placeholder. This will become a form to create a resident.
      </p>

      <div className="rd-card">
        <p style={{ margin: 0 }}>
          You are seeing this because you are authenticated (demo).
        </p>
      </div>
    </>
  );
}
