import React, { useState } from "react";
import { Check, Copy, Film } from "lucide-react";

const BIBTEX = `@misc{physicsfirstexam2026,
  title  = {Physics First Exam: Benchmarking Frontier Agents on Verifiable 3D University Physics Laboratories},
  author = {Physics First Exam Contributors},
  year   = {2026},
  note   = {79 verifiable labs across 166 apparatus configurations}
}`;

export default function CitationFooter({ summary, onOpenFilm }) {
  const [copied, setCopied] = useState(false);

  const copyBib = () => {
    navigator.clipboard?.writeText(BIBTEX);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer
      id="citation"
      style={{
        borderTop: "1px solid var(--line)",
        background: "var(--surface)",
        padding: "64px 0 36px",
      }}
    >
      <div className="container">
        {/* Core Scientific Narrative Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 16,
            marginBottom: 42,
          }}
        >
          <div className="card" style={{ padding: 20, boxShadow: "none" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--priv-ink)", marginBottom: 6 }}>
              01 · CONTROLLED SETTING
            </div>
            <h4 className="display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              Stepping Stone to Open Discovery
            </h4>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
              Standard undergraduate physics labs offer unambiguous measurement targets, real
              instrumentation physics, and objective quantitative verification.
            </p>
          </div>

          <div className="card" style={{ padding: 20, boxShadow: "none" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--std-ink)", marginBottom: 6 }}>
              02 · DISCOVERY BEGINS WITH MEASUREMENT
            </div>
            <h4 className="display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              Active Apparati, Not Static Q&amp;A
            </h4>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
              Agents cannot memorize formulas — they must zero calipers, tune bridges, align
              interferometers, and regress noisy observations across configurations.
            </p>
          </div>

          <div className="card" style={{ padding: 20, boxShadow: "none" }}>
            <div className="mono" style={{ fontSize: 11, color: "var(--blue)", marginBottom: 6 }}>
              03 · MULTI-CONFIGURATION BREADTH
            </div>
            <h4 className="display" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
              166 Paired Instrument Setups
            </h4>
            <p style={{ fontSize: 13.5, color: "var(--ink-2)" }}>
              Vernier vs digital calipers, varying focal lengths, swapped gases, and alternate
              lattice spacings force genuine instrument adaptation.
            </p>
          </div>
        </div>

        {/* BibTeX Citation Block (PLE-Bench & EFE clean block) */}
        <div style={{ marginBottom: 44 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <h3 className="display" style={{ fontSize: 22, fontWeight: 700 }}>
              Citation
            </h3>
            <button type="button" onClick={copyBib} className="btn" style={{ padding: "6px 14px", fontSize: 12.5 }}>
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? "Copied BibTeX" : "Copy BibTeX"}</span>
            </button>
          </div>

          <pre
            className="mono"
            style={{
              background: "#0d1118",
              color: "#e2e8f0",
              padding: "18px 20px",
              borderRadius: 12,
              fontSize: 12.5,
              lineHeight: 1.6,
              overflowX: "auto",
              border: "1px solid var(--line-2)",
            }}
          >
            {BIBTEX}
          </pre>
        </div>

        {/* PLE-Bench Signature Engineering Drawing Title Block Footer */}
        <div
          className="mono"
          style={{
            border: "1.5px solid var(--line-2)",
            borderRadius: 10,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            overflow: "hidden",
            fontSize: 11.5,
          }}
        >
          <div style={{ padding: "12px 16px", borderRight: "1px solid var(--line)" }}>
            <div style={{ color: "var(--ink-3)", fontSize: 10 }}>PROJECT</div>
            <div style={{ fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              PHYSICS FIRST EXAM (ULAB)
            </div>
          </div>
          <div style={{ padding: "12px 16px", borderRight: "1px solid var(--line)" }}>
            <div style={{ color: "var(--ink-3)", fontSize: 10 }}>SHEET</div>
            <div style={{ fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              01 / BENCHMARK INDEX · REV 3.0
            </div>
          </div>
          <div style={{ padding: "12px 16px", borderRight: "1px solid var(--line)" }}>
            <div style={{ color: "var(--ink-3)", fontSize: 10 }}>COVERAGE</div>
            <div style={{ fontWeight: 700, color: "var(--ink)", marginTop: 2 }}>
              {summary.taskCount} LABS · {summary.configCount} CONFIGS · {summary.disciplineCount} BRANCHES
            </div>
          </div>
          <div
            style={{
              padding: "12px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ color: "var(--ink-3)", fontSize: 10 }}>OVERVIEW FILM</div>
              <div style={{ fontWeight: 700, color: "var(--priv-ink)", marginTop: 2 }}>
                87.5s · 1080p SSAA
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenFilm}
              className="btn"
              style={{ padding: "5px 11px", fontSize: 11.5 }}
            >
              <Film size={12} /> Play
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
