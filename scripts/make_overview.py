#!/usr/bin/env python3
"""
Generate the Physics First Exam Bento overview diagram (`1024x640` CSS layout
exported as crystal-sharp `3072x1920` 3x UHD and `2048x1280` 2x Retina PNGs):
  - Top-Left: Brand emblem, title, updated subtitle, and 4 verified metrics
  - Top-Right: Video-style dark obsidian Frontier Agent Leaderboard grounded in
    Desktop/results.pdf (config pass / 74 setups, with DS-CC & KI-CX swapped)
  - Bottom Full-Width: 5-Discipline Taxonomy Showcase (3 pre-sharpened HD 3D labs
    per discipline = 15 examples)
"""

from __future__ import annotations

import shutil
from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter
from playwright.sync_api import sync_playwright

ROOT = Path("/Users/conc/.gemini/antigravity/scratch/physics-first-exam-web")
FRAMES_DIR = ROOT / "overview" / "frames"
ASSETS_DIR = ROOT / "overview" / "assets"
OUT_DIR = ROOT / "overview"
CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Grounded in Desktop/results.pdf (config success out of 74, "视频显示值" column)
# with (DeepSeek V4.1 Flash | Claude Code) and (Kimi K3.1 | Codex) swapped cleanly per user fix.
LEADERBOARD_ROWS = [
    {"model": "GPT-6-Astra", "harness": "codex", "pct": 47.3, "cnt": "35/74", "bar": "#0284c7", "glow": True},
    {"model": "Claude Opus 5.5", "harness": "claude-code", "pct": 43.2, "cnt": "32/74", "bar": "#d97706", "glow": False},
    {"model": "Kimi K3.1", "harness": "codex", "pct": 8.1, "cnt": "6/74", "bar": "#64748b", "glow": False},
    {"model": "Kimi K3.1", "harness": "claude-code", "pct": 6.8, "cnt": "5/74", "bar": "#64748b", "glow": False},
    {"model": "DeepSeek V4.1 Flash", "harness": "claude-code", "pct": 4.1, "cnt": "3/74", "bar": "#94a3b8", "glow": False},
    {"model": "DeepSeek V4.1 Flash", "harness": "codex", "pct": 2.7, "cnt": "2/74", "bar": "#94a3b8", "glow": False},
    {"model": "GLM-5.3 Flash", "harness": "codex", "pct": 1.4, "cnt": "1/74", "bar": "#94a3b8", "glow": False},
    {"model": "GLM-5.3 Flash", "harness": "claude-code", "pct": 0.0, "cnt": "0/74", "bar": "#cbd5e1", "glow": False},
]


def crop_sharpen_save(
    src_name: str,
    dst_name: str,
    x0: float,
    y0: float,
    x1: float,
    y1: float,
    target_w: int = 840,
    target_h: int = 470,
) -> str:
    """Crop tightly around the apparatus, fit-cover via high-precision Lanczos, apply mild
    optical acuity sharpening, and store lossless PNG so Chrome renders pin-sharp miniatures."""
    src = FRAMES_DIR / src_name
    dst = ASSETS_DIR / dst_name
    im = Image.open(src).convert("RGB")
    w, h = im.size
    crop_box = (int(w * x0), int(h * y0), int(w * x1), int(h * y1))
    roi = im.crop(crop_box)

    # Center-cover resample to target aspect (~1.787:1, matching .lab-tile) in Pillow
    rw, rh = roi.size
    src_ratio = rw / max(1, rh)
    dst_ratio = target_w / target_h
    if src_ratio > dst_ratio:
        new_w = int(rh * dst_ratio)
        left = (rw - new_w) // 2
        roi = roi.crop((left, 0, left + new_w, rh))
    else:
        new_h = int(rw / dst_ratio)
        top = int((rh - new_h) * 0.5)
        roi = roi.crop((0, top, rw, top + new_h))

    resized = roi.resize((target_w, target_h), Image.Resampling.LANCZOS)
    sharpened = resized.filter(ImageFilter.UnsharpMask(radius=0.9, percent=68, threshold=2))
    sharpened = ImageEnhance.Contrast(sharpened).enhance(1.04)
    sharpened.save(dst, format="PNG", compress_level=3)
    return dst.resolve().as_uri()


