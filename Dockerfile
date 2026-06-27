# ─── Aigency OS Production Dockerfile ────────────────────────────────────────
# Multi-stage build: frontend + API in a single container.
# Runs on port 3001 by default.

# Stage 1: Build frontend
FROM node:22-slim AS frontend-builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/web/package.json apps/web/
COPY packages/ packages/
RUN pnpm install --frozen-lockfile --filter @vscp/web...
COPY apps/web/ apps/web/
COPY tsconfig.base.json ./
RUN pnpm --filter @vscp/web run build

# Stage 2: Build API
FROM node:22-slim AS api-builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY services/paperclip-api/package.json services/paperclip-api/
COPY packages/ packages/
RUN pnpm install --frozen-lockfile --filter @vscp/paperclip-api...
COPY services/paperclip-api/ services/paperclip-api/
COPY tsconfig.base.json ./
RUN pnpm --filter @vscp/paperclip-api run build

# Stage 3: Production
FROM node:22-slim AS production
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy built API
COPY --from=api-builder /app/services/paperclip-api/dist ./services/paperclip-api/dist
COPY --from=api-builder /app/services/paperclip-api/package.json ./services/paperclip-api/
COPY --from=api-builder /app/node_modules ./node_modules
COPY --from=api-builder /app/services/paperclip-api/node_modules ./services/paperclip-api/node_modules

# Copy built frontend
COPY --from=frontend-builder /app/apps/web/dist ./apps/web/dist

# Data directory for SQLite
RUN mkdir -p /app/data

# Environment
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV FRONTEND_PATH=/app/apps/web/dist
ENV AUTH_DB_PATH=/app/data/auth.db
ENV JWT_SECRET=change-me-in-production
ENV ADMIN_EMAIL=admin@aigency.os
ENV ADMIN_PASSWORD=admin123
ENV ADMIN_NAME="Antonio Reid"

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "services/paperclip-api/dist/server.js"]
