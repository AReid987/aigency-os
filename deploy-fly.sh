#!/bin/bash
# ─── Aigency OS — Fly.io Deploy Script ───────────────────────────────────────
# Prerequisites: flyctl installed, run 'flyctl auth login' first
#
# Usage: ./deploy-fly.sh

set -euo pipefail

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         Aigency OS — Fly.io Deployment                      ║"
echo "╚══════════════════════════════════════════════════════════════╝"

# Check auth
if ! flyctl auth whoami &>/dev/null; then
  echo ""
  echo "ERROR: Not logged in to Fly.io"
  echo "Run: flyctl auth login"
  exit 1
fi

echo ""
echo "→ Building frontend..."
pnpm --filter @aigency-os/web run build

echo ""
echo "→ Deploying to Fly.io..."
flyctl deploy --build-secret JWT_SECRET="$(openssl rand -hex 32)" \
  --build-secret ADMIN_PASSWORD="$(openssl rand -base64 16)"

echo ""
echo "→ Creating persistent volume for SQLite..."
flyctl volumes create aigency_data --region iad --size 1 2>/dev/null || echo "  Volume already exists"

echo ""
echo "→ Setting secrets..."
flyctl secrets set JWT_SECRET="$(openssl rand -hex 32)" 2>/dev/null || true

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              Deployment Complete!                            ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  Your app is live at: https://aigency-os.fly.dev            ║"
echo "║                                                              ║"
echo "║  Admin login:                                                ║"
echo "║    Email: admin@aigency.os                                   ║"
echo "║    Password: (check flyctl secrets list)                     ║"
echo "║                                                              ║"
echo "║  Domain Expert signup at: https://aigency-os.fly.dev/signup  ║"
echo "║                                                              ║"
echo "║  Useful commands:                                            ║"
echo "║    flyctl status        — Check deployment status            ║"
echo "║    flyctl logs          — View server logs                   ║"
echo "║    flyctl ssh console   — SSH into the VM                   ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
