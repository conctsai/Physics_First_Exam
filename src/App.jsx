import React, { useEffect, useMemo, useState } from "react";
import { Play, X } from "lucide-react";
import benchmarkData from "./data/benchmark.json";
import Navbar from "./components/Navbar.jsx";
import HeroSection from "./components/HeroSection.jsx";
import OverviewVideoSection from "./components/OverviewVideoSection.jsx";
import InteractiveShowcase from "./components/InteractiveShowcase.jsx";
import StatsRibbon from "./components/StatsRibbon.jsx";
import LeaderboardSection from "./components/LeaderboardSection.jsx";
import TaskGlobe3D from "./components/TaskGlobe3D.jsx";
import LabsCatalogSection from "./components/LabsCatalogSection.jsx";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [activeSection, setActiveSection] = useState("showcase");
  const [selectedLab, setSelectedLab] = useState(null);
  const [showFilmModal, setShowFilmModal] = useState(false);

  const matrixById = useMemo(
    () => Object.fromEntries(benchmarkData.matrix.map((m) => [m.id, m])),
    []
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const ids = ["showcase", "leaderboard", "globe", "labs"];
    const onScroll = () => {
      const y = window.scrollY + 180;
      let curr = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) curr = id;
      }
      setActiveSection(curr);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <Navbar
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        activeSection={activeSection}
        onOpenFilm={() => setShowFilmModal(true)}
      />

      <main style={{ paddingBottom: 32 }}>
        <HeroSection
          data={benchmarkData}
          theme={theme}
          onOpenFilm={() => setShowFilmModal(true)}
          onSelectLab={setSelectedLab}
        />

        <OverviewVideoSection
          onOpenFilm={() => setShowFilmModal(true)}
          modalOpen={showFilmModal}
        />

        <InteractiveShowcase />

        <StatsRibbon summary={benchmarkData.summary} />

        <LeaderboardSection data={benchmarkData} onSelectLab={setSelectedLab} />

        <TaskGlobe3D data={benchmarkData} onSelectLab={setSelectedLab} />

        <LabsCatalogSection data={benchmarkData} onSelectLab={setSelectedLab} />
      </main>

      {/* Full Overview Film Modal (3m 39s v5 Video with Audio Controls) */}
      {showFilmModal && (
        <div
          className="modal-backdrop"
          onClick={() => setShowFilmModal(false)}
        >
          <div
            className="modal-panel"
            style={{ maxWidth: 960, padding: 18, background: "#090c12", color: "#f8fafc" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div>
                <div className="mono" style={{ fontSize: 11, color: "#38bdf8" }}>
                  PHYSICS FIRST EXAM
                </div>
                <h3 className="display" style={{ fontSize: 21, fontWeight: 700 }}>
                  Overview Video
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowFilmModal(false)}
                className="btn"
                style={{
                  width: 34,
                  height: 34,
                  padding: 0,
                  justifyContent: "center",
                  background: "rgba(255,255,255,0.08)",
                  color: "#f8fafc",
                }}
              >
                <X size={16} />
              </button>
            </div>
            <video
              src="videos/overview-demo.mp4"
              controls
              autoPlay
              playsInline
              style={{
                width: "100%",
                borderRadius: 10,
                background: "#000000",
                display: "block",
              }}
            />
          </div>
        </div>
      )}

      {/* Lab Detail Inspector Modal */}
      {selectedLab && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedLab(null)}
        >
          <div
            className="modal-panel"
            style={{ padding: 24, maxWidth: 740 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <div>
                <div className="mono" style={{ fontSize: 11, color: "var(--std-ink)" }}>
                  {selectedLab.discipline.toUpperCase()} · {selectedLab.capability.toUpperCase()} ·{" "}
                  {selectedLab.configs} CONFIGS
                </div>
                <h3 className="display" style={{ fontSize: 25, fontWeight: 700, marginTop: 2 }}>
                  {selectedLab.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLab(null)}
                className="btn"
                style={{ width: 34, height: 34, padding: 0, justifyContent: "center" }}
              >
                <X size={16} />
              </button>
            </div>

            {selectedLab.video ? (
              <video
                key={selectedLab.video}
                src={selectedLab.video}
                controls
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginBottom: 16,
                  maxHeight: 360,
                  objectFit: "cover",
                  background: "#05070b",
                }}
              />
            ) : (
              <img
                src={selectedLab.thumb}
                alt={selectedLab.title}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  marginBottom: 16,
                  maxHeight: 340,
                  objectFit: "cover",
                }}
              />
            )}

            <div style={{ display: "grid", gap: 14 }}>
              <div>
                <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 4 }}>
                  AGENT MEASUREMENT OBJECTIVE
                </div>
                <p style={{ fontSize: 14.5, color: "var(--ink)" }}>{selectedLab.goal}</p>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    background: "var(--surface-2)",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>
                    AVAILABLE ACTIONS ({selectedLab.actions.length})
                  </div>
                  <div className="mono" style={{ fontSize: 12, marginTop: 4, color: "var(--ink)" }}>
                    {selectedLab.actions.join(" · ")}
                  </div>
                </div>
                <div
                  style={{
                    background: "var(--surface-2)",
                    borderRadius: 10,
                    padding: "10px 12px",
                  }}
                >
                  <div className="mono" style={{ fontSize: 10.5, color: "var(--ink-3)" }}>
                    ANSWER SUBMISSION SCHEMA
                  </div>
                  <div className="mono" style={{ fontSize: 12, marginTop: 4, color: "var(--priv-ink)" }}>
                    {selectedLab.answerSignature}
                  </div>
                </div>
              </div>

              {matrixById[selectedLab.id] && (
                <div>
                  <div className="mono" style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 6 }}>
                    CORE SUITE EVALUATION RESULTS
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                      gap: 8,
                    }}
                  >
                    {benchmarkData.pairs.map((p) => {
                      const c = matrixById[selectedLab.id].cells[p.pairId];
                      if (!c) return null;
                      return (
                        <div
                          key={p.pairId}
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: 8,
                            padding: "7px 10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            fontSize: 12,
                          }}
                        >
                          <span style={{ fontWeight: 600 }}>
                            {p.label.split(" ")[0]}{" "}
                            <span style={{ color: "var(--ink-3)", fontWeight: 400 }}>
                              ({p.harness === "claude-code" ? "cc" : "codex"})
                            </span>
                          </span>
                          <span
                            className="mono num"
                            style={{
                              fontWeight: 700,
                              color:
                                c.status === "pass"
                                  ? "var(--emerald)"
                                  : c.status === "partial"
                                  ? "var(--amber)"
                                  : "var(--priv-ink)",
                            }}
                          >
                            {c.passedCfg}/{c.expectedCfg}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedLab.video && (
                <div className="mono" style={{ fontSize: 11.5, color: "var(--std-ink)", display: "flex", alignItems: "center", gap: 6 }}>
                  <Play size={12} /> 3D apparatus walkthrough
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
