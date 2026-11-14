import React from "react";
import { Atom, Film, Sun, Moon } from "lucide-react";

const LINKS = [
  { id: "showcase", label: "Showcase" },
  { id: "leaderboard", label: "Leaderboard" },
  { id: "globe", label: "3D Globe" },
  { id: "labs", label: "79 Labs" },
];

export default function Navbar({ theme, onToggleTheme, activeSection, onOpenFilm }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 12,
        zIndex: 80,
        padding: "0 16px",
        pointerEvents: "none",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          padding: "7px 12px",
          borderRadius: 999,
          background: "var(--nav-bg)",
          backdropFilter: "blur(14px)",
          border: "1px solid var(--line)",
          boxShadow: "0 8px 26px rgba(15, 23, 42, 0.08)",
          pointerEvents: "auto",
          overflowX: "auto",
        }}
      >
        <a
          href="#top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            color: "var(--ink)",
            fontWeight: 700,
            fontSize: 14.5,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #2563eb, #2491a8)",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Atom size={16} />
          </span>
          <span className="display">Physics First Exam</span>
        </a>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "nowrap",
            flexShrink: 0,
          }}
        >
          {LINKS.map((l) => {
            const active = activeSection === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                style={{
                  padding: "6px 11px",
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  textDecoration: "none",
                  color: active ? "var(--ink)" : "var(--ink-2)",
                  background: active ? "var(--surface-2)" : "transparent",
                  border: active ? "1px solid var(--line-2)" : "1px solid transparent",
                  transition: "all 0.16s ease",
                }}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button
            type="button"
            onClick={onOpenFilm}
            className="btn"
            style={{
              padding: "6px 13px",
              fontSize: 12.5,
              background: "var(--priv-soft)",
              borderColor: "var(--priv)",
              color: "var(--priv-ink)",
            }}
          >
            <Film size={13} />
            <span>Video</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Switch between light and dark theme"
            className="btn"
            style={{
              width: 34,
              height: 34,
              padding: 0,
              justifyContent: "center",
            }}
            title={theme === "dark" ? "Switch to Light Blueprint" : "Switch to Dark Lab"}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </div>
    </header>
  );
}