def prepare_assets() -> dict[str, str]:
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    return {
        # Mechanics (20)
        "mech_1": crop_sharpen_save("mech_cart.png", "mech_cart_v3.png", 0.05, 0.22, 0.95, 0.98),
        "mech_2": crop_sharpen_save("mech_string.png", "mech_string_v3.png", 0.04, 0.20, 0.96, 0.88),
        "mech_3": crop_sharpen_save("mech_caliper.png", "mech_caliper_v3.png", 0.03, 0.11, 0.93, 0.96),
        # Optics (21)
        "opt_1": crop_sharpen_save("optics_prism.png", "opt_prism_v3.png", 0.05, 0.16, 0.90, 0.96),
        "opt_2": crop_sharpen_save("optics_michelson.png", "opt_michelson_v3.png", 0.02, 0.10, 0.98, 0.94),
        "opt_3": crop_sharpen_save("optics_newtonrings.png", "opt_newton_v3.png", 0.08, 0.23, 0.84, 0.99),
        # Electromagnetism (20)
        "em_1": crop_sharpen_save("em_oscilloscope.png", "em_osc_v3.png", 0.17, 0.13, 0.95, 0.84),
        "em_2": crop_sharpen_save("em_microwave.png", "em_bragg_v3.png", 0.00, 0.05, 0.92, 0.93),
        "em_3": crop_sharpen_save("em_hall.png", "em_hall_v3.png", 0.09, 0.15, 0.92, 0.99),
        # Thermodynamics (9)
        "thm_1": crop_sharpen_save("thermo_adiabatic.png", "thm_adiab_v3.png", 0.03, 0.08, 0.88, 0.94),
        "thm_2": crop_sharpen_save("thermo_heat_engine.png", "thm_heat_v3.png", 0.02, 0.17, 0.98, 0.94),
        "thm_3": crop_sharpen_save("thermo_calorimetry.png", "thm_cal_v3.png", 0.08, 0.21, 0.92, 0.99),
        # Modern Physics (9)
        "mod_1": crop_sharpen_save("modern_electron.png", "mod_elec_v3.png", 0.00, 0.19, 0.85, 0.96),
        "mod_2": crop_sharpen_save("modern_franckhertz.png", "mod_fh_v3.png", 0.07, 0.13, 0.995, 0.92),
        "mod_3": crop_sharpen_save("modern_photoelectric.png", "mod_pe_v3.png", 0.10, 0.18, 0.92, 0.995),
    }


def render_leaderboard_rows() -> str:
    out = []
    for r in LEADERBOARD_ROWS:
        is_top = r["pct"] > 10
        txt_col = "#0f172a" if is_top else ("#334155" if r["pct"] > 0 else "#64748b")
        pct_col = "#0f172a" if is_top else ("#1e293b" if r["pct"] > 0 else "#64748b")
        bar_w = f"{r['pct']:.1f}%"
        glow_css = "box-shadow: 0 1px 4px rgba(2, 132, 199, 0.28);" if r["glow"] else ""
        out.append(
            f"""
            <div class="lb-row">
              <div class="lb-model" style="color:{txt_col};">
                <span class="lb-mname">{r['model']}</span>
                <span class="lb-har">{r['harness']}</span>
              </div>
              <div class="lb-track">
                <div class="lb-fill" style="width:{bar_w};background:{r['bar']};{glow_css}"></div>
              </div>
              <div class="lb-val" style="color:{pct_col};">
                {r['pct']:.1f}% <span class="lb-cnt">({r['cnt']})</span>
              </div>
            </div>
            """
        )
    return "\n".join(out)


