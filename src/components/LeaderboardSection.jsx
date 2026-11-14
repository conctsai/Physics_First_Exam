import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Medal } from "lucide-react";

const TABS = [
  { id: "cfg", label: "Config Pass (74 Setups)" },
  { id: "exp", label: "Experiment Pass (33 Tasks)" },
  { id: "heatmap", label: "33 × 8 Task Matrix" },
];

const DISC_ORDER = [
  "Mechanics",
  "Optics",
  "Electromagnetism",
  "Thermodynamics",
  "Modern Physics",
];

/**
 * Smoothly animates a numeric percentage readout whenever `target` or `active`
 * transitions (e.g., on scroll-in or tab switch).
 */
function AnimatedPct({ target, active, delay = 0 }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!active) {
      setVal(0);
      return;
    }
    let raf = 0;
    const duration = 680;
    const startAt = performance.now() + delay;

    const tick = (now) => {
      if (now < startAt) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const u = Math.min(1, (now - startAt) / duration);
      // Cubic ease-out matching bar width transition
      const eased = 1 - Math.pow(1 - u, 3);
      setVal(target * eased);
      if (u < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, delay]);

  return <>{val.toFixed(1)}%</>;
}

export default function LeaderboardSection({ data, onSelectLab }) {
  const sectionRef = useRef(null);
  const [tab, setTab] = useState("cfg");
  const [expandedPair, setExpandedPair] = useState(data.pairs[0]?.pairId || null);
  const [revealed, setRevealed] = useState(false);
  const [animCycle, setAnimCycle] = useState(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.16 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleTabChange = (nextTab) => {
    setTab(nextTab);
    if (nextTab === "cfg" || nextTab === "exp") {
      // Trigger staggered bar grow + count-up replay across tab switch
      setRevealed(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setRevealed(true);
          setAnimCycle((c) => c + 1);
        });
      });
    }
  };

  const labLookup = Object.fromEntries(data.labs.map((l) => [l.id, l]));

  const medalColor = (idx) =>
    idx === 0 ? "#eab308" : idx === 1 ? "#94a3b8" : idx === 2 ? "#d97706" : null;

  return (
    <section id="leaderboard" ref={sectionRef} className="section">
      <div className="container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <div className="eyebrow">LEADERBOARD</div>
            <h2 className="section-title">
              Frontier Model Performance ({data.summary.coreExperimentCount} Core
              Tasks · {data.summary.coreConfigCount} Setups)
            </h2>
            <p className="section-sub">
              Config pass:{" "}
              <strong style={{ color: "var(--priv-ink)" }}>
                {data.summary.overallCfgPassPct}% ({data.summary.passedRollouts}/
                {data.summary.scheduledRollouts})
              </strong>
              {" · "}Strict task pass:{" "}
              <strong style={{ color: "var(--std-ink)" }}>
                {data.summary.overallExpPassPct}% ({data.summary.successfulExpUnits}/
                {data.summary.totalExpUnits})
              </strong>
            </p>
          </div>

          <div
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              gap: 6,
              padding: 5,
              borderRadius: 999,
              background: "var(--surface-2)",
              border: "1px solid var(--line)",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleTabChange(t.id)}
                style={{
                  border: "none",
                  borderRadius: 999,
                  padding: "7px 14px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  background: tab === t.id ? "var(--surface)" : "transparent",
                  color: tab === t.id ? "var(--ink)" : "var(--ink-2)",
                  boxShadow: tab === t.id ? "0 1px 4px rgba(15,23,42,0.12)" : "none",
                  transition: "background-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Ranked Bars View */}
        {(tab === "exp" || tab === "cfg") && (
          <div className="card draft-corner" style={{ overflow: "hidden" }}>
            <div
              className="mono"
              style={{
                display: "grid",
                gridTemplateColumns: "54px minmax(258px, 1.45fr) 1.65fr 140px",
                gap: 14,
                padding: "13px 22px",
                fontSize: 11,
                fontWeight: 600,
                color: "var(--ink-3)",
                background: "var(--surface-2)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <span>RANK</span>
              <span>MODEL / HARNESS</span>
              <span>
                {tab === "exp"
                  ? "EXPERIMENT PASS (33 TASKS)"
                  : "CONFIG PASS (74 SETUPS)"}
              </span>
              <span style={{ textAlign: "right" }}>PASS RATE</span>
            </div>

            {data.pairs.map((p, idx) => {
              const isOpen = expandedPair === p.pairId;
              const pct = tab === "exp" ? p.expPct : p.cfgPct;
              const numTxt =
                tab === "exp"
                  ? `${p.successfulExperiments}/${p.totalExperiments}`
                  : `${p.passedConfigurations}/${p.totalConfigurations}`;
              const mc = medalColor(idx);
              const barWidth = revealed && pct > 0 ? `${Math.max(2.6, pct)}%` : "0%";

              return (
                <div
                  key={p.pairId}
                  style={{
                    borderBottom: "1px solid var(--line)",
                    animation: `pfeRevealUp 0.36s cubic-bezier(0.22, 1, 0.36, 1) ${idx * 35}ms both`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedPair(isOpen ? null : p.pairId)}
                    className="lb-row"
                    style={{
                      width: "100%",
                      display: "grid",
                      gridTemplateColumns: "54px minmax(258px, 1.45fr) 1.65fr 140px",
                      alignItems: "center",
                      gap: 14,
                      padding: "15px 22px",
                      border: "none",
                      background: isOpen ? "var(--surface-2)" : "transparent",
                      color: "var(--ink)",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <div
                      className="mono num"
                      style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700 }}
                    >
                      {mc ? <Medal size={16} color={mc} /> : <span>#{idx + 1}</span>}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "nowrap", minWidth: 0 }}>
                      {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      <span style={{ fontWeight: 700, fontSize: 15, whiteSpace: "nowrap" }}>{p.label}</span>
                      <span
                        className="mono"
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 6,
                          background: "var(--surface-2)",
                          border: "1px solid var(--line)",
                          color: "var(--ink-2)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.harness}
                      </span>
                    </div>

                    <div>
                      <div
                        style={{
                          height: 16,
                          borderRadius: 999,
                          background: "var(--surface-3)",
                          overflow: "hidden",
                          position: "relative",
                        }}
                      >
                        <div
                          className={pct > 0 ? "lb-bar-fill" : undefined}
                          style={{
                            width: barWidth,
                            height: "100%",
                            borderRadius: 999,
                            background: p.color,
                            transitionDelay: `${idx * 45}ms`,
                            boxShadow: idx === 0 && pct > 0 ? `0 0 12px ${p.color}55` : "none",
                          }}
                        />
                      </div>
                    </div>

                    <div className="num" style={{ textAlign: "right", fontWeight: 700, fontSize: 15 }}>
                      <AnimatedPct
                        key={`${p.pairId}-${tab}-${animCycle}`}
                        target={pct}
                        active={revealed}
                        delay={idx * 45}
                      />{" "}
                      <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", fontWeight: 500 }}>
                        ({numTxt})
                      </span>
                    </div>
                  </button>

                  {/* Expanded per-discipline subscores */}
                  {isOpen && (
                    <div
                      style={{
                        padding: "14px 22px 18px 88px",
                        background: "var(--surface-2)",
                        borderTop: "1px dashed var(--line)",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                        gap: 12,
                      }}
                    >
                      {DISC_ORDER.map((d, dIdx) => {
                        const ds = p.disciplines[d];
                        const dsPct = ds ? (tab === "exp" ? ds.expPct : ds.cfgPct) : 0;
                        const val = ds
                          ? tab === "exp"
                            ? `${ds.expPassed}/${ds.expTotal} (${ds.expPct}%)`
                            : `${ds.cfgPassed}/${ds.cfgTotal} (${ds.cfgPct}%)`
                          : "—";
                        return (
                          <div
                            key={d}
                            className="lb-disc-card"
                            style={{
                              background: "var(--surface)",
                              border: "1px solid var(--line)",
                              borderRadius: 10,
                              padding: "10px 12px",
                              animationDelay: `${dIdx * 45}ms`,
                            }}
                          >
                            <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)" }}>
                              {d}
                            </div>
                            <div className="num" style={{ fontWeight: 700, fontSize: 14, marginTop: 3 }}>
                              {val}
                            </div>
                            <div
                              style={{
                                marginTop: 8,
                                height: 4,
                                borderRadius: 999,
                                background: "var(--surface-3)",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${dsPct}%`,
                                  height: "100%",
                                  borderRadius: 999,
                                  background: p.color,
                                  transition: "width 0.55s cubic-bezier(0.22, 1, 0.36, 1)",
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 33x8 Heatmap Matrix View */}
        {tab === "heatmap" && (
          <div
            className="card"
            style={{
              overflowX: "auto",
              padding: 18,
              animation: "pfeRevealUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--line-2)" }}>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Core Task (33)</th>
                  <th style={{ textAlign: "left", padding: "8px 10px" }}>Discipline</th>
                  {data.pairs.map((p) => (
                    <th key={p.pairId} style={{ textAlign: "center", padding: "8px 6px", minWidth: 92 }}>
                      <div>{p.label.split(" ")[0]}</div>
                      <div className="mono" style={{ fontSize: 10, color: "var(--ink-3)", fontWeight: 500 }}>
                        {p.harness}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.matrix.map((row) => (
                  <tr
                    key={row.id}
                    className="lb-row"
                    onClick={() => labLookup[row.id] && onSelectLab(labLookup[row.id])}
                    style={{
                      borderBottom: "1px solid var(--line)",
                      cursor: "pointer",
                    }}
                  >
                    <td style={{ padding: "8px 10px", fontWeight: 600 }}>{row.title}</td>
                    <td className="mono" style={{ padding: "8px 10px", fontSize: 11, color: "var(--ink-3)" }}>
                      {row.discipline}
                    </td>
                    {data.pairs.map((p) => {
                      const c = row.cells[p.pairId];
                      if (!c) return <td key={p.pairId}>—</td>;
                      const bg =
                        c.status === "pass"
                          ? "rgba(5, 150, 105, 0.22)"
                          : c.status === "partial"
                          ? "rgba(217, 119, 6, 0.22)"
                          : c.status === "pending"
                          ? "rgba(100, 116, 139, 0.14)"
                          : "rgba(214, 96, 58, 0.16)";
                      const fg =
                        c.status === "pass"
                          ? "var(--emerald)"
                          : c.status === "partial"
                          ? "var(--amber)"
                          : c.status === "pending"
                          ? "var(--ink-3)"
                          : "var(--priv-ink)";
                      return (
                        <td key={p.pairId} style={{ padding: 4, textAlign: "center" }}>
                          <span
                            className="mono num hm-cell"
                            style={{
                              display: "inline-block",
                              minWidth: 52,
                              padding: "3px 6px",
                              borderRadius: 6,
                              background: bg,
                              color: fg,
                              fontWeight: 700,
                              fontSize: 11,
                            }}
                          >
                            {c.passedCfg}/{c.expectedCfg}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
