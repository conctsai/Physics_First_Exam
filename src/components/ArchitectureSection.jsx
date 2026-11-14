import React, { useState } from "react";
import { Cpu, Eye, ShieldCheck, Sliders } from "lucide-react";

const STAGES = [
  {
    id: "harness",
    title: "1. Model & Native Harness",
    badge: "ANY MODEL · ANY HARNESS",
    color: "#38bdf8",
    summary:
      "Frontier models run inside unmodified native coding harnesses (Codex 0.154, Claude Code 2.1, Antigravity) inside a Seatbelt sandbox forwarding only observe() and act().",
    payload: `// Exposed MCP Tool Interface (strictly 2 functions)
tools: [
  "mcp__ulab__observe()",
  "mcp__ulab__act({ action, ...params })"
]`,
  },
  {
    id: "perceive",
    title: "2. Pixel-Only Perception",
    badge: "1280×720 RGBA ONLY",
    color: "#f5b841",
    summary:
      "No scene graph, no DOM inspector, no oracle constants. The agent must visually align verniers, read phosphor peaks, count diffraction fringes, and track transient dials.",
    payload: `// mcp__ulab__observe() response
{
  "image": "data:image/png;base64,...",
  "resolution": [1280, 720],
  "privilegedStateExposed": false
}`,
  },
  {
    id: "sandbox",
    title: "3. Randomized Law Sandbox",
    badge: "SEED-RANDOMIZED CONSTANTS",
    color: "#34d399",
    summary:
      "Every rollout samples fresh physical truths (g*, e*, n*, c*, unknown mass, lattice d) on the author side so memorized textbook values fail immediately.",
    payload: `// Server-side private truth (never sent to agent)
{
  "seed": 42,
  "effectiveConstant": { "g_star": 9.618, "m_unknown": 0.347 },
  "simEngine": "Quasistatic / RK4 WebGL 3D"
}`,
  },
  {
    id: "verify",
    title: "4. First-Principles Grading",
    badge: "MULTI-CONFIG TOLERANCE",
    color: "#a78bfa",
    summary:
      "An experiment passes (score = 1) ONLY when the submitted measurement matches server ground truth within physics-derived tolerance across ALL paired apparatus configurations.",
    payload: `// Final submission & deterministic verification
act({ "action": "answer", "m": 0.346 })
=> relativeError = |0.346 - 0.347| / 0.347 = 0.29% <= 2.5%
=> PASS (all paired apparatus configs confirmed)`,
  },
];

export default function ArchitectureSection() {
  const [stageIdx, setStageIdx] = useState(2);
  const current = STAGES[stageIdx];

  return (
    <section id="architecture" className="section">
      <div className="container">
        <div style={{ marginBottom: 24 }}>
          <div className="eyebrow">UNIFIED EVALUATION ARCHITECTURE</div>
          <h2 className="section-title">
            How Verification Works — Zero Truth Leaks, Pure Measurement
          </h2>
          <p className="section-sub">
            Click any stage in the evaluation pipeline to inspect how vision-only agents
            interact with randomized 3D physics worlds without privileged simulator state.
          </p>
        </div>

        {/* EFE-inspired Connected Architecture Pipeline */}
        <div
          className="card draft-corner"
          style={{
            padding: 24,
            background: "#0b1019",
            color: "#f8fafc",
            borderColor: "rgba(255,255,255,0.14)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 14,
              marginBottom: 14,
            }}
          >
            {STAGES.map((st, idx) => {
              const active = idx === stageIdx;
              const Icon =
                idx === 0 ? Cpu : idx === 1 ? Eye : idx === 2 ? Sliders : ShieldCheck;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setStageIdx(idx)}
                  style={{
                    textAlign: "left",
                    padding: "16px 16px",
                    borderRadius: 14,
                    cursor: "pointer",
                    background: active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.03)",
                    border: active
                      ? `1.5px solid ${st.color}`
                      : "1px solid rgba(255,255,255,0.10)",
                    color: "#f8fafc",
                    transition: "all 0.18s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <Icon size={18} color={st.color} />
                    <span
                      className="mono"
                      style={{ fontSize: 10, color: st.color, letterSpacing: "0.08em" }}
                    >
                      {st.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: 15.5, fontWeight: 700 }}>{st.title}</div>
                  <div style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 6, lineHeight: 1.45 }}>
                    {st.summary}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Live Flowing Photon Bus SVG between Stages */}
          <svg viewBox="0 0 1000 34" style={{ width: "100%", height: 34, display: "block", marginBottom: 12 }}>
            <defs>
              <linearGradient id="archWire" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="35%" stopColor="#f5b841" />
                <stop offset="70%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            <path
              id="busPath"
              d="M 110 17 C 210 17, 290 17, 370 17 C 460 17, 540 17, 630 17 C 720 17, 810 17, 890 17"
              fill="none"
              stroke="url(#archWire)"
              strokeOpacity="0.48"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {[110, 370, 630, 890].map((cx, i) => (
              <circle
                key={cx}
                cx={cx}
                cy="17"
                r={stageIdx === i ? 6 : 4}
                fill={STAGES[i].color}
                stroke="#0b1019"
                strokeWidth="2"
              />
            ))}
            {[0, 0.33, 0.66].map((offset, k) => (
              <g key={k}>
                <circle r="7" fill={current.color} fillOpacity="0.35">
                  <animateMotion dur="3.6s" begin={`${offset * 3.6}s`} repeatCount="indefinite">
                    <mpath href="#busPath" />
                  </animateMotion>
                </circle>
                <circle r="2.6" fill="#ffffff">
                  <animateMotion dur="3.6s" begin={`${offset * 3.6}s`} repeatCount="indefinite">
                    <mpath href="#busPath" />
                  </animateMotion>
                </circle>
              </g>
            ))}
          </svg>

          {/* Animated Photon Conduit Bar + Live Protocol Inspector */}
          <div
            style={{
              position: "relative",
              background: "#06090f",
              borderRadius: 12,
              border: `1px solid ${current.color}55`,
              padding: "16px 18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span className="mono" style={{ fontSize: 11.5, color: current.color }}>
                ACTIVE PIPELINE NODE · {current.title.toUpperCase()}
              </span>
              <span className="mono" style={{ fontSize: 11, color: "#64748b" }}>
                macOS Seatbelt · Zero Author Source Exposure
              </span>
            </div>
            <pre
              className="mono"
              style={{
                fontSize: 12.5,
                lineHeight: 1.55,
                color: "#cbd5e1",
                overflowX: "auto",
              }}
            >
              {current.payload}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
