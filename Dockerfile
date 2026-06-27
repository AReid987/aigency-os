# ─── Aigency OS Production Dockerfile ────────────────────────────────────────
# Multi-stage build: frontend + API in a single container.

# Stage 1: Build workspace packages + frontend
FROM node:22-slim AS frontend-builder
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages/ packages/
COPY apps/web/package.json apps/web/
RUN pnpm install --frozen-lockfile

# Build ALL workspace packages first
RUN pnpm --filter @vscp/shared-types run build
RUN pnpm --filter @vscp/ui run build
RUN pnpm --filter @vscp/api-client run build

# Build frontend
COPY apps/web/ apps/web/
RUN pnpm --filter @vscp/web run build

# Stage 2: Build API
FROM node:22-slim AS api-builder
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json tsconfig.base.json ./
COPY packages/ packages/
COPY services/paperclip-api/package.json services/paperclip-api/
RUN pnpm install --frozen-lockfile

# Build shared-types first (paperclip-api depends on it)
RUN pnpm --filter @vscp/shared-types run build

# Build API
COPY services/paperclip-api/ services/paperclip-api/
RUN pnpm --filter @vscp/paperclip-api run build

# Stage 3: Production
FROM node:22-slim AS production
WORKDIR /app

COPY --from=api-builder /app/services/paperclip-api/dist ./services/paperclip-api/dist
COPY --from=api-builder /app/services/paperclip-api/package.json ./services/paperclip-api/
COPY --from=api-builder /app/node_modules ./node_modules
COPY --from=frontend-builder /app/apps/web/dist ./apps/web/dist

RUN mkdir -p /app/data

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

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["node", "services/paperclip-api/dist/server.js"]
