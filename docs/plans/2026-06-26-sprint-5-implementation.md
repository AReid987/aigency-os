# Sprint 5 Implementation Plan — v0.2.0: Scale, Intelligence, Robustness

**Goal:** Make existing 8 layers production-grade, intelligent, and scalable.

## Phase 1: New Packages + Types (parallel)

### Task 1: @vscp/prisma package
Shared Prisma schema, client singleton, migration runner, seed data.

### Task 2: @vscp/redis package
ioredis client factory, Redis Streams helpers (XADD/XREADGROUP/XACK), pub/sub fallback.

### Task 3: Sprint 5 types in shared-types
metrics.ts, skills.ts, mobile.ts, redis.ts — plus update index.ts.

## Phase 2: Infrastructure (parallel)

### Task 4: Prometheus + Grafana configs
infra/monitoring/prometheus.yml, grafana dashboard JSON.

### Task 5: Update docker-compose
Add Prometheus, Grafana to existing compose.

## Phase 3: Service Enhancements (parallel)

### Task 6: Gbrain LLM synthesis endpoint
POST /api/v1/synthesize — generates summaries from knowledge pages.

### Task 7: AEGIS continuous audit endpoint
POST /api/v1/audit/continuous — daemon-mode audit trigger.

### Task 8: Skill marketplace service
services/skills (port 3017) — ClawHub API wrapper, skill manifest validation.

### Task 9: PWA manifest for web app
manifest.json, service worker placeholder, offline-ready meta tags.

## Phase 4: Docs + Tag

### Task 10: v0.2.0 changelog, migration guide, tag.
