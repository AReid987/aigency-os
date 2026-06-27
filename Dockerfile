# ─── Aigency OS Production Dockerfile ────────────────────────────────────────
# Single-stage build: everything in one container.
# Simpler, more reliable for monorepo workspace resolution.

FROM node:22-slim
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Install native deps first (for layer caching)
RUN apt-get update -qq && apt-get install -y -qq python3 make g++ curl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages/ packages/
COPY apps/web/package.json apps/web/
COPY services/paperclip-api/package.json services/paperclip-api/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Build workspace packages (order matters)
RUN pnpm --filter @vscp/shared-types run build
RUN pnpm --filter @vscp/ui run build
RUN pnpm --filter @vscp/api-client run build

# Build frontend
COPY apps/web/ apps/web/
RUN pnpm --filter @vscp/web run build

# Build API
COPY services/paperclip-api/ services/paperclip-api/
RUN pnpm --filter @vscp/paperclip-api run build

# Clean up dev deps for smaller image
RUN pnpm prune --prod

# Data directory for SQLite
RUN mkdir -p /app/data

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV FRONTEND_PATH=/app/apps/web/dist
ENV AUTH_DB_PATH=/app/d...nENV JWT_SECRET=change...nENV ADMIN_EMAIL=admin@aigency.os
ENV ADMIN_PASSWORD=*** ADMIN_NAME="Antonio Reid"

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "services/paperclip-api/dist/server.js"]
