import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Plus, Minus, RotateCcw, Sparkles } from "lucide-react";

const DISC_COLORS = {
  Mechanics: "#f5b841",
  Optics: "#38bdf8",
  Electromagnetism: "#34d399",
  Thermodynamics: "#fb7185",
  "Modern Physics": "#a78bfa",
};

const CAP_COLORS = {
  metrology: "#f5b841",
  alignment: "#38bdf8",
  nullfield: "#34d399",
  transient: "#fb7185",
  inference: "#a78bfa",
};

const CAP_NAMES = {
  metrology: "Precision Metrology",
  alignment: "Optical Alignment",
  nullfield: "Null & Field Control",
  transient: "Transient Tracking",
  inference: "Law Inversion",
};

export default function TaskGlobe3D({ data, onSelectLab }) {
  const mountRef = useRef(null);
  const rotRef = useRef({ rx: 0.22, ry: 0.4, drag: false, lx: 0, ly: 0, zoom: 10.2, auto: true });
  const hoverCbRef = useRef(null);
  const clickCbRef = useRef(null);

  const [scope, setScope] = useState("all"); // 'all' | 'core'
  const [colorBy, setColorBy] = useState("discipline"); // 'discipline' | 'capability'
  const [activeGroup, setActiveGroup] = useState(null);
  const [hoveredLab, setHoveredLab] = useState(null);

  hoverCbRef.current = setHoveredLab;
  clickCbRef.current = onSelectLab;

  const visibleLabs = useMemo(
    () => (scope === "core" ? data.labs.filter((l) => l.inCore33) : data.labs),
    [data.labs, scope]
  );

  const legendItems = useMemo(() => {
    if (colorBy === "discipline") {
      return Object.keys(DISC_COLORS).map((k) => ({
        key: k,
        label: k,
        color: DISC_COLORS[k],
        count: visibleLabs.filter((l) => l.discipline === k).length,
      }));
    }
    return Object.keys(CAP_COLORS).map((k) => ({
      key: k,
      label: CAP_NAMES[k],
      color: CAP_COLORS[k],
      count: visibleLabs.filter((l) => l.capability === k).length,
    }));
  }, [colorBy, visibleLabs]);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth || 720;
    const h = el.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, w / h, 0.1, 100);
    camera.position.z = rotRef.current.zoom;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    el.innerHTML = "";
    el.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);

    // Subtle lat/lon orbital rings matching studio_sphere.html & EFE globe
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.14,
    });
    const R = 2.6;
    for (let r = 0; r < 5; r++) {
      const pts = [];
      const tilt = (r / 5) * Math.PI;
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * R, Math.sin(a) * Math.cos(tilt) * R, Math.sin(a) * Math.sin(tilt) * R));
      }
      root.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), wireMat));
    }

    // Group labs by cluster axis on sphere so related labs form visible neighborhoods
    const groups = colorBy === "discipline" ? Object.keys(DISC_COLORS) : Object.keys(CAP_COLORS);
    const meshes = [];
    const sphereGeo = new THREE.SphereGeometry(0.088, 16, 16);
    const hitGeo = new THREE.SphereGeometry(0.18, 10, 10);
    const haloMat = new THREE.SpriteMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const N = visibleLabs.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Order labs by cluster so Fibonacci ordering produces smooth regional bands
    const ordered = [...visibleLabs].sort((a, b) => {
      const ka = colorBy === "discipline" ? a.discipline : a.capability;
      const kb = colorBy === "discipline" ? b.discipline : b.capability;
      return groups.indexOf(ka) - groups.indexOf(kb) || a.id.localeCompare(b.id);
    });

    ordered.forEach((lab, i) => {
      const t = (i + 0.5) / N;
      const y = 1 - 2 * t;
      const rad = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * goldenAngle;

      const gk = colorBy === "discipline" ? lab.discipline : lab.capability;
      const colHex = colorBy === "discipline" ? DISC_COLORS[gk] : CAP_COLORS[gk];
      const dimmed = activeGroup && activeGroup !== gk;

      const mat = new THREE.MeshBasicMaterial({
        color: colHex,
        transparent: true,
        opacity: dimmed ? 0.16 : 0.96,
      });
      const dot = new THREE.Mesh(sphereGeo, mat);
      dot.position.set(Math.cos(theta) * rad * R, y * R, Math.sin(theta) * rad * R);
      dot.scale.setScalar(lab.video ? 1.45 : 1.0);
      dot.userData = { lab };
      root.add(dot);
      meshes.push(dot);

      // Larger invisible hit helper
      const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false }));
      hit.position.copy(dot.position);
      hit.userData = { lab };
      root.add(hit);
    });

    // Ambient star dust on shell
    const dustCount = 260;
    const dPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const th = u * 2 * Math.PI;
      const ph = Math.acos(2 * v - 1);
      const rr = R * (0.94 + Math.random() * 0.14);
      dPos[i * 3] = rr * Math.sin(ph) * Math.cos(th);
      dPos[i * 3 + 1] = rr * Math.cos(ph);
      dPos[i * 3 + 2] = rr * Math.sin(ph) * Math.sin(th);
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute("position", new THREE.BufferAttribute(dPos, 3));
    root.add(
      new THREE.Points(
        dGeo,
        new THREE.PointsMaterial({ color: 0x94a3b8, size: 0.04, transparent: true, opacity: 0.5 })
      )
    );

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let movedDist = 0;

    const pick = (clientX, clientY) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(root.children, false);
      const hit = hits.find((h) => h.object.userData?.lab);
      return hit ? hit.object.userData.lab : null;
    };

    const onDown = (e) => {
      rotRef.current.drag = true;
      rotRef.current.auto = false;
      rotRef.current.lx = e.clientX;
      rotRef.current.ly = e.clientY;
      movedDist = 0;
    };
    const onMove = (e) => {
      if (rotRef.current.drag) {
        const dx = e.clientX - rotRef.current.lx;
        const dy = e.clientY - rotRef.current.ly;
        movedDist += Math.hypot(dx, dy);
        rotRef.current.ry += dx * 0.0065;
        rotRef.current.rx = Math.max(-1.3, Math.min(1.3, rotRef.current.rx + dy * 0.0065));
        rotRef.current.lx = e.clientX;
        rotRef.current.ly = e.clientY;
      } else {
        const lab = pick(e.clientX, e.clientY);
        renderer.domElement.style.cursor = lab ? "pointer" : "grab";
        hoverCbRef.current?.(lab);
      }
    };
    const onUp = (e) => {
      const wasClick = movedDist < 6;
      rotRef.current.drag = false;
      if (wasClick) {
        const lab = pick(e.clientX, e.clientY);
        if (lab) clickCbRef.current?.(lab);
      }
    };
    const onLeave = () => {
      rotRef.current.drag = false;
      hoverCbRef.current?.(null);
    };

    const dom = renderer.domElement;
    dom.addEventListener("pointerdown", onDown);
    dom.addEventListener("pointermove", onMove);
    dom.addEventListener("pointerup", onUp);
    dom.addEventListener("pointerleave", onLeave);

    let rafId = 0;
    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (rotRef.current.auto && !rotRef.current.drag) {
        rotRef.current.ry += 0.0022;
      }
      root.rotation.y = rotRef.current.ry;
      root.rotation.x = rotRef.current.rx;
      camera.position.z += (rotRef.current.zoom - camera.position.z) * 0.14;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const nw = el.clientWidth || 720;
      const nh = el.clientHeight || 500;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh, false);
    };
    window.addEventListener("resize", onResize);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    ro?.observe(el);

    return () => {
      cancelAnimationFrame(rafId);
      ro?.disconnect();
      window.removeEventListener("resize", onResize);
      dom.removeEventListener("pointerdown", onDown);
      dom.removeEventListener("pointermove", onMove);
      dom.removeEventListener("pointerup", onUp);
      dom.removeEventListener("pointerleave", onLeave);
      sphereGeo.dispose();
      hitGeo.dispose();
      wireMat.dispose();
      haloMat.dispose();
      dGeo.dispose();
      meshes.forEach((m) => m.material.dispose());
      renderer.dispose();
    };
  }, [visibleLabs, colorBy, activeGroup]);

  const zoomBy = (delta) => {
    rotRef.current.zoom = Math.max(5.2, Math.min(13.5, rotRef.current.zoom + delta));
  };

  const resetView = () => {
    rotRef.current.rx = 0.22;
    rotRef.current.ry = 0.4;
    rotRef.current.zoom = 10.2;
    rotRef.current.auto = true;
    setActiveGroup(null);
  };

  return (
    <section id="globe" className="section">
      <div className="container">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 22,
          }}
        >
          <div>
            <div className="eyebrow">TASK SPHERE</div>
            <h2 className="section-title">
              Explore {visibleLabs.length} Physics Laboratories
            </h2>
            <p className="section-sub">
              Drag to orbit or click any node to inspect the lab.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <div
              style={{
                display: "inline-flex",
                background: "var(--surface-2)",
                padding: 4,
                borderRadius: 999,
                border: "1px solid var(--line)",
              }}
            >
              {[
                { id: "all", label: `All (${data.summary.taskCount})` },
                { id: "core", label: `Core (${data.summary.coreExperimentCount})` },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setScope(s.id)}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "6px 13px",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: scope === s.id ? "var(--surface)" : "transparent",
                    color: scope === s.id ? "var(--ink)" : "var(--ink-2)",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div
              style={{
                display: "inline-flex",
                background: "var(--surface-2)",
                padding: 4,
                borderRadius: 999,
                border: "1px solid var(--line)",
              }}
            >
              {[
                { id: "discipline", label: "5 Disciplines" },
                { id: "capability", label: "5 Capabilities" },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setColorBy(c.id);
                    setActiveGroup(null);
                  }}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "6px 13px",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    background: colorBy === c.id ? "var(--surface)" : "transparent",
                    color: colorBy === c.id ? "var(--ink)" : "var(--ink-2)",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          className="grid-globe"
          style={{
            background: "#090c12",
            color: "#f8fafc",
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 24px 70px rgba(15, 23, 42, 0.28)",
            overflow: "hidden",
          }}
        >
          {/* Left Legend & Active Hover Preview */}
          <div
            style={{
              padding: 22,
              borderRight: "1px solid rgba(255,255,255,0.10)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div>
              <div className="mono" style={{ fontSize: 11, color: "#94a3b8", marginBottom: 12 }}>
                CLICK CLUSTER TO ISOLATE
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {legendItems.map((it) => {
                  const sel = activeGroup === it.key;
                  return (
                    <button
                      key={it.key}
                      type="button"
                      onClick={() => setActiveGroup(sel ? null : it.key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 12px",
                        borderRadius: 10,
                        background: sel ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.03)",
                        border: sel ? `1px solid ${it.color}` : "1px solid rgba(255,255,255,0.08)",
                        color: "#f8fafc",
                        cursor: "pointer",
                        fontSize: 13.5,
                        fontWeight: 600,
                      }}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span
                          style={{
                            width: 9,
                            height: 9,
                            borderRadius: "50%",
                            background: it.color,
                            boxShadow: `0 0 10px ${it.color}`,
                          }}
                        />
                        {it.label}
                      </span>
                      <span className="mono num" style={{ fontSize: 12, color: "#94a3b8" }}>
                        {it.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Hover / Inspection Card */}
            <div
              style={{
                borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.10)",
                padding: 12,
                minHeight: 160,
              }}
            >
              {hoveredLab ? (
                <div>
                  <img
                    src={hoveredLab.thumb}
                    alt={hoveredLab.title}
                    style={{
                      width: "100%",
                      height: 96,
                      objectFit: "cover",
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                  />
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{hoveredLab.title}</div>
                  <div className="mono" style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                    {hoveredLab.discipline} · {hoveredLab.configs} configs · Click to open
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: 12.5, color: "#94a3b8", lineHeight: 1.55 }}>
                  <Sparkles size={16} color="#38bdf8" style={{ marginBottom: 8 }} />
                  <div>
                    Hover a node to preview, or click to inspect lab details.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Three.js WebGL Viewport */}
          <div style={{ position: "relative", minHeight: 500, minWidth: 0, overflow: "hidden" }}>
            <div ref={mountRef} style={{ width: "100%", height: 500 }} />

            <div
              style={{
                position: "absolute",
                right: 16,
                bottom: 16,
                display: "flex",
                gap: 6,
              }}
            >
              <button
                type="button"
                onClick={() => zoomBy(-1.1)}
                title="Zoom in"
                className="btn"
                style={{
                  background: "rgba(15, 20, 30, 0.85)",
                  color: "#f8fafc",
                  borderColor: "rgba(255,255,255,0.18)",
                  padding: "7px 10px",
                }}
              >
                <Plus size={15} />
              </button>
              <button
                type="button"
                onClick={() => zoomBy(1.1)}
                title="Zoom out"
                className="btn"
                style={{
                  background: "rgba(15, 20, 30, 0.85)",
                  color: "#f8fafc",
                  borderColor: "rgba(255,255,255,0.18)",
                  padding: "7px 10px",
                }}
              >
                <Minus size={15} />
              </button>
              <button
                type="button"
                onClick={resetView}
                className="btn"
                style={{
                  background: "rgba(15, 20, 30, 0.85)",
                  color: "#f8fafc",
                  borderColor: "rgba(255,255,255,0.18)",
                  padding: "7px 13px",
                  fontSize: 12,
                }}
              >
                <RotateCcw size={13} />
                <span>Reset view</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
