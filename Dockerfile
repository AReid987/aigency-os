# ─── Aigency OS — Production Dockerfile (512MB RAM Optimized) ─────────────────
# Multi-stage build for the unified monolith.
# All 11 services run in one Node.js process. ~200-300MB RAM at idle.
#
# Build:  docker build -t aigency-os .
# Run:    docker run -p 3001:3001 -e JWT_SECRET=... -e ADMIN_PASSWORD=... aigency-os
# ────────────────────────────────────────────────────────────────────────────

# ─── Stage 1: Dependencies ─────────────────────────────────────────────────
FROM node:22-alpine AS deps

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json ./

# Copy all package.json files (needed for pnpm workspace resolution)
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/config/package.json ./packages/config/
COPY packages/infra/package.json ./packages/infra/
COPY packages/prisma/package.json ./packages/prisma/
COPY packages/redis/package.json ./packages/redis/
COPY packages/scripts/package.json ./packages/scripts/
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/ui/package.json ./packages/ui/
COPY apps/server/package.json ./apps/server/
COPY apps/web/package.json ./apps/web/
COPY apps/paperclip-api/package.json ./apps/paperclip-api/
COPY apps/bmad/package.json ./apps/bmad/
COPY apps/paul/package.json ./apps/paul/
COPY apps/gstack/package.json ./apps/gstack/
COPY apps/denchclaw/package.json ./apps/denchclaw/
COPY apps/hcom-api/package.json ./apps/hcom-api/
COPY apps/gbrain/package.json ./apps/gbrain/
COPY apps/aegis/package.json ./apps/aegis/
COPY apps/plannotator/package.json ./apps/plannotator/
COPY apps/skills/package.json ./apps/skills/
COPY apps/aegis-dashboard/package.json ./apps/aegis-dashboard/
COPY apps/bmad-dashboard/package.json ./apps/bmad-dashboard/
COPY apps/denchclaw-ui/package.json ./apps/denchclaw-ui/
COPY apps/embed-shell/package.json ./apps/embed-shell/
COPY apps/gbrain-dashboard/package.json ./apps/gbrain-dashboard/
COPY apps/hcom-dashboard/package.json ./apps/hcom-dashboard/
COPY apps/paperclip-ui/package.json ./apps/paperclip-ui/
COPY apps/plannotator-ui/package.json ./apps/plannotator-ui/

# Install all dependencies (layer cached if package.json files don't change)
RUN pnpm install --frozen-lockfile

# ─── Stage 2: Build ────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/turbo.json ./turbo.json

# Copy all package.json files (to maintain workspace structure)
COPY packages/*/package.json ./packages/*/
COPY apps/*/package.json ./apps/*/

# Copy all source code
COPY packages ./packages
COPY apps ./apps
COPY tsconfig.base.json ./tsconfig.base.json

# Build everything (turbo handles dependency order)
RUN pnpm build

# ─── Stage 3: Production ─────────────────────────────────────────────────────
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Runtime dependency for better-sqlite3 (used by some services)
RUN apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S aigency -u 1001

WORKDIR /app

# Copy package files for workspace resolution
COPY --from=builder --chown=aigency:nodejs /app/package.json ./package.json
COPY --from=builder --chown=aigency:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=aigency:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=aigency:nodejs /app/turbo.json ./turbo.json

# Copy all package.json files (needed for pnpm --prod to resolve)
COPY --from=builder --chown=aigency:nodejs /app/packages/api-client/package.json ./packages/api-client/package.json
COPY --from=builder --chown=aigency:nodejs /app/packages/config/package.json ./packages/config/package.json
COPY --from=builder --chown=aigency:nodejs /app/packages/infra/package.json ./packages/infra/package.json
COPY --from=builder --chown=aigency:nodejs /app/packages/prisma/package.json ./packages/prisma/package.json
COPY --from=builder --chown=aigency:nodejs /app/packages/redis/package.json ./packages/redis/package.json
COPY --from=builder --chown=aigency:nodejs /app/packages/scripts/package.json ./packages/scripts/package.json
COPY --from=builder --chown=aigency:nodejs /app/packages/shared-types/package.json ./packages/shared-types/package.json
COPY --from=builder --chown=aigency:nodejs /app/packages/ui/package.json ./packages/ui/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/paperclip-api/package.json ./apps/paperclip-api/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/bmad/package.json ./apps/bmad/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/paul/package.json ./apps/paul/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/gstack/package.json ./apps/gstack/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/denchclaw/package.json ./apps/denchclaw/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/hcom-api/package.json ./apps/hcom-api/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/gbrain/package.json ./apps/gbrain/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/aegis/package.json ./apps/aegis/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/plannotator/package.json ./apps/plannotator/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/skills/package.json ./apps/skills/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/aegis-dashboard/package.json ./apps/aegis-dashboard/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/bmad-dashboard/package.json ./apps/bmad-dashboard/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/denchclaw-ui/package.json ./apps/denchclaw-ui/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/embed-shell/package.json ./apps/embed-shell/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/gbrain-dashboard/package.json ./apps/gbrain-dashboard/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/hcom-dashboard/package.json ./apps/hcom-dashboard/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/paperclip-ui/package.json ./apps/paperclip-ui/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/plannotator-ui/package.json ./apps/plannotator-ui/package.json

# Copy built artifacts from all packages and apps
COPY --from=builder --chown=aigency:nodejs /app/packages/api-client/dist ./packages/api-client/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/config/dist ./packages/config/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/infra/dist ./packages/infra/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/prisma/dist ./packages/prisma/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/redis/dist ./packages/redis/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/scripts/dist ./packages/scripts/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/ui/dist ./packages/ui/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/web/dist ./apps/web/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/paperclip-api/dist ./apps/paperclip-api/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/bmad/dist ./apps/bmad/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/paul/dist ./apps/paul/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/gstack/dist ./apps/gstack/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/denchclaw/dist ./apps/denchclaw/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/hcom-api/dist ./apps/hcom-api/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/gbrain/dist ./apps/gbrain/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/aegis/dist ./apps/aegis/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/plannotator/dist ./apps/plannotator/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/skills/dist ./apps/skills/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/aegis-dashboard/dist ./apps/aegis-dashboard/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/bmad-dashboard/dist ./apps/bmad-dashboard/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/denchclaw-ui/dist ./apps/denchclaw-ui/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/embed-shell/dist ./apps/embed-shell/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/gbrain-dashboard/dist ./apps/gbrain-dashboard/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/hcom-dashboard/dist ./apps/hcom-dashboard/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/paperclip-ui/dist ./apps/paperclip-ui/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/plannotator-ui/dist ./apps/plannotator-ui/dist

# Copy the unified server entry point
COPY --from=builder --chown=aigency:nodejs /app/apps/server/unified-server.mjs ./apps/server/unified-server.mjs

# Install ONLY production dependencies
RUN pnpm install --frozen-lockfile --prod

# Create data directory for SQLite
RUN mkdir -p /data && chown -R aigency:nodejs /data

USER aigency

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV FRONTEND_PATH=/app/apps/web/dist
ENV AUTH_DB_PATH=/data/auth.db
ENV LOG_LEVEL=warn

# Limit Node.js heap to 256MB (for 512MB total VPS)
ENV NODE_OPTIONS=--max-old-space-size=256

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "apps/server/unified-server.mjs"]
