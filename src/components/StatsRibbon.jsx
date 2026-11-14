import React from "react";

export default function StatsRibbon({ summary }) {
  const items = [
    { val: summary.taskCount, label: "Verifiable 3D Labs", accent: "var(--ink)" },
    { val: summary.configCount, label: "Apparatus Configs", accent: "var(--priv-ink)" },
    { val: summary.disciplineCount, label: "Physics Disciplines", accent: "var(--blue)" },
    { val: 6, label: "Core Capabilities", accent: "var(--violet)" },
    { val: summary.scheduledRollouts, label: "Core Evaluations", accent: "var(--std-ink)" },
  ];

  return (
    <section
      style={{
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        background: "var(--surface)",
        padding: "30px 0",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))",
          gap: 18,
          textAlign: "center",
        }}
      >
        {items.map((it) => (
          <div key={it.label} style={{ padding: "8px 10px" }}>
            <div
              className="display num"
              style={{
                fontSize: "clamp(32px, 3.8vw, 46px)",
                fontWeight: 800,
                lineHeight: 1.02,
                color: it.accent,
              }}
            >
              {it.val}
            </div>
            <div
              className="mono"
              style={{
                marginTop: 6,
                fontSize: 11.5,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
              }}
            >
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
