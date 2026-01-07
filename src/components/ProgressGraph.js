import React from "react";

function ProgressGraph({ data }) {
  return (
    <div className="card slide-up">
      <h2>Your Progress</h2>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
        {data.map((item, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div
              style={{
                height: `${item.value * 2}px`,
                width: "40px",
                background: "var(--accent)",
                borderRadius: "8px",
                marginBottom: "0.5rem",
              }}
            />
            <p style={{ fontSize: "0.85rem" }}>{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressGraph;