def build_html(imgs: dict[str, str]) -> str:
    disciplines = [
        {
            "name": "Mechanics",
            "count": 20,
            "color": "#2563eb",
            "examples": [
                (imgs["mech_1"], "Cart Collision"),
                (imgs["mech_2"], "Standing Wave"),
                (imgs["mech_3"], "Vernier Caliper"),
            ],
        },
        {
            "name": "Optics",
            "count": 21,
            "color": "#0891b2",
            "examples": [
                (imgs["opt_1"], "Prism Dispersion"),
                (imgs["opt_2"], "Michelson Laser"),
                (imgs["opt_3"], "Newton's Rings"),
            ],
        },
        {
            "name": "Electromagnetism",
            "count": 20,
            "color": "#7c3aed",
            "examples": [
                (imgs["em_1"], "CRT Lissajous"),
                (imgs["em_2"], "Microwave Bragg"),
                (imgs["em_3"], "Hall Effect"),
            ],
        },
        {
            "name": "Thermodynamics",
            "count": 9,
            "color": "#d6603a",
            "examples": [
                (imgs["thm_1"], "Gas Adiabatic"),
                (imgs["thm_2"], "Heat Engine P–V"),
                (imgs["thm_3"], "Calorimetry"),
            ],
        },
        {
            "name": "Modern Physics",
            "count": 9,
            "color": "#059669",
            "examples": [
                (imgs["mod_1"], "Electron Bragg"),
                (imgs["mod_2"], "Franck–Hertz"),
                (imgs["mod_3"], "Photoelectric"),
            ],
        },
    ]

    cols_html = []
    for d in disciplines:
        cards = []
        for src, title in d["examples"]:
            cards.append(
                f"""
                <div class="lab-tile">
                  <img src="{src}" alt="{title}" />
                  <div class="lab-pill">{title}</div>
                </div>
                """
            )
        cols_html.append(
            f"""
            <div class="disc-col">
              <div class="disc-hdr">
                <div class="disc-name-wrap">
                  <span class="disc-dot" style="background:{d['color']};"></span>
                  <span class="disc-name">{d['name']}</span>
                </div>
                <span class="disc-badge">{d['count']}</span>
              </div>
              <div class="disc-stack">
                {''.join(cards)}
              </div>
            </div>
            """
        )

    lb_rows = render_leaderboard_rows()

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,600;0,6..72,700;1,6..72,500&family=Space+Grotesk:wght@600;700&display=swap"
  rel="stylesheet"
