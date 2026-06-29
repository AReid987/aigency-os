# ─── Aigency OS — Production Dockerfile ──────────────────────────────────────
# Multi-stage build for Node.js 22 + pnpm + Turborepo monorepo
# Serves API + static frontend from a single process
#
# Build:  docker build -t aigency-os .
# Run:    docker run -p 3001:3001 -e JWT_SECRET=... -e ADMIN_PASSWORD=... aigency-os

# ─── Stage 1: Dependencies ───────────────────────────────────────────────────
FROM node:22-alpine AS deps

# Install pnpm via corepack
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy workspace configuration first (for layer caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy all workspace package.json files (needed for pnpm to resolve workspace deps)
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/config/package.json ./packages/config/
COPY packages/prisma/package.json ./packages/prisma/
COPY packages/redis/package.json ./packages/redis/
COPY services/paperclip-api/package.json ./services/paperclip-api/
COPY services/hcom-api/package.json ./services/hcom-api/
COPY services/bmad/package.json ./services/bmad/
COPY services/paul/package.json ./services/paul/
COPY services/gstack/package.json ./services/gstack/
COPY services/plannotator/package.json ./services/plannotator/
COPY services/aegis/package.json ./services/aegis/
COPY services/denchclaw/package.json ./services/denchclaw/
COPY services/gbrain/package.json ./services/gbrain/
COPY services/skills/package.json ./services/skills/
COPY apps/web/package.json ./apps/web/
COPY apps/paperclip-ui/package.json ./apps/paperclip-ui/
COPY apps/hcom-dashboard/package.json ./apps/hcom-dashboard/
COPY apps/denchclaw-ui/package.json ./apps/denchclaw-ui/
COPY apps/gbrain-dashboard/package.json ./apps/gbrain-dashboard/
COPY apps/aegis-dashboard/package.json ./apps/aegis-dashboard/
COPY apps/plannotator-ui/package.json ./apps/plannotator-ui/
COPY apps/embed-shell/package.json ./apps/embed-shell/

# Install dependencies (layer cached if package.json files don't change)
RUN pnpm install --frozen-lockfile

# ─── Stage 2: Build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# Copy installed dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Copy all workspace package.json files (to maintain workspace structure)
COPY packages/shared-types/package.json ./packages/shared-types/
COPY packages/ui/package.json ./packages/ui/
COPY packages/api-client/package.json ./packages/api-client/
COPY packages/config/package.json ./packages/config/
COPY packages/prisma/package.json ./packages/prisma/
COPY packages/redis/package.json ./packages/redis/
COPY services/paperclip-api/package.json ./services/paperclip-api/
COPY apps/web/package.json ./apps/web/
COPY apps/web/vite.config.ts ./apps/web/vite.config.ts
COPY apps/web/tsconfig.json ./apps/web/tsconfig.json
COPY apps/web/index.html ./apps/web/index.html
COPY tsconfig.base.json ./tsconfig.base.json
COPY turbo.json ./turbo.json

# Copy source code
COPY packages/shared-types/src ./packages/shared-types/src
COPY packages/shared-types/tsconfig.json ./packages/shared-types/tsconfig.json
COPY packages/ui/src ./packages/ui/src
COPY packages/ui/tsconfig.json ./packages/ui/tsconfig.json
COPY packages/api-client/src ./packages/api-client/src
COPY packages/api-client/tsconfig.json ./packages/api-client/tsconfig.json
COPY services/paperclip-api/src ./services/paperclip-api/src
COPY services/paperclip-api/tsconfig.json ./services/paperclip-api/tsconfig.json
COPY apps/web/src ./apps/web/src
COPY apps/web/public ./apps/web/public
COPY apps/web/index.html ./apps/web/index.html
COPY apps/web/vite.config.ts ./apps/web/vite.config.ts
COPY apps/web/tsconfig.json ./apps/web/tsconfig.json
COPY apps/web/tsconfig.app.json ./apps/web/tsconfig.app.json
COPY apps/web/tsconfig.node.json ./apps/web/tsconfig.node.json

# Build packages in dependency order
RUN pnpm --filter @vscp/shared-types build
RUN pnpm --filter @vscp/ui build
RUN pnpm --filter @vscp/api-client build
RUN pnpm --filter @vscp/paperclip-api build
RUN pnpm --filter @vscp/web build

# ─── Stage 3: Production ─────────────────────────────────────────────────────
FROM node:22-alpine AS production

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install runtime dependencies for native modules (better-sqlite3)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S aigency -u 1001

# Copy built artifacts and package files
COPY --from=builder --chown=aigency:nodejs /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/shared-types/package.json ./packages/shared-types/package.json
COPY --from=builder --chown=aigency:nodejs /app/packages/ui/dist ./packages/ui/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/ui/package.json ./packages/ui/package.json
COPY --from=builder --chown=aigency:nodejs /app/packages/ui/src/styles ./packages/ui/src/styles
COPY --from=builder --chown=aigency:nodejs /app/packages/api-client/dist ./packages/api-client/dist
COPY --from=builder --chown=aigency:nodejs /app/packages/api-client/package.json ./packages/api-client/package.json
COPY --from=builder --chown=aigency:nodejs /app/services/paperclip-api/dist ./services/paperclip-api/dist
COPY --from=builder --chown=aigency:nodejs /app/services/paperclip-api/package.json ./services/paperclip-api/package.json
COPY --from=builder --chown=aigency:nodejs /app/apps/web/dist ./apps/web/dist
COPY --from=builder --chown=aigency:nodejs /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder --chown=aigency:nodejs /app/package.json ./package.json
COPY --from=builder --chown=aigency:nodejs /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder --chown=aigency:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=aigency:nodejs /app/tsconfig.base.json ./tsconfig.base.json

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Create data directory for SQLite (with proper permissions)
RUN mkdir -p /data && chown -R aigency:nodejs /data

# Switch to non-root user
USER aigency

# Environment defaults
ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV FRONTEND_PATH=/app/apps/web/dist
ENV AUTH_DB_PATH=/data/auth.db

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start production server
CMD ["node", "services/paperclip-api/dist/server.js"]
