import React, { useMemo, useState } from "react";
import { Play, Search, Sparkles } from "lucide-react";

const DISC_LIST = ["All", "Mechanics", "Optics", "Electromagnetism", "Thermodynamics", "Modern Physics"];
const CAP_LABELS = {
  all: "All Capabilities",
  metrology: "Precision Metrology",
  alignment: "Optical Alignment",
  nullfield: "Null & Field Control",
  transient: "Transient Tracking",
  inference: "Law Inversion",
};

export default function LabsCatalogSection({ data, onSelectLab }) {
  const [disc, setDisc] = useState("All");
  const [cap, setCap] = useState("all");
  const [onlyCore, setOnlyCore] = useState(false);
  const [onlyVideo, setOnlyVideo] = useState(false);
  const [q, setQ] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase();
    return data.labs.filter((l) => {
      if (disc !== "All" && l.discipline !== disc) return false;
      if (cap !== "all" && l.capability !== cap) return false;
      if (onlyCore && !l.inCore33) return false;
      if (onlyVideo && !l.video) return false;
      if (
        ql &&
        !l.title.toLowerCase().includes(ql) &&
        !l.goal.toLowerCase().includes(ql) &&
        !l.id.toLowerCase().includes(ql)
      ) {
        return false;
      }
      return true;
    });
  }, [data.labs, disc, cap, onlyCore, onlyVideo, q]);

  const displayed = showAll ? filtered : filtered.slice(0, 15);

  return (
    <section id="labs" className="section">
      <div className="container">
        <div
          className="grid-labs-hdr"
          style={{
            marginBottom: 28,
          }}
        >
          <div>
            <div className="eyebrow">LABORATORY SUITE &amp; TASK INDEX</div>
            <h2 className="section-title">
              Browse All {data.summary.taskCount} Verifiable Physics Labs
            </h2>
            <p className="section-sub">
              Every task packages a WebGL physics world, discrete/continuous instrument
              controls, per-seed randomized constants, and a quantitative tolerance verifier.
              Click any lab card to inspect its agent prompt, action schema, and pass scores.
            </p>
          </div>

          {/* PLE-Bench /tasks style Clean Discipline Quick-Count Summary Table */}
          <div className="card" style={{ padding: "14px 18px" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 8 }}>
              DISCIPLINE BREAKDOWN (CLICK TO FILTER)
            </div>
            {Object.entries(data.disciplineCounts).map(([dName, count]) => {
              const active = disc === dName;
              return (
                <button
                  key={dName}
                  type="button"
                  onClick={() => setDisc(active ? "All" : dName)}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "7px 8px",
                    border: "none",
                    borderBottom: "1px solid var(--line)",
                    background: active ? "var(--surface-2)" : "transparent",
                    color: active ? "var(--blue)" : "var(--ink)",
                    fontWeight: active ? 700 : 500,
                    fontSize: 14,
                    cursor: "pointer",
                  }}
                >
                  <span>{dName}</span>
                  <span className="mono num" style={{ color: "var(--ink-2)" }}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {DISC_LIST.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDisc(d)}
                className="btn"
                style={{
                  padding: "6px 14px",
                  fontSize: 13,
                  background: disc === d ? "var(--ink)" : "var(--surface)",
                  color: disc === d ? "var(--bg)" : "var(--ink)",
                  borderColor: disc === d ? "var(--ink)" : "var(--line-2)",
                }}
              >
                {d}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
            <select
              value={cap}
              onChange={(e) => setCap(e.target.value)}
              style={{
                padding: "7px 12px",
                borderRadius: 999,
                border: "1px solid var(--line-2)",
                background: "var(--surface)",
                color: "var(--ink)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {Object.entries(CAP_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setOnlyCore((v) => !v)}
              className="btn"
              style={{
                padding: "6px 13px",
                fontSize: 12.5,
                background: onlyCore ? "var(--std-soft)" : "var(--surface)",
                borderColor: onlyCore ? "var(--std)" : "var(--line-2)",
                color: onlyCore ? "var(--std-ink)" : "var(--ink)",
              }}
            >
              Core 33 Evaluated
            </button>

            <button
              type="button"
              onClick={() => setOnlyVideo((v) => !v)}
              className="btn"
              style={{
                padding: "6px 13px",
                fontSize: 12.5,
                background: onlyVideo ? "var(--priv-soft)" : "var(--surface)",
                borderColor: onlyVideo ? "var(--priv)" : "var(--line-2)",
                color: onlyVideo ? "var(--priv-ink)" : "var(--ink)",
              }}
            >
              <Play size={12} />
              <span>HD Studio Rigs</span>
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: "var(--surface)",
                border: "1px solid var(--line-2)",
                borderRadius: 999,
                padding: "6px 12px",
              }}
            >
              <Search size={13} color="var(--ink-3)" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Filter labs..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "var(--ink)",
                  width: 130,
                  fontSize: 13,
                }}
              />
            </div>
          </div>
        </div>

        {/* Cards Grid (EFE Suites style) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
            gap: 16,
          }}
        >
          {displayed.map((lab) => (
            <button
              key={lab.id}
              type="button"
              onClick={() => onSelectLab(lab)}
              className="card"
              style={{
                overflow: "hidden",
                textAlign: "left",
                cursor: "pointer",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.16s ease, border-color 0.16s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.borderColor = "var(--ink-2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "var(--line)";
              }}
            >
              <div style={{ position: "relative", height: 140, width: "100%", background: "#0b0e14" }}>
                <img
                  src={lab.thumb}
                  alt={lab.title}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
                {lab.inCore33 && (
                  <span
                    className="mono"
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(15, 23, 42, 0.85)",
                      color: "#fcd34d",
                      border: "1px solid rgba(252,211,77,0.45)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Sparkles size={10} /> CORE 33
                  </span>
                )}
                {lab.video && (
                  <span
                    className="mono"
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: "rgba(36, 145, 168, 0.90)",
                      color: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Play size={10} /> 3D VIDEO
                  </span>
                )}
              </div>

              <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>
                    {lab.title}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {lab.goal}
                  </div>
                </div>

                <div
                  className="mono"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 10.5,
                    color: "var(--ink-3)",
                    paddingTop: 6,
                    borderTop: "1px solid var(--line)",
                  }}
                >
                  <span>{lab.discipline}</span>
                  <span>{lab.configs} cfg</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length > 15 && (
          <div style={{ marginTop: 22, textAlign: "center" }}>
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="btn"
            >
              {showAll
                ? "Collapse catalog (show 15)"
                : `Show all ${filtered.length} matching labs`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