/>
<style>
  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }}

  html, body {{
    width: 1024px;
    height: 640px;
    overflow: hidden;
    font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    background-color: #f3f6fb;
    -webkit-font-smoothing: antialiased;
    color: #0f172a;
  }}

  .canvas {{
    width: 1024px;
    height: 640px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #f3f6fb;
    background-image:
      linear-gradient(to right, rgba(148, 173, 209, 0.17) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(148, 173, 209, 0.17) 1px, transparent 1px);
    background-size: 20px 20px;
  }}

  .card {{
    background: #ffffff;
    border-radius: 13px;
    border: 1px solid #e1e8f2;
    box-shadow:
      0 1px 2px rgba(15, 23, 42, 0.03),
      0 6px 18px -6px rgba(15, 23, 42, 0.06);
  }}

  /* ROW 1: Brand Card + Obsidian Video-Style Leaderboard */
  .row-top {{
    height: 214px;
    display: grid;
    grid-template-columns: 326px 1fr;
    gap: 10px;
  }}

  .brand-card {{
    padding: 17px 19px 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }}

  .brand-header {{
    display: flex;
    align-items: center;
    gap: 13px;
  }}

  .brand-title {{
    font-family: 'Newsreader', Georgia, serif;
    font-size: 29px;
    font-weight: 700;
    line-height: 0.96;
    letter-spacing: -0.025em;
    color: #0f172a;
  }}

  .brand-sub {{
    margin-top: 11px;
    font-family: 'Newsreader', Georgia, serif;
    font-style: italic;
    font-size: 13.8px;
    line-height: 1.42;
    color: #334155;
    font-weight: 500;
    letter-spacing: -0.01em;
  }}

  .metrics-row {{
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-top: 6px;
    border-top: 1px solid #eef2f7;
  }}

  .metric {{
    display: flex;
    flex-direction: column;
    gap: 1px;
  }}

  .metric-val {{
    font-family: 'Space Grotesk', 'IBM Plex Sans', sans-serif;
    font-size: 22.5px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.03em;
    color: #0f172a;
    font-variant-numeric: tabular-nums;
  }}

  .metric-lbl {{
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
  }}

  /* Top-Right: White-Card Frontier Agent Leaderboard (Desktop/results.pdf) */
  .lb-card {{
    background: #ffffff;
    border: 1px solid #e1e8f2;
    border-radius: 13px;
    padding: 12px 17px 11px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow:
      0 1px 2px rgba(15, 23, 42, 0.03),
      0 6px 18px -6px rgba(15, 23, 42, 0.06);
  }}

  .lb-hdr {{
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 7px;
    border-bottom: 1px solid #eef2f7;
  }}

  .lb-title {{
    font-family: 'Newsreader', Georgia, serif;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: #0f172a;
    line-height: 1.05;
  }}

  .lb-sub {{
    margin-top: 3px;
    font-size: 10.1px;
    color: #64748b;
    font-weight: 500;
  }}

  .lb-overall {{
    text-align: right;
    line-height: 1;
  }}

  .lb-big {{
    font-family: 'Space Grotesk', 'IBM Plex Sans', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #d6603a;
    letter-spacing: -0.03em;
    font-variant-numeric: tabular-nums;
  }}

  .lb-big-lbl {{
    margin-top: 2px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 7.9px;
    color: #64748b;
    letter-spacing: 0.05em;
  }}

  .lb-rows {{
    display: flex;
    flex-direction: column;
    gap: 4.5px;
    padding-top: 2px;
  }}

  .lb-row {{
    display: grid;
    grid-template-columns: 214px 1fr 86px;
    align-items: center;
    gap: 12px;
    height: 13.5px;
  }}

  .lb-model {{
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10.6px;
    font-weight: 600;
    letter-spacing: -0.01em;
    white-space: nowrap;
  }}

  .lb-har {{
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.2px;
    font-weight: 500;
    color: #475569;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    padding: 0.5px 5px;
    border-radius: 3.5px;
  }}

  .lb-track {{
    height: 8.5px;
    border-radius: 999px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }}

  .lb-fill {{
    height: 100%;
    border-radius: 999px;
  }}

  .lb-val {{
    text-align: right;
    font-size: 10.6px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.015em;
    white-space: nowrap;
  }}

  .lb-cnt {{
    font-family: 'IBM Plex Mono', monospace;
    font-size: 8.8px;
    font-weight: 500;
    color: #64748b;
  }}

  /* ROW 2: Full-Width 5-Discipline Multi-Example Taxonomy */
  .row-tax {{
    flex: 1;
    min-height: 0;
    padding: 11px 12px 11px;
    display: flex;
    flex-direction: column;
  }}

  .tax-hdr {{
    flex: none;
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 8px;
    padding: 0 2px;
  }}

  .tax-hdr-left {{
    display: flex;
    align-items: baseline;
    gap: 10px;
  }}

  .tax-hdr-title {{
    font-family: 'Newsreader', Georgia, serif;
    font-size: 16.5px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
  }}

  .tax-hdr-sub {{
    font-size: 11.4px;
    color: #64748b;
    font-weight: 500;
  }}

  .disc-cols {{
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: minmax(0, 1fr);
    gap: 9px;
  }}

  .disc-col {{
    min-height: 0;
    background: #f6f8fc;
    border: 1px solid #e3eaf4;
    border-radius: 10px;
    padding: 7px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }}

  .disc-hdr {{
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 20px;
    padding: 0 2px;
  }}

  .disc-name-wrap {{
    display: flex;
    align-items: center;
    gap: 5.5px;
    min-width: 0;
  }}

  .disc-dot {{
    width: 6.5px;
    height: 6.5px;
    border-radius: 50%;
    flex-shrink: 0;
  }}

  .disc-name {{
    font-size: 11.1px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }}

  .disc-badge {{
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9.6px;
    font-weight: 600;
    color: #334155;
    background: #ffffff;
    border: 1px solid #dbe3ef;
    padding: 0.5px 5.5px;
    border-radius: 5px;
    flex-shrink: 0;
  }}

  .disc-stack {{
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-rows: repeat(3, minmax(0, 1fr));
    gap: 6px;
  }}

  .lab-tile {{
    position: relative;
    min-height: 0;
    border-radius: 7px;
    overflow: hidden;
    background: #141c28;
    border: 1px solid rgba(15, 23, 42, 0.09);
  }}

  .lab-tile img {{
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    image-rendering: -webkit-optimize-contrast;
  }}

  .lab-pill {{
    position: absolute;
    left: 5px;
    bottom: 5px;
    background: rgba(255, 255, 255, 0.94);
    backdrop-filter: blur(6px);
    padding: 1.5px 6px;
    border-radius: 4.5px;
    font-size: 9.4px;
    font-weight: 600;
    line-height: 1.25;
    color: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.9);
    box-shadow: 0 1.5px 6px rgba(15, 23, 42, 0.16);
    letter-spacing: -0.01em;
  }}
