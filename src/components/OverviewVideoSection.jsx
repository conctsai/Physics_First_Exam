import React, { useEffect, useRef, useState } from "react";
import { Maximize2, Play } from "lucide-react";

/**
 * Clean inline video player placed directly above the Five Disciplines section.
 */
export default function OverviewVideoSection({ onOpenFilm, modalOpen }) {
  const videoRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (modalOpen && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  }, [modalOpen]);

  const handleInlinePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    setStarted(true);
    el.play().catch(() => {});
  };

  const handleOpenFullscreen = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
    onOpenFilm?.();
  };

  return (
    <section
      id="overview-film"
      className="section"
      style={{ paddingTop: 64, paddingBottom: 20 }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <div className="eyebrow">OVERVIEW</div>
            <h2 className="section-title">
              Physics First Exam in Action
            </h2>
          </div>

          <button
            type="button"
            onClick={handleOpenFullscreen}
            className="btn"
            style={{
              background: "var(--surface)",
              borderColor: "var(--line-2)",
            }}
          >
            <Maximize2 size={14} />
            <span>Expand</span>
          </button>
        </div>

        <div
          style={{
            borderRadius: 18,
            overflow: "hidden",
            background: "#000000",
            border: "1px solid var(--line-2)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              background: "#000000",
            }}
          >
            <video
              ref={videoRef}
              src="videos/overview-demo.mp4"
              poster="thumbs/overview-poster.jpg"
              controls
              playsInline
              preload="metadata"
              onPlay={() => setStarted(true)}
              style={{
                width: "100%",
                height: "100%",
                display: "block",
                objectFit: "contain",
                background: "#000000",
              }}
            />

            {!started && (
              <button
                type="button"
                onClick={handleInlinePlay}
                aria-label="Play overview video"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  background:
                    "radial-gradient(circle at center, rgba(9, 12, 18, 0.28) 0%, rgba(9, 12, 18, 0.10) 58%, rgba(9, 12, 18, 0.30) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "14px 24px",
                    borderRadius: 999,
                    background: "rgba(15, 20, 26, 0.88)",
                    border: "1px solid rgba(255, 255, 255, 0.28)",
                    color: "#ffffff",
                    fontSize: 15,
                    fontWeight: 600,
                    boxShadow: "0 14px 36px rgba(0, 0, 0, 0.45)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Play size={18} fill="#ffffff" />
                  <span>Play Video</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
