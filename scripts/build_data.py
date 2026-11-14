#!/usr/bin/env python3
"""Build verified static dataset src/data/benchmark.json and sync public media assets."""
import json
import re
import shutil
from collections import defaultdict
from pathlib import Path

WEB_ROOT = Path("/Users/conc/.gemini/antigravity/scratch/physics-first-exam-web")
STUDIO_DIR = Path("/Users/conc/.gemini/antigravity/scratch/pfe-studio-ws")
VIDEO_ROOT = Path("/Users/conc/.gemini/antigravity/scratch/physics-first-exam-video")
PLAT_DIR = Path("/Users/conc/Documents/ChatGPT/Physical Exp Bench/Physical_Exp/平台文件")
RUN_DIR = Path("/Users/conc/Documents/ChatGPT/Physical Exp Bench/runs/full74-comparison-20261110")

MODEL_META = {
    ("gpt-6-astra", "codex"): {"label": "GPT-6-Astra", "provider": "OpenAI", "color": "#2563eb"},
    ("claude-opus-5.5", "claude-code"): {"label": "Claude Opus 5.5", "provider": "Anthropic", "color": "#d6603a"},
    ("kimi-k3.1", "codex"): {"label": "Kimi K3.1", "provider": "Moonshot", "color": "#2491a8"},
    ("kimi-k3.1", "claude-code"): {"label": "Kimi K3.1", "provider": "Moonshot", "color": "#0891b2"},
    ("deepseek-v4.1-flash", "codex"): {"label": "DeepSeek V4.1 Flash", "provider": "DeepSeek", "color": "#0d9488"},
    ("deepseek-v4.1-flash", "claude-code"): {"label": "DeepSeek V4.1 Flash", "provider": "DeepSeek", "color": "#14b8a6"},
    ("glm-5.3-flash", "claude-code"): {"label": "GLM-5.3 Flash", "provider": "Zhipu AI", "color": "#7c3aed"},
    ("glm-5.3-flash", "codex"): {"label": "GLM-5.3 Flash", "provider": "Zhipu AI", "color": "#8b5cf6"},
}


def extract_actions(schema_path: Path) -> list[str]:
    if not schema_path.exists():
        return []
    try:
        data = json.loads(schema_path.read_text())
        acts = []
        for item in data.get("oneOf", []):
            const = item.get("properties", {}).get("action", {}).get("const")
            if const:
                acts.append(const)
        return acts
    except Exception:
        return []


def extract_goal(prompt_path: Path) -> tuple[str, str]:
    if not prompt_path.exists():
        return "", ""
    txt = prompt_path.read_text(encoding="utf-8", errors="ignore").strip()
    lines = [ln.strip() for ln in txt.splitlines() if ln.strip()]
    first = lines[0] if lines else ""
    m = re.search(r"answer\(([^)]+)\)", txt)
    if m:
        schema = f"answer({m.group(1)})"
    else:
        m2 = re.search(r"(\{\"action\":\"answer\"[^}]+\})", txt)
        schema = m2.group(1) if m2 else ""
    return first, schema


