#!/usr/bin/env bash
# Generate render-env.upload (gitignored) for one-click import in Render Dashboard.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CONFIG="$ROOT/.firebase-web-config.json"
OUT="$ROOT/render-env.upload"
python3 - <<'PY' "$CONFIG" "$OUT"
import json, sys
c = json.load(open(sys.argv[1]))
lines = [
    f"VITE_FIREBASE_API_KEY={c['apiKey']}",
    f"VITE_FIREBASE_AUTH_DOMAIN={c['authDomain']}",
    f"VITE_FIREBASE_PROJECT_ID={c['projectId']}",
    f"VITE_FIREBASE_STORAGE_BUCKET={c['storageBucket']}",
    f"VITE_FIREBASE_MESSAGING_SENDER_ID={c['messagingSenderId']}",
    f"VITE_FIREBASE_APP_ID={c['appId']}",
]
open(sys.argv[2], "w").write("\n".join(lines) + "\n")
print(f"Wrote {sys.argv[2]} — Render → hurt-me → Environment → Add from .env")
PY