# ─── Aigency OS — Single-Stage Dockerfile ────────────────────────────────────
# Simplified build: one stage, everything in one place.
# pnpm workspace symlinks are created correctly because the full source exists.
#
# Build:  docker build -t aigency-os .
# Run:    docker run -p 3001:3001 -e JWT_SECRET=... -e ADMIN_PASSWORD=... aigency-os
# ────────────────────────────────────────────────────────────────────────────

FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy everything (workspace config, source, lockfile)
COPY . .

# Install all dependencies (creates workspace symlinks correctly)
RUN pnpm install --frozen-lockfile

# Delete stale tsbuildinfo files to force tsc to emit
RUN find . -name "*.tsbuildinfo" -type f -delete \
    && find apps \( -path '*/src/*.js' -o -path '*/src/*.js.map' -o -path '*/src/*.d.ts' -o -path '*/src/*.d.ts.map' \) -not -name 'declarations.d.ts' -not -name 'vite-env.d.ts' -delete

# Build everything in dependency order
RUN pnpm build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S aigency -u 1001
RUN chown -R aigency:nodejs /app

USER aigency

ENV NODE_ENV=production
ENV PORT=3001
ENV HOST=0.0.0.0
ENV FRONTEND_PATH=/app/apps/web/dist
ENV AUTH_DB_PATH=/data/auth.db
ENV LOG_LEVEL=warn
ENV NODE_OPTIONS=--max-old-space-size=256

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

CMD ["node", "apps/server/unified-server.mjs"]