def main():
    # 1. Sync thumbnails & video showcase assets
    pub_thumbs = WEB_ROOT / "public/thumbs"
    pub_videos = WEB_ROOT / "public/videos"
    pub_thumbs.mkdir(parents=True, exist_ok=True)
    pub_videos.mkdir(parents=True, exist_ok=True)

    for src in (STUDIO_DIR / "thumbs").glob("*.jpg"):
        dst = pub_thumbs / src.name
        if not dst.exists() or src.stat().st_mtime > dst.stat().st_mtime:
            shutil.copy2(src, dst)

    video_map = {
        VIDEO_ROOT / "physics-first-exam-demo.mp4": pub_videos / "overview-demo.mp4",
    }
    for clip in (VIDEO_ROOT / "work/studio_clips_v3").glob("shot_*.mp4"):
        video_map[clip] = pub_videos / clip.name

    for src, dst in video_map.items():
        if src.exists() and (not dst.exists() or src.stat().st_mtime > dst.stat().st_mtime):
            shutil.copy2(src, dst)

    # 2. Load manifest + run data
    manifest = json.loads((STUDIO_DIR / "sphere_manifest.json").read_text())
    exp_json = json.loads((RUN_DIR / "experiment-success-latest.json").read_text())
    ea_json = json.loads((RUN_DIR / "evaluation-analysis-latest.json").read_text())

    ea_by_pair = {(r["model"], r["harness"]): r for r in ea_json.get("byPair", [])}
    task_meta = {t["id"]: t for t in manifest["tasks"]}

    # Core 33 task IDs
    core_ids = sorted({r["task"] for r in exp_json["rows"]})
    core_set = set(core_ids)

    # Featured 10 clips
    featured_clips = {
        "cart-collision": "videos/shot_cart_collision.mp4",
        "michelson": "videos/shot_michelson.mp4",
        "oscilloscope": "videos/shot_oscilloscope.mp4",
        "gas-adiabatic": "videos/shot_gas_adiabatic.mp4",
        "electron-diffraction": "videos/shot_electron.mp4",
        "string": "videos/shot_string.mp4",
        "prism-index": "videos/shot_prism_index.mp4",
        "microwave-bragg": "videos/shot_microwave_bragg.mp4",
        "heat-engine-pv": "videos/shot_heat_engine.mp4",
        "franckhertz": "videos/shot_franckhertz.mp4",
    }

    # Build enriched 79 labs catalog
    labs = []
    for idx, t in enumerate(manifest["tasks"]):
        tid = t["id"]
        if tid == "caliper":
            prompt_p = PLAT_DIR / "docs/agent-prompt.txt"
            schema_p = PLAT_DIR / "server/action-schema.json"
        else:
            prompt_p = PLAT_DIR / "experiments" / tid / "prompt.txt"
            schema_p = PLAT_DIR / "experiments" / tid / "action-schema.json"
        goal, answer_sig = extract_goal(prompt_p)
        actions = extract_actions(schema_p)
        labs.append({
            "index": idx,
            "id": tid,
            "title": t["title"],
            "zhTitle": t.get("zhTitle", ""),
            "discipline": t["discipline"],
            "subDiscipline": t.get("subDiscipline", t["discipline"]),
            "capability": t.get("capability", "metrology"),
            "configs": t.get("configs", 2),
            "inCore33": tid in core_set,
            "thumb": f"thumbs/{tid}.jpg",
            "video": featured_clips.get(tid),
            "goal": goal or f"Complete quantitative physical measurement and derive parameters for {t['title']}.",
            "answerSignature": answer_sig or "answer(...)",
            "actions": actions or ["look", "front", "turn", "press", "wait", "answer"],
        })

    # Per-pair leaderboard + per-discipline breakdown
    pairs = []
    for bp in exp_json["byPair"]:
        key = (bp["model"], bp["harness"])
        meta = MODEL_META.get(key, {"label": bp["model"], "provider": "Unknown", "color": "#64748b"})
        ea = ea_by_pair.get(key, {})
        rows = [r for r in exp_json["rows"] if r["model"] == bp["model"] and r["harness"] == bp["harness"]]
        disc_stats = defaultdict(lambda: {"expPassed": 0, "expTotal": 0, "cfgPassed": 0, "cfgTotal": 0})
        for r in rows:
            d = task_meta.get(r["task"], {}).get("discipline", "Other")
            disc_stats[d]["expTotal"] += 1
            disc_stats[d]["expPassed"] += 1 if r["successful"] else 0
            disc_stats[d]["cfgTotal"] += r["expectedConfigurations"]
            disc_stats[d]["cfgPassed"] += r["passedConfigurations"]

        disc_rates = {}
        for d, st in disc_stats.items():
            disc_rates[d] = {
                "expPassed": st["expPassed"],
                "expTotal": st["expTotal"],
                "expPct": round(100.0 * st["expPassed"] / st["expTotal"], 1) if st["expTotal"] else 0.0,
                "cfgPassed": st["cfgPassed"],
                "cfgTotal": st["cfgTotal"],
                "cfgPct": round(100.0 * st["cfgPassed"] / st["cfgTotal"], 1) if st["cfgTotal"] else 0.0,
            }

        pairs.append({
            "pairId": f"{bp['model']}@{bp['harness']}",
            "model": bp["model"],
            "label": meta["label"],
            "provider": meta["provider"],
            "harness": bp["harness"],
            "color": meta["color"],
            "successfulExperiments": bp["successfulExperiments"],
            "totalExperiments": bp["totalExperiments"],
            "expPct": round(bp["confirmedExperimentSuccessRate"] * 100.0, 1),
            "passedConfigurations": bp["passedConfigurations"],
            "submittedConfigurations": bp["submittedConfigurations"],
            "totalConfigurations": 74,
            "cfgPct": round(bp["confirmedConfigurationSuccessRateOf74"] * 100.0, 1),
            "endedCount": ea.get("endedCount", 0),
            "runningCount": ea.get("runningCount", 0),
            "endedMeanSteps": round(ea["endedMeanSteps"], 1) if ea.get("endedMeanSteps") is not None else None,
            "endedMedianSteps": round(ea["endedMedianSteps"], 1) if ea.get("endedMedianSteps") is not None else None,
            "successfulMeanSteps": round(ea["successfulMeanSteps"], 1) if ea.get("successfulMeanSteps") is not None else None,
            "disciplines": disc_rates,
        })

    pairs.sort(key=lambda x: (-x["expPct"], -x["cfgPct"], x["endedMeanSteps"] or 999))

    # Build 33x8 task matrix rows for Heatmap & Lab Inspector
    matrix = []
    for tid in core_ids:
        tmeta = task_meta.get(tid, {})
        cells = {}
        passed_pairs = 0
        for r in exp_json["rows"]:
            if r["task"] != tid:
                continue
            pid = f"{r['model']}@{r['harness']}"
            status = "pass" if r["successful"] else ("partial" if r["passedConfigurations"] > 0 else ("pending" if r["unresolvedWithoutFailedConfiguration"] else "fail"))
            if r["successful"]:
                passed_pairs += 1
            cells[pid] = {
                "status": status,
                "passedCfg": r["passedConfigurations"],
                "expectedCfg": r["expectedConfigurations"],
                "submittedCfg": r["submittedConfigurations"],
            }
        matrix.append({
            "id": tid,
            "title": tmeta.get("title", tid),
            "discipline": tmeta.get("discipline", "Other"),
            "capability": tmeta.get("capability", "metrology"),
            "passedPairs": passed_pairs,
            "cells": cells,
        })

    out_data = {
        "summary": {
            "taskCount": manifest["taskCount"],
            "configCount": manifest["configCount"],
            "disciplineCount": len(manifest["disciplineCounts"]),
            "capabilityCount": len(manifest["capabilities"]),
            "skillCount": 9,
            "coreExperimentCount": exp_json["experimentCount"],
            "coreConfigCount": 74,
            "modelHarnessPairCount": exp_json["modelHarnessPairs"],
            "scheduledRollouts": exp_json["expectedConfigurationsAcrossPairs"],
            "submittedRollouts": exp_json["submittedConfigurations"],
            "passedRollouts": exp_json["passedConfigurations"],
            "overallExpPassPct": round(exp_json["confirmedExperimentSuccessRate"] * 100.0, 1),
            "successfulExpUnits": exp_json["successfulExperimentModelHarnessUnits"],
            "totalExpUnits": exp_json["totalExperimentModelHarnessUnits"],
            "endedMeanSteps": round(ea_json["overall"]["endedMeanSteps"], 1),
            "successfulMeanSteps": round(ea_json["overall"]["successfulMeanSteps"], 1),
            "failedMeanSteps": round(ea_json["overall"]["failedSubmittedMeanSteps"], 1),
            "observedAtShanghai": exp_json["observedAtShanghai"],
        },
        "disciplineCounts": manifest["disciplineCounts"],
        "capabilityCounts": manifest["capabilityCounts"],
        "capabilities": manifest["capabilities"],
        "pairs": pairs,
        "matrix": matrix,
        "labs": labs,
    }

    dst_json = WEB_ROOT / "src/data/benchmark.json"
    dst_json.parent.mkdir(parents=True, exist_ok=True)
    dst_json.write_text(json.dumps(out_data, indent=2, ensure_ascii=False))
    print(f"Wrote {dst_json} ({dst_json.stat().st_size // 1024} KB), {len(labs)} labs, {len(pairs)} pairs, {len(matrix)} core tasks.")
    print(f"Synced {len(list(pub_thumbs.glob('*.jpg')))} thumbs and {len(list(pub_videos.glob('*.mp4')))} videos.")


if __name__ == "__main__":
    main()
