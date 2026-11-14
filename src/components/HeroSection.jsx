import React, { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Film,
  Search,
  X,
} from "lucide-react";

export default function HeroSection({ data, onOpenFilm, onSelectLab, theme }) {
  const [query, setQuery] = useState("");

  // Build 60-tile tilted -9deg backdrop from our real 79 labs
  const tiles = useMemo(() => {
    const out = [];
    for (let i = 0; i < 60; i++) {
      out.push(data.labs[i % data.labs.length]);
    }
    return out;
  }, [data.labs]);

  const searchHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return data.labs
      .filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.discipline.toLowerCase().includes(q) ||
          l.capability.toLowerCase().includes(q) ||
          l.id.toLowerCase().includes(q)
      )
      .slice(0, 7);
  }, [query, data.labs]);

  return (
    <section
      id="top"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
        padding: "76px 0 64px",
        borderBottom: "1px solid var(--line)",
      }}
    >
      {/* PLE-Bench Dark Mode Ambient Aurora Glow */}
      {theme === "dark" && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "24%",
            top: "10%",
            width: 780,
            height: 460,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 25% 35%, rgba(234,67,53,0.16), transparent 55%), radial-gradient(circle at 55% 65%, rgba(56,189,248,0.18), transparent 55%), radial-gradient(circle at 75% 30%, rgba(251,188,4,0.14), transparent 50%)",
            filter: "blur(56px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />
      )}

      {/* EFE Tilted -9deg 79-Lab Background Wall with feathered gradient mask */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "-140px -80px",
          zIndex: 0,
          pointerEvents: "none",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 78% at 68% 48%, rgba(0,0,0,0.88) 18%, rgba(0,0,0,0.38) 54%, rgba(0,0,0,0.06) 86%)",
          maskImage:
            "radial-gradient(ellipse 80% 78% at 68% 48%, rgba(0,0,0,0.88) 18%, rgba(0,0,0,0.38) 54%, rgba(0,0,0,0.06) 86%)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, clamp(150px, 12.2vw, 215px))",
            gap: 12,
            transform: "rotate(-9deg) translate(16%, -4%)",
            transformOrigin: "50% 50%",
            opacity: theme === "dark" ? 0.44 : 0.74,
          }}
        >
          {tiles.map((lab, idx) => (
            <div
              key={`${lab.id}-${idx}`}
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid var(--line)",
                background: "var(--surface)",
                aspectRatio: "16 / 10",
                position: "relative",
                boxShadow: "0 4px 16px rgba(15,23,42,0.08)",
              }}
            >
              <img
                src={lab.thumb}
                alt=""
                loading="lazy"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <span
                className="mono"
                style={{
                  position: "absolute",
                  left: 6,
                  bottom: 6,
                  fontSize: 9.5,
                  fontWeight: 600,
                  padding: "2px 6px",
                  borderRadius: 5,
                  background: "rgba(10, 14, 22, 0.78)",
                  color: idx % 5 === 1 ? "#fcd34d" : "#e2e8f0",
                  border:
                    idx % 5 === 1
                      ? "1px solid rgba(252, 211, 77, 0.45)"
                      : "1px solid rgba(255,255,255,0.14)",
                }}
              >
                {lab.title.split(" ").slice(0, 2).join(" ")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Left readability wash so headline typography is razor-sharp */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          background:
            theme === "dark"
              ? "linear-gradient(95deg, rgba(11,14,20,0.96) 24%, rgba(11,14,20,0.80) 54%, rgba(11,14,20,0.20) 92%)"
              : "linear-gradient(95deg, rgba(244,246,249,0.97) 25%, rgba(244,246,249,0.82) 55%, rgba(244,246,249,0.22) 92%)",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2 }}>
        <div style={{ maxWidth: 690 }}>
          <p
            className="display"
            style={{
              fontSize: 20,
              fontStyle: "italic",
              fontWeight: 500,
              color: "var(--priv-ink)",
              marginBottom: 14,
              lineHeight: 1.4,
            }}
          >
            Before discovering new physical laws, can AI complete classic physics experiments?
          </p>

          <h1
            className="display"
            style={{
              fontSize: "clamp(48px, 6.4vw, 82px)",
              fontWeight: 700,
              lineHeight: 0.98,
              color: "var(--ink)",
              marginBottom: 20,
            }}
          >
            Physics First Exam
          </h1>

          <p
            style={{
              fontSize: 18.5,
              color: "var(--ink-2)",
              marginBottom: 28,
              maxWidth: 610,
            }}
          >
            {data.summary.taskCount} verifiable 3D WebGL laboratories across{" "}
            {data.summary.configCount} apparatus configurations — pixel-only vision
            control and randomized physical laws.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 10,
              marginBottom: 22,
            }}
          >
            <a href="#leaderboard" className="btn btn-primary">
              <span>See the leaderboard</span>
              <ArrowRight size={15} />
            </a>

            <button
              type="button"
              onClick={onOpenFilm}
              className="btn"
              style={{
                background: "var(--priv-soft)",
                borderColor: "var(--priv)",
                color: "var(--priv-ink)",
              }}
            >
              <Film size={15} />
              <span>Watch Video</span>
            </button>

            <a href="#labs" className="btn">
              <span>Browse {data.summary.taskCount} labs</span>
            </a>
          </div>

          {/* EFE Live Fuzzy Task Search Bar */}
          <div style={{ position: "relative", maxWidth: 460 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "var(--surface)",
                border: "1px solid var(--line-2)",
                borderRadius: 999,
                padding: "10px 16px",
                boxShadow: "0 4px 18px rgba(15, 23, 42, 0.07)",
              }}
            >
              <Search size={16} color="var(--ink-3)" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search ${data.summary.taskCount} labs (e.g. interferometer, franck, oscilloscope)...`}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  color: "var(--ink)",
                  width: "100%",
                  fontSize: 14,
                }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: "var(--ink-3)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {searchHits.length > 0 && (
              <div
                className="card"
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  left: 0,
                  right: 0,
                  zIndex: 30,
                  padding: 8,
                }}
              >
                {searchHits.map((lab) => (
                  <button
                    key={lab.id}
                    type="button"
                    onClick={() => {
                      onSelectLab(lab);
                      setQuery("");
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      color: "var(--ink)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "var(--surface-2)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <img
                      src={lab.thumb}
                      alt=""
                      style={{
                        width: 48,
                        height: 30,
                        borderRadius: 5,
                        objectFit: "cover",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>
                        {lab.title}
                      </div>
                      <div
                        className="mono"
                        style={{ fontSize: 11, color: "var(--ink-3)" }}
                      >
                        {lab.discipline} · {lab.configs} configs · {lab.capability}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll jump pill at bottom (PLE + EFE signature) */}
      <a
        href="#showcase"
        className="btn"
        aria-label="Scroll to interactive showcase"
        style={{
          position: "absolute",
          left: "50%",
          bottom: 20,
          transform: "translateX(-50%)",
          zIndex: 3,
          padding: "7px 16px",
          fontSize: 12.5,
          background: "var(--nav-bg)",
          backdropFilter: "blur(8px)",
        }}
      >
        <span>Explore Benchmark</span>
        <ArrowDown size={14} />
      </a>
    </section>
  );
}
