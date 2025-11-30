#!/usr/bin/env bash
set -euo pipefail

# Simple start script Railpack can detect. It installs Python deps and then
# delegates to the existing `entrypoint.sh` which runs migrations, collectstatic
# (if requested), creates admin, and starts the WSGI server.

echo "==> Start script invoked"

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

if [ -f "requirements.txt" ]; then
  echo "==> Installing Python dependencies from requirements.txt"
  # Use python -m pip to ensure correct interpreter
  python -m pip install --upgrade pip || true
  python -m pip install -r requirements.txt
else
  echo "==> No requirements.txt found; skipping pip install"
fi

echo "==> Delegating to entrypoint.sh"
if [ -x ./entrypoint.sh ]; then
  exec ./entrypoint.sh
else
  exec bash ./entrypoint.sh
fi
