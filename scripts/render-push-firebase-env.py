#!/usr/bin/env python3
"""Push VITE_FIREBASE_* env vars to Render hurt-me static site and trigger deploy."""
from __future__ import annotations

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

SERVICE_ID = "srv-d93fvc7aqgkc73bt7d10"
ROOT = Path(__file__).resolve().parents[1]
CONFIG = ROOT / ".firebase-web-config.json"
CLI = Path.home() / ".render" / "cli.yaml"


def main() -> int:
    try:
        import yaml
    except ImportError:
        print("pip install pyyaml", file=sys.stderr)
        return 1

    api_key = yaml.safe_load(CLI.read_text()).get("api")
    if not api_key:
        print("Run: render login", file=sys.stderr)
        return 1
    if not CONFIG.is_file():
        print(f"Missing {CONFIG}", file=sys.stderr)
        return 1

    c = json.loads(CONFIG.read_text())
    firebase = [
        ("VITE_FIREBASE_API_KEY", c["apiKey"]),
        ("VITE_FIREBASE_AUTH_DOMAIN", c["authDomain"]),
        ("VITE_FIREBASE_PROJECT_ID", c["projectId"]),
        ("VITE_FIREBASE_STORAGE_BUCKET", c["storageBucket"]),
        ("VITE_FIREBASE_MESSAGING_SENDER_ID", c["messagingSenderId"]),
        ("VITE_FIREBASE_APP_ID", c["appId"]),
    ]

    headers = {"Authorization": f"Bearer {api_key}", "Accept": "application/json"}

    req = urllib.request.Request(
        f"https://api.render.com/v1/services/{SERVICE_ID}/env-vars",
        headers=headers,
    )
    with urllib.request.urlopen(req) as resp:
        existing = json.loads(resp.read().decode())
    merged = {item["envVar"]["key"]: item["envVar"]["value"] for item in existing}
    for k, v in firebase:
        merged[k] = v
    body = [{"key": k, "value": v} for k, v in sorted(merged.items())]

    put = urllib.request.Request(
        f"https://api.render.com/v1/services/{SERVICE_ID}/env-vars",
        data=json.dumps(body).encode(),
        headers={**headers, "Content-Type": "application/json"},
        method="PUT",
    )
    with urllib.request.urlopen(put) as resp:
        json.loads(resp.read().decode())
    print(f"Set {len(firebase)} Firebase env vars on Render ({len(body)} total).")

    deploy = urllib.request.Request(
        f"https://api.render.com/v1/services/{SERVICE_ID}/deploys",
        data=b"{}",
        headers={**headers, "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(deploy) as resp:
        d = json.loads(resp.read().decode())
    print("Deploy triggered:", d.get("id", d))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except urllib.error.HTTPError as e:
        print(e.read().decode(), file=sys.stderr)
        raise SystemExit(1) from e