import React, { useMemo, useState } from "react";
import { Film, Play, Sliders } from "lucide-react";

function Tex({ tex, display = false, style = {} }) {
  const html = useMemo(() => {
    if (typeof window !== "undefined" && window.katex) {
      return window.katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    }
    return null;
  }, [tex, display]);

  if (!html) {
    return (
      <span className="mono" style={style}>
        {tex}
      </span>
    );
  }
  return (
    <span
      className="katex-inline"
      style={{ lineHeight: 1.2, ...style }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const SCENES = [
  {
    id: "mechanics",
    discipline: "Mechanics",
    count: 20,
    accent: "#f5b841",
    clip: "videos/shot_cart_collision.mp4",
    poster: "thumbs/cart-collision.jpg",
    altClip: "videos/shot_string.mp4",
    altPoster: "thumbs/string.jpg",
    altLabel: "Standing-Wave String",
    title: "Elastic Collision & Photogate Metrology",
    altTitle: "Driven Standing-Wave Resonance",
    description:
      "Measure incident and rebound glider velocities via dual optical timers (20 mm flag gating) and invert unknown mass or restitution under randomized inertia.",
    lawTitle: "Elastic Collision Law",
    lawTex: "v_1' = \\frac{1 - r}{1 + r} v_0, \\quad r = \\frac{m_2}{m_1}",
    sliderTitle: "Mass Ratio",
    sliderTex: "m_2 / m_1",
    min: 0.4,
    max: 3.0,
    step: 0.05,
    defaultVal: 1.5,
    unit: "\\times",
  },
  {
    id: "optics",
    discipline: "Optics",
    count: 21,
    accent: "#38bdf8",
    clip: "videos/shot_michelson.mp4",
    poster: "thumbs/michelson.jpg",
    altClip: "videos/shot_prism_index.mp4",
    altPoster: "thumbs/prism-index.jpg",
    altLabel: "Prism Spectrometer",
    title: "Coherent Michelson Interferometry",
    altTitle: "Minimum-Deviation Snell Dispersion",
    description:
      "Drive the fine micrometer screw through N = 50–100 constructive/destructive fringes to recover laser wavelength to sub-nanometer precision.",
    lawTitle: "Optical Path Difference",
    lawTex: "\\Delta d = \\frac{N \\lambda}{2}",
    sliderTitle: "Micrometer Travel",
    sliderTex: "\\Delta d\\;(\\lambda = 590\\,\\text{nm})",
    min: 0.0,
    max: 1.4,
    step: 0.02,
    defaultVal: 0.64,
    unit: "\\mu\\text{m}",
  },
  {
    id: "em",
    discipline: "Electromagnetism",
    count: 20,
    accent: "#34d399",
    clip: "videos/shot_oscilloscope.mp4",
    poster: "thumbs/oscilloscope.jpg",
    altClip: "videos/shot_microwave_bragg.mp4",
    altPoster: "thumbs/microwave-bragg.jpg",
    altLabel: "Microwave Bragg Lattice",
    title: "Analog Dual-Trace CRT & Lissajous Lock",
    altTitle: "Rotating Crystal Microwave Diffraction",
    description:
      "Operate CH1/CH2 vertical gains, trigger slope, and reference oscillator dial to count stationary Lissajous tangencies and lock an unknown frequency.",
    lawTitle: "Parametric Phase Lock",
    lawTex: "x = \\sin(n\\omega t + \\varphi), \\quad y = \\sin(m\\omega t)",
    sliderTitle: "Phase Shift",
    sliderTex: "\\varphi\\;(3:2\\,\\text{ratio})",
    min: 0.0,
    max: 3.14,
    step: 0.05,
    defaultVal: 0.75,
    unit: "\\text{rad}",
  },
  {
    id: "thermo",
    discipline: "Thermodynamics",
    count: 9,
    accent: "#fb7185",
    clip: "videos/shot_gas_adiabatic.mp4",
    poster: "thumbs/gas-adiabatic.jpg",
    altClip: "videos/shot_heat_engine.mp4",
    altPoster: "thumbs/heat-engine-pv.jpg",
    altLabel: "Heat Engine P–V Loop",
    title: "Adiabatic Venting & Recovery Ratio",
    altTitle: "Isothermal & Isochoric Stirling Cycle",
    description:
      "Pressurize the gas vessel above ambient, vent briefly until pressure equalizes, reseal, and measure thermally recovered equilibrium pressure to extract the adiabatic index.",
    lawTitle: "Clément–Desormes",
    lawTex: "\\gamma = \\frac{C_p}{C_v} = \\frac{\\ln(P_1 / P_0)}{\\ln(P_1 / P_3)}",
    sliderTitle: "Heat Capacity Ratio",
    sliderTex: "\\gamma = C_p / C_v",
    min: 1.25,
    max: 1.67,
    step: 0.01,
    defaultVal: 1.4,
    unit: "",
  },
  {
    id: "modern",
    discipline: "Modern Physics",
    count: 9,
    accent: "#a78bfa",
    clip: "videos/shot_electron.mp4",
    poster: "thumbs/electron-diffraction.jpg",
    altClip: "videos/shot_franckhertz.mp4",
    altPoster: "thumbs/franckhertz.jpg",
    altLabel: "Franck–Hertz Plasma Strata",
    title: "Electron de Broglie Bragg Diffraction",
    altTitle: "Quantized Atomic Energy Peaks",
    description:
      "Sweep anode accelerating voltage across polycrystalline graphite and caliper-measure inner and outer Debye–Scherrer rings to solve the electron de Broglie wavelength.",
    lawTitle: "de Broglie Diffraction",
    lawTex: "\\lambda = \\frac{h}{\\sqrt{2 m_e U_a}}, \\quad r \\propto \\frac{\\lambda}{d}",
    sliderTitle: "Anode Voltage",
    sliderTex: "U_a",
    min: 2.0,
    max: 6.0,
    step: 0.1,
    defaultVal: 4.0,
    unit: "\\text{kV}",
  },
];

function PhysicsLawDiagram({ scene, param }) {
  const accent = scene.accent;

  if (scene.id === "mechanics") {
    const r = param;
    const v1 = 1.0;
    const v1p = ((1 - r) / (1 + r)) * v1;
    const v2p = (2 / (1 + r)) * v1;
    const w2 = Math.min(54, 24 + r * 11);
    return (
      <div style={{ display: "grid", gridTemplateColumns: "142px 1fr", gap: 14, alignItems: "center" }}>
        <svg viewBox="0 0 185 138" style={{ width: "100%", height: 126 }}>
          <defs>
            <marker id="arrC" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
            </marker>
            <marker id="arrA" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={accent} />
            </marker>
          </defs>
          <line x1="10" y1="96" x2="175" y2="96" stroke="rgba(255,255,255,0.22)" strokeWidth="2" />
          <rect x="26" y="68" width="36" height="26" rx="4" fill="#38bdf8" fillOpacity="0.28" stroke="#38bdf8" strokeWidth="1.5" />
          <text x="44" y="85" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="IBM Plex Mono">m1</text>
          <rect x="98" y="62" width={w2} height="32" rx="4" fill={accent} fillOpacity="0.28" stroke={accent} strokeWidth="1.5" />
          <text x={98 + w2 / 2} y="82" textAnchor="middle" fill="#fef3c7" fontSize="11" fontFamily="IBM Plex Mono">m2</text>
          <line x1="44" y1="52" x2={44 + v1p * 42} y2="52" stroke="#38bdf8" strokeWidth="2.4" markerEnd="url(#arrC)" />
          <line x1={98 + w2 / 2} y1="44" x2={98 + w2 / 2 + v2p * 34} y2="44" stroke={accent} strokeWidth="2.4" markerEnd="url(#arrA)" />
          <text x="12" y="20" fill="#94a3b8" fontSize="9.5" fontFamily="IBM Plex Mono">AIR TRACK (v0 = 1.00 m/s)</text>
        </svg>

        <div style={{ display: "grid", gap: 6, fontSize: 13, minWidth: 0 }}>
          <div style={{ color: "#94a3b8", fontSize: 11.5 }}>Post-Collision Velocities:</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#7dd3fc", whiteSpace: "nowrap" }}>
            <Tex tex={`v_1' = ${v1p >= 0 ? "+" : ""}${v1p.toFixed(3)}\\;\\text{m/s}`} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: accent, whiteSpace: "nowrap" }}>
            <Tex tex={`v_2' = +${v2p.toFixed(3)}\\;\\text{m/s}`} />
          </div>
          <div style={{ color: "#cbd5e1", fontSize: 12, paddingTop: 2, whiteSpace: "nowrap" }}>
            <Tex tex="p_i = p_f,\quad E_k = \text{const}" />
          </div>
        </div>
      </div>
    );
  }

  if (scene.id === "optics") {
    const fringes = (2 * param * 1000) / 590;
    const phase = (fringes % 1) * Math.PI * 2;
    const rings = [14, 24, 34, 44];
    const centerBright = 0.5 + 0.5 * Math.cos(phase);
    return (
      <div style={{ display: "grid", gridTemplateColumns: "136px 1fr", gap: 14, alignItems: "center" }}>
        <svg viewBox="0 0 152 138" style={{ width: "100%", height: 126 }}>
          <circle cx="76" cy="69" r="54" fill="#070a10" stroke="rgba(255,255,255,0.18)" />
          <circle cx="76" cy="69" r="9" fill={accent} fillOpacity={0.25 + 0.7 * centerBright} />
          {rings.map((rr, i) => (
            <circle
              key={rr}
              cx="76"
              cy="69"
              r={rr}
              fill="none"
              stroke={accent}
              strokeWidth="3"
              strokeOpacity={0.25 + 0.65 * Math.abs(Math.cos(phase * 0.5 + i * 0.8))}
            />
          ))}
        </svg>

        <div style={{ display: "grid", gap: 6, fontSize: 13, minWidth: 0 }}>
          <div style={{ color: "#94a3b8", fontSize: 11.5 }}>Fringes Passed:</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap" }}>
            <Tex tex={`N = ${fringes.toFixed(2)}`} />
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11.5 }}>Center Intensity:</div>
          <div style={{ fontSize: 13.5, color: accent, whiteSpace: "nowrap" }}>
            <Tex tex={`I/I_0 = ${(centerBright * 100).toFixed(0)}\\%`} />
          </div>
        </div>
      </div>
    );
  }

  if (scene.id === "em") {
    const pts = [];
    for (let i = 0; i <= 180; i++) {
      const a = (i / 180) * Math.PI * 2;
      const x = 76 + Math.sin(3 * a + param) * 54;
      const y = 69 + Math.sin(2 * a) * 46;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return (
      <div style={{ display: "grid", gridTemplateColumns: "136px 1fr", gap: 14, alignItems: "center" }}>
        <svg viewBox="0 0 152 138" style={{ width: "100%", height: 126 }}>
          <rect x="8" y="8" width="136" height="122" rx="10" fill="#051610" stroke="rgba(52,211,153,0.35)" />
          <polyline fill="none" stroke="#34d399" strokeWidth="2.4" points={pts.join(" ")} />
        </svg>

        <div style={{ display: "grid", gap: 6, fontSize: 13, minWidth: 0 }}>
          <div style={{ color: "#94a3b8", fontSize: 11.5 }}>Harmonic Lock Ratio:</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap" }}>
            <Tex tex="f_x : f_y = 3 : 2" />
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11.5 }}>Phase Offset:</div>
          <div style={{ fontSize: 13, color: accent, whiteSpace: "nowrap" }}>
            <Tex tex={`\\varphi = ${((param * 180) / Math.PI).toFixed(0)}^\\circ\\;(${param.toFixed(2)}\\,\\text{rad})`} />
          </div>
        </div>
      </div>
    );
  }

  if (scene.id === "thermo") {
    const pts = [];
    for (let i = 0; i <= 40; i++) {
      const v = 0.5 + (i / 40) * 1.1;
      const p = 1.0 * Math.pow(0.5 / v, param);
      const sx = 28 + ((v - 0.5) / 1.1) * 124;
      const sy = 118 - p * 92;
      pts.push(`${sx.toFixed(1)},${sy.toFixed(1)}`);
    }
    const gasType =
      param >= 1.6 ? "Monatomic (~1.67)" : param >= 1.37 ? "Diatomic Air (~1.40)" : "Polyatomic (~1.30)";
    return (
      <div style={{ display: "grid", gridTemplateColumns: "136px 1fr", gap: 14, alignItems: "center" }}>
        <svg viewBox="0 0 168 138" style={{ width: "100%", height: 126 }}>
          <line x1="28" y1="16" x2="28" y2="118" stroke="rgba(255,255,255,0.24)" />
          <line x1="28" y1="118" x2="156" y2="118" stroke="rgba(255,255,255,0.24)" />
          <text x="15" y="24" fill="#94a3b8" fontSize="10" fontFamily="IBM Plex Mono">P</text>
          <text x="148" y="132" fill="#94a3b8" fontSize="10" fontFamily="IBM Plex Mono">V</text>
          <polyline fill="none" stroke={accent} strokeWidth="2.8" points={pts.join(" ")} />
        </svg>

        <div style={{ display: "grid", gap: 5, fontSize: 13, minWidth: 0 }}>
          <div style={{ color: "#cbd5e1", fontSize: 12.5, whiteSpace: "nowrap" }}>
            <Tex tex="P V^{\gamma} = \text{const}" />
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap" }}>
            <Tex tex={`\\gamma = ${param.toFixed(2)}`} />
          </div>
          <div style={{ fontSize: 12, color: accent, fontWeight: 600, whiteSpace: "nowrap" }}>{gasType}</div>
          <div style={{ color: "#94a3b8", fontSize: 11.5, whiteSpace: "nowrap" }}>
            <Tex tex="\frac{T_2}{T_1} = \left(\frac{V_1}{V_2}\right)^{\gamma - 1}" />
          </div>
        </div>
      </div>
    );
  }

  // Modern physics: de Broglie ring radius ~ 1/sqrt(U)
  const lambdaPm = 1226 / Math.sqrt(param * 1000);
  const rInner = Math.max(11, 35 / Math.sqrt(param / 2.0));
  const rOuter = rInner * 1.72;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "136px 1fr", gap: 14, alignItems: "center" }}>
      <svg viewBox="0 0 152 138" style={{ width: "100%", height: 126 }}>
        <circle cx="76" cy="69" r="54" fill="#05130f" stroke="rgba(255,255,255,0.18)" />
        <circle cx="76" cy="69" r="2.5" fill="#6ee7b7" />
        <circle cx="76" cy="69" r={rInner} fill="none" stroke="#34d399" strokeWidth="2.6" />
        <circle cx="76" cy="69" r={rOuter} fill="none" stroke={accent} strokeWidth="2.2" />
      </svg>

      <div style={{ display: "grid", gap: 5, fontSize: 13, minWidth: 0 }}>
        <div style={{ color: "#94a3b8", fontSize: 11.5 }}>de Broglie Wavelength:</div>
        <div style={{ fontSize: 17.5, fontWeight: 700, color: "#f8fafc", whiteSpace: "nowrap" }}>
          <Tex tex={`\\lambda = ${lambdaPm.toFixed(1)}\\;\\text{pm}`} />
        </div>
        <div style={{ color: "#94a3b8", fontSize: 11.5, whiteSpace: "nowrap" }}>
          <Tex tex="d_{10} = 213\;\text{pm}" />
        </div>
        <div style={{ color: accent, fontSize: 12.5, whiteSpace: "nowrap" }}>
          <Tex tex={`r_1 \\propto ${(1 / Math.sqrt(param)).toFixed(3)}\\;\\text{kV}^{-1/2}`} />
        </div>
      </div>
    </div>
  );
}