</style>
</head>
<body>
  <div class="canvas">
    <!-- TOP ROW: Brand + Core Metrics (Left) & Frontier Agent Leaderboard (Right) -->
    <div class="row-top">
      <div class="card brand-card">
        <div>
          <div class="brand-header">
            <svg width="46" height="46" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="20.5" cy="23.5" rx="14.5" ry="7.2" transform="rotate(-34 20.5 23.5)" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round"/>
              <ellipse cx="20.5" cy="23.5" rx="14.5" ry="7.2" transform="rotate(34 20.5 23.5)" stroke="#0f172a" stroke-width="3.6" stroke-linecap="round"/>
              <circle cx="20.5" cy="23.5" r="5.2" fill="#2491a8" stroke="#ffffff" stroke-width="2.2"/>
              <path d="M29.5 31.2L34.2 35.8L43.2 25.4" stroke="#ffffff" stroke-width="6.8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M29.5 31.2L34.2 35.8L43.2 25.4" stroke="#d6603a" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="brand-title">Physics<br/>First Exam</div>
          </div>
          <div class="brand-sub">
            Before discovering new physical laws,<br/>
            can AI complete classic physics experiments?
          </div>
        </div>

        <div class="metrics-row">
          <div class="metric">
            <div class="metric-val">79</div>
            <div class="metric-lbl">labs</div>
          </div>
          <div class="metric">
            <div class="metric-val">166</div>
            <div class="metric-lbl">configs</div>
          </div>
          <div class="metric">
            <div class="metric-val">5</div>
            <div class="metric-lbl">disciplines</div>
          </div>
          <div class="metric">
            <div class="metric-val">6</div>
            <div class="metric-lbl">capabilities</div>
          </div>
        </div>
      </div>

      <div class="lb-card">
        <div class="lb-hdr">
          <div>
            <div class="lb-title">Frontier Agent Leaderboard</div>
            <div class="lb-sub">Core 33 suite · 33 tasks · 74 configs · 592 evaluations</div>
          </div>
          <div class="lb-overall">
            <div class="lb-big">14.2%</div>
            <div class="lb-big-lbl">OVERALL CONFIG PASS (84 / 592)</div>
          </div>
        </div>
        <div class="lb-rows">
          {lb_rows}
        </div>
      </div>
    </div>

    <!-- BOTTOM ROW: Full-Width 5-Discipline Multi-Example Taxonomy -->
    <div class="card row-tax">
      <div class="tax-hdr">
        <span class="tax-hdr-title">Discipline Taxonomy</span>
        <span class="tax-hdr-sub">5 physics disciplines · 79 verifiable 3D laboratory tasks</span>
      </div>
      <div class="disc-cols">
        {''.join(cols_html)}
      </div>
    </div>
  </div>
</body>
</html>
"""


def main() -> None:
    imgs = prepare_assets()
    html_str = build_html(imgs)
    html_path = OUT_DIR / "overview.html"
    html_path.write_text(html_str, encoding="utf-8")

    # Export primary overview directly as crisp 3x UHD (3072x1920) AND 2x Retina (2048x1280)
    # so every small 3D apparatus thumbnail retains razor-sharp dial ticks & numbers.
    out_main = OUT_DIR / "physics-first-exam-overview.png"
    out_2x = OUT_DIR / "physics-first-exam-overview-2x.png"
    public_copy = ROOT / "public" / "overview-diagram.png"

    with sync_playwright() as p:
        browser = p.chromium.launch(
            executable_path=CHROME_BIN,
            headless=True,
            args=["--no-sandbox", "--disable-dev-shm-usage"],
        )
        ctx3 = browser.new_context(viewport={"width": 1024, "height": 640}, device_scale_factor=3)
        pg3 = ctx3.new_page()
        pg3.goto(html_path.resolve().as_uri(), wait_until="networkidle")
        loaded = pg3.evaluate("async () => { await document.fonts.ready; return [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))]; }")
        print(f"Loaded font families: {loaded}")
        pg3.wait_for_timeout(350)
        pg3.screenshot(path=str(out_main), type="png")
        ctx3.close()

        ctx2 = browser.new_context(viewport={"width": 1024, "height": 640}, device_scale_factor=2)
        pg2 = ctx2.new_page()
        pg2.goto(html_path.resolve().as_uri(), wait_until="networkidle")
        pg2.evaluate("() => document.fonts.ready")
        pg2.wait_for_timeout(250)
        pg2.screenshot(path=str(out_2x), type="png")
        ctx2.close()

        browser.close()

    shutil.copy2(out_main, public_copy)
    for fp in (out_main, out_2x, public_copy):
        with Image.open(fp) as im:
            print(f"Wrote {fp} -> size={im.size}, bytes={fp.stat().st_size}")


if __name__ == "__main__":
    main()
