#!/usr/bin/env python3
"""Export tracker.csv rows as JSON documents for the Job Hunt board (claude.ai artifact).

Usage: python3 board_sync.py [out_dir]   (default out_dir: .board/)
Writes <out_dir>/roles/<id>.json, one per tracker row, plus <out_dir>/meta/board.json
(candidate name, focus line and salary floors come from profile/board.json).
Claude then pushes them with the ArtifactData tool (batch, op "update" for existing
docs so fields only the board holds, such as why/gaps, are preserved).
"""
import csv, json, os, re, sys
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, ".board")

# City codes shown on the board. Add the cities you target.
CITY = [
    (r"kuala lumpur|petaling", "KUL"), (r"doha|qatar", "DOH"), (r"abu dhabi", "AUH"), (r"dubai|ajman", "DXB"),
    (r"riyadh", "RUH"), (r"jeddah", "JED"), (r"bengaluru|bangalore", "BLR"), (r"chennai", "MAA"),
    (r"mumbai", "BOM"), (r"kolkata", "CCU"), (r"remote", "RMT"),
]

def city_code(loc):
    for pat, code in CITY:
        if re.search(pat, loc or "", re.I):
            return code
    return ""

def main():
    os.makedirs(os.path.join(OUT, "roles"), exist_ok=True)
    os.makedirs(os.path.join(OUT, "meta"), exist_ok=True)
    with open(os.path.join(ROOT, "tracker.csv"), newline="") as f:
        rows = list(csv.DictReader(f))
    for r in rows:
        doc = {
            "company": r["company"], "role": r["role"], "location": r["location"],
            "city_code": city_code(r["location"]), "url": r["source_url"], "status": r["status"],
            "fit_score": int(r["fit_score"] or 0), "found_on": r["found_on"], "applied_on": r["applied_on"],
            "next_action": r["next_action"], "next_action_due": r["next_action_due"], "notes": r["notes"],
            "has_application": os.path.exists(os.path.join(ROOT, "applications", r["id"], "resume.html")),
            "updated_from": "tracker",
        }
        with open(os.path.join(OUT, "roles", r["id"] + ".json"), "w") as f:
            json.dump(doc, f, ensure_ascii=False, indent=1)
    cfg_path = os.path.join(ROOT, "profile", "board.json")
    cfg = json.load(open(cfg_path)) if os.path.exists(cfg_path) else {}
    meta = {
        "synced_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "role_count": len(rows),
        **{k: cfg[k] for k in ("candidate", "focus", "floors") if k in cfg},
    }
    with open(os.path.join(OUT, "meta", "board.json"), "w") as f:
        json.dump(meta, f, indent=1)
    print(f"{len(rows)} roles -> {OUT}")

if __name__ == "__main__":
    main()