export default function InteractiveShowcase({ onOpenFilm }) {
  const [activeId, setActiveId] = useState("optics");
  const [useAlt, setUseAlt] = useState(false);

  const initialParams = useMemo(() => {
    const obj = {};
    SCENES.forEach((s) => (obj[s.id] = s.defaultVal));
    return obj;
  }, []);
  const [params, setParams] = useState(initialParams);

  const activeScene = SCENES.find((s) => s.id === activeId) || SCENES[0];
  const currentClip = useAlt ? activeScene.altClip : activeScene.clip;
  const currentPoster = useAlt ? activeScene.altPoster : activeScene.poster;
  const currentTitle = useAlt ? activeScene.altTitle : activeScene.title;
  const currentParam = params[activeScene.id];

  return (
    <section id="showcase" className="section">
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
            <div className="eyebrow">INTERACTIVE BENCHMARK SHOWCASE</div>
            <h2 className="section-title">
              Five Disciplines · Verifiable Physical Control
            </h2>
            <p className="section-sub">
              Switch disciplines to inspect SSAA 3D apparatus renders alongside a live
              quantitative physical-law scrubber — or launch the full 87.5-second
              overview film.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenFilm}
            className="btn btn-primary"
          >
            <Film size={15} />
            <span>Play 87.5s Overview Film</span>
          </button>
        </div>

        {/* Discipline Pill Switcher */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {SCENES.map((s) => {
            const active = s.id === activeId;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setActiveId(s.id);
                  setUseAlt(false);
                }}
                className="btn"
                style={{
                  background: active ? "#0e131d" : "var(--surface)",
                  color: active ? "#ffffff" : "var(--ink)",
                  borderColor: active ? s.accent : "var(--line-2)",
                  boxShadow: active ? `0 0 0 1px ${s.accent}` : "none",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: s.accent,
                  }}
                />
                <span>{s.discipline}</span>
                <span className="mono" style={{ fontSize: 11.5, opacity: 0.72 }}>
                  {s.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* EFE-inspired Dark Container Card + PLE-Bench Scrollytelling Schematic Split */}
        <div
          className="grid-showcase"
          style={{
            background: "#0d1118",
            color: "#f8fafc",
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 26px 70px rgba(15, 23, 42, 0.25)",
            overflow: "hidden",
          }}
        >
          {/* Left: Hardware-accelerated 1080p SSAA MP4 Video Stage */}
          <div style={{ position: "relative", background: "#05070b", minHeight: 380 }}>
            <video
              key={currentClip}
              src={currentClip}
              poster={currentPoster}
              preload="metadata"
              autoPlay
              muted
              loop
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                maxHeight: 500,
              }}
            />

            {/* Bottom frosted pill caption (0:59 EFE style) */}
            <div
              style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 16,
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "10px 14px",
                borderRadius: 12,
                background: "rgba(9, 13, 21, 0.80)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}
            >
              <div>
                <div
                  className="mono"
                  style={{ fontSize: 10.5, color: activeScene.accent, letterSpacing: "0.14em" }}
                >
                  {activeScene.discipline.toUpperCase()} · {useAlt ? "SPHERE FEATURE" : "SSAA HERO SHOT"}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{currentTitle}</div>
              </div>

              <button
                type="button"
                onClick={() => setUseAlt((v) => !v)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.22)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#f8fafc",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <Play size={12} />
                <span>{useAlt ? "Back to Hero Shot" : `Switch to ${activeScene.altLabel}`}</span>
              </button>
            </div>
          </div>

          {/* Right: Lab Metadata + PLE-Bench Live Physical Parameter Scrubber */}
          <div
            style={{
              padding: "24px 24px 22px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              borderLeft: "1px solid rgba(255,255,255,0.10)",
              gap: 16,
            }}
          >
            <div>
              <div
                className="mono"
                style={{
                  fontSize: 11,
                  color: "#94a3b8",
                  letterSpacing: "0.14em",
                  marginBottom: 8,
                }}
              >
                CONTROLLED MEASUREMENT OBJECTIVE
              </div>
              <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.55 }}>
                {activeScene.description}
              </p>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.10)",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  marginBottom: 10,
                  paddingBottom: 8,
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span className="mono" style={{ fontSize: 10, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {activeScene.lawTitle}
                  </span>
                  <div style={{ fontSize: 13.5, color: activeScene.accent }}>
                    <Tex tex={activeScene.lawTex} />
                  </div>
                </div>
                <Sliders size={13} color="#94a3b8" style={{ flexShrink: 0 }} />
              </div>

              <PhysicsLawDiagram scene={activeScene} param={currentParam} />

              <div style={{ marginTop: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: 12,
                    color: "#94a3b8",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                    <span>{activeScene.sliderTitle}</span>
                    <Tex tex={activeScene.sliderTex} style={{ color: "#e2e8f0" }} />
                  </span>
                  <span className="num" style={{ color: "#f8fafc", fontWeight: 700, fontSize: 13 }}>
                    {currentParam.toFixed(2)}{" "}
                    {activeScene.unit ? <Tex tex={activeScene.unit} style={{ color: "#94a3b8" }} /> : null}
                  </span>
                </div>
                <input
                  type="range"
                  min={activeScene.min}
                  max={activeScene.max}
                  step={activeScene.step}
                  value={currentParam}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      [activeScene.id]: parseFloat(e.target.value),
                    }))
                  }
                  style={{
                    width: "100%",
                    accentColor: activeScene.accent,
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
