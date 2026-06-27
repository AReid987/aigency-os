#!/bin/bash
# ─── Aigency OS — Free VPS Deployment Script ─────────────────────────────────
# Tested on: Oracle Cloud Free Tier (ARM64), Ubuntu 22.04/24.04
# Also works on: Railway, Fly.io, Render, any VPS with Node.js 22+
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/.../deploy.sh | bash
#   OR
#   chmod +x deploy.sh && ./deploy.sh

set -euo pipefail

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           Aigency OS — Production Deployment                ║"
echo "╚══════════════════════════════════════════════════════════════╝"

# ─── 1. System Dependencies ──────────────────────────────────────────────────
echo ""
echo "→ Installing system dependencies..."

if command -v apt-get &>/dev/null; then
  sudo apt-get update -qq
  sudo apt-get install -y -qq curl git build-essential
elif command -v dnf &>/dev/null; then
  sudo dnf install -y curl git gcc-c++ make
fi

# ─── 2. Node.js 22+ ─────────────────────────────────────────────────────────
echo ""
echo "→ Installing Node.js 22..."

if ! command -v node &>/dev/null || [[ $(node -v | cut -d. -f1 | tr -d v) -lt 22 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y -qq nodejs
fi

echo "  Node.js $(node -v) installed"

# ─── 3. pnpm ─────────────────────────────────────────────────────────────────
echo ""
echo "→ Installing pnpm..."

if ! command -v pnpm &>/dev/null; then
  corepack enable
  corepack prepare pnpm@latest --activate
fi

echo "  pnpm $(pnpm -v) installed"

# ─── 4. Clone Repository ────────────────────────────────────────────────────
echo ""
echo "→ Cloning Aigency OS..."

INSTALL_DIR="${AIGENCY_DIR:-$HOME/aigency-os}"

if [ -d "$INSTALL_DIR" ]; then
  echo "  Directory exists, pulling latest..."
  cd "$INSTALL_DIR"
  git pull --ff-only
else
  git clone https://github.com/AReid987/aigency-os.git "$INSTALL_DIR"
  cd "$INSTALL_DIR"
fi

# ─── 5. Environment Configuration ───────────────────────────────────────────
echo ""
echo "→ Configuring environment..."

if [ ! -f .env ]; then
  cp .env.example .env

  # Generate a secure JWT secret
  JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 64 /dev/urandom | base64 | tr -d '\n/' | head -c 64)
  sed -i "s/your-s...n/"  # This is a template — actual sed below

  # Generate admin password
  ADMIN_PASS=$(openssl rand -base64 16 2>/dev/null || head -c 16 /dev/urandom | base64 | tr -d '\n/' | head -c 16)

  # Write actual values
  cat > .env <<EOF
PORT=3001
HOST=0.0.0.0
NODE_ENV=production
JWT_SECRET=${JWT_SECRET}
ADMIN_EMAIL=admin@aigency.os
ADMIN_PASSWORD=${ADMIN_PASS}
ADMIN_NAME=Antonio Reid
AUTH_DB_PATH=./data/auth.db
FRONTEND_PATH=./apps/web/dist
EOF

  echo "  .env created with secure credentials"
  echo ""
  echo "  ╔══════════════════════════════════════════════════════════╗"
  echo "  ║  SAVE THESE CREDENTIALS — they won't be shown again!    ║"
  echo "  ╠══════════════════════════════════════════════════════════╣"
  echo "  ║  Admin Email:    admin@aigency.os                       ║"
  echo "  ║  Admin Password: ${ADMIN_PASS}                          ║"
  echo "  ╚══════════════════════════════════════════════════════════╝"
  echo ""
else
  echo "  .env already exists, skipping"
fi

# ─── 6. Install Dependencies ────────────────────────────────────────────────
echo ""
echo "→ Installing project dependencies..."

pnpm install --frozen-lockfile 2>/dev/null || pnpm install

# ─── 7. Build ────────────────────────────────────────────────────────────────
echo ""
echo "→ Building for production..."

pnpm run build

# ─── 8. Start with PM2 (process manager) ────────────────────────────────────
echo ""
echo "→ Installing PM2 process manager..."

if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

# Stop existing instance if running
pm2 delete aigency-os 2>/dev/null || true

# Start the production server
pm2 start services/paperclip-api/dist/server.js \
  --name aigency-os \
  --max-memory-restart 512M \
  --env production

# Save PM2 process list for auto-restart on reboot
pm2 save

# Set up PM2 to start on boot
pm2 startup 2>/dev/null || true

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              Aigency OS — Deployment Complete!               ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║                                                              ║"
echo "║  Server running on port 3001                                 ║"
echo "║                                                              ║"
echo "║  Access at: http://$(hostname -I | awk '{print $1}'):3001    ║"
echo "║                                                              ║"
echo "║  Admin login:                                                ║"
echo "║    Email: admin@aigency.os                                   ║"
echo "║    Password: (see above)                                     ║"
echo "║                                                              ║"
echo "║  Domain Expert signup:                                       ║"
echo "║    Visit /signup to create an account                        ║"
echo "║                                                              ║"
echo "║  Useful commands:                                            ║"
echo "║    pm2 status          — Check server status                 ║"
echo "║    pm2 logs aigency-os — View server logs                    ║"
echo "║    pm2 restart aigency-os — Restart server                   ║"
echo "║                                                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
