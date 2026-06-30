# Changelog

All notable changes to Aigency OS are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.0] — 2026-06-26

### Scale, Intelligence, and Real-World Robustness

Sprint 5 transforms Aigency OS from a working MVP into a production-grade platform with database persistence, intelligent knowledge synthesis, continuous quality monitoring, and observability.

### Added

**New Packages:**
- `@aigency-os/prisma` — Shared Prisma schema with unified models for all 9 services, PostgreSQL provider, migration runner, seed data
- `@aigency-os/redis` — Shared Redis client with ioredis, Redis Streams helpers (XADD/XREADGROUP/XACK), pub/sub fallback

**New Service:**
- `services/skills` (port 3017) — Agent skill marketplace with skill discovery, installation, validation, and rating

**Infrastructure:**
- Prometheus metrics endpoints on all services (`/metrics`)
- Grafana dashboard with service health, request rate, error rate, latency panels
- PWA manifest and service worker for offline canvas editing
- Prometheus scrape config (`infra/monitoring/prometheus.yml`)
- Grafana dashboard JSON (`infra/monitoring/grafana-dashboards/`)

**Service Enhancements:**
- Gbrain: LLM synthesis endpoint (`POST /api/v1/synthesize`) for knowledge summaries
- AEGIS: Continuous audit endpoint (`POST /api/v1/audit/continuous`) for real-time monitoring
- All services: Prometheus-format metrics at `/metrics`

**Shared Types:**
- `metrics.ts` — MetricPoint, MetricSeries, DashboardPanel, AlertRule
- `skills.ts` — SkillManifest, SkillVersion, SkillInstallation
- `mobile.ts` — PushNotification, OfflineSync, PWAConfig
- `redis.ts` — StreamMessage, ConsumerGroup, StreamConfig

**Documentation:**
- v0.2.0 migration guide
- Sprint 5 implementation plan

---

## [0.1.0] — 2026-06-26

**Initial release of Aigency OS.** A visual-first, agent-orchestrated platform for collaborative venture building.

### Sprint 1: Foundation (Weeks 1–2)

#### Added
- **Agor Canvas** (`apps/web`) — Multiplayer visual workspace with infinite canvas, card drag-and-drop, and real-time collaboration via WebSocket
- **Paperclip API** (`services/paperclip-api`) — Venture org chart service with agent management, budget tracking, and REST/WS APIs
- **Paperclip UI** (`apps/paperclip-ui`) — Dashboard for managing ventures, agents, and budgets
- **HCOM API** (`services/hcom-api`) — Cross-agent message bus implementing the HCOM protocol for agent lifecycle and communication
- **HCOM Dashboard** (`apps/hcom-dashboard`) — Real-time agent message monitor
- **Embed Shell** (`apps/embed-shell`) — Micro-frontend iframe sandbox for embedding service UIs into the canvas
- **Turborepo monorepo** — Project scaffolding with pnpm workspaces, Turborepo pipeline, and shared configuration
- **Shared packages** — `@aigency/shared-types`, `@aigency/api-client`, `@aigency/ui`, `@aigency/config`

### Sprint 2: Business + Spec (Weeks 3–4)

#### Added
- **BMAD Service** (`services/bmad`) — Business Model Analysis & Design agent for generating and analyzing Business Model Canvases
- **PAUL Service** (`services/paul`) — Plan Underwriting & Layout agent for creating detailed project plans and specifications
- **Gstack Service** (`services/gstack`) — Growth stack analysis agent for evaluating go-to-market strategies
- **Plannotator Service** (`services/plannotator`) — Plan orchestration service managing plan lifecycle, milestones, and approvals
- **Plannotator UI** (`apps/plannotator-ui`) — Plan viewer with milestone gates, timeline visualization, and approval workflows
- **Business Model Canvas** — Drag-and-drop BMC card on Agor Canvas with 9-section visual editor
- **Revenue Calculator** — Financial projection tool integrated into the BMC with real-time scenario modeling

### Sprint 3: Quality + CRM + Brain (Weeks 5–6)

#### Added
- **AEGIS Service** (`services/aegis`) — AI Evaluation & Governance Intelligence System for automated quality audits
- **AEGIS Dashboard** (`apps/aegis-dashboard`) — Audit report viewer with scoring, findings, and recommendation workflows
- **DenchClaw Service** (`services/denchclaw`) — CRM data service for customer, lead, and interaction management
- **DenchClaw UI** (`apps/denchclaw-ui`) — Customer relationship management interface with pipeline view
- **Gbrain Service** (`services/gbrain`) — Knowledge graph service with search, document storage, and natural language Q&A
- **Gbrain Dashboard** (`apps/gbrain-dashboard`) — Knowledge explorer with graph visualization and search
- **Milestone Gates** — Domain expert approval checkpoints in the venture lifecycle

### Sprint 4: Deployment + Polish (Weeks 7–8)

#### Added
- **Docker Compose** — Infrastructure-as-code for PostgreSQL 16 and Redis 7
- **Nginx reverse proxy** configuration for production deployments
- **CI/CD pipeline** — GitHub Actions workflow for lint, test, typecheck, and build
- **Documentation suite:**
  - `docs/ONBOARDING.md` — Domain expert onboarding guide
  - `docs/RUNBOOK.md` — Technical founder runbook
  - `docs/ADR-001-turborepo.md` — Turborepo architecture decision record
  - `docs/ADR-002-hcom.md` — HCOM protocol decision record
  - `docs/ADR-003-in-memory-stores.md` — In-memory stores decision record
- **Type checking** across all packages (`pnpm typecheck`)
- **Test suite** for all services and packages (`pnpm test`)

---

### Component Inventory

#### Services (9)

| # | Service | Port | Description |
|---|---------|------|-------------|
| 1 | `paperclip-api` | 3001 | Venture org chart, agents, budgets |
| 2 | `hcom-api` | 3007 | Cross-agent message bus |
| 3 | `bmad` | 3010 | Business Model Analysis & Design |
| 4 | `paul` | 3011 | Plan Underwriting & Layout |
| 5 | `gstack` | 3012 | Growth stack analysis |
| 6 | `plannotator` | 3013 | Plan orchestration |
| 7 | `aegis` | 3014 | Audit & governance |
| 8 | `denchclaw` | 3015 | CRM data service |
| 9 | `gbrain` | 3016 | Knowledge graph |

#### Apps (7)

| # | App | Port | Description |
|---|-----|------|-------------|
| 1 | `web` (Agor Canvas) | 3000 | Main visual workspace |
| 2 | `paperclip-ui` | 3002 | Paperclip dashboard |
| 3 | `plannotator-ui` | 3003 | Plan viewer |
| 4 | `embed-shell` | 3003 | Micro-frontend sandbox |
| 5 | `hcom-dashboard` | 3005 | Agent message monitor |
| 6 | `aegis-dashboard` | 3007 | Audit report viewer |
| 7 | `gbrain-dashboard` | 3008 | Knowledge explorer |
| 8 | `denchclaw-ui` | 3100 | CRM interface |

#### Packages (4)

| # | Package | Description |
|---|---------|-------------|
| 1 | `@aigency/shared-types` | TypeScript interfaces and types |
| 2 | `@aigency/api-client` | HTTP/WebSocket fetch wrappers |
| 3 | `@aigency/ui` | Shared React components |
| 4 | `@aigency/config` | ESLint, Prettier, TSConfig presets |

### Tech Stack

- **Frontend:** React 19, TypeScript 5.5+, Vite 6, Tailwind CSS 4, Zustand 5, TanStack Query 5
- **Backend:** Fastify 5, better-sqlite3, Zod validation
- **Monorepo:** Turborepo 2.5+, pnpm 9.15 workspaces
- **Real-time:** Socket.io WebSocket
- **Infrastructure:** PostgreSQL 16, Redis 7, Docker

### Known Limitations

- **In-memory data stores** — All services use in-memory storage (Map/SQLite). Data is lost on service restart. PostgreSQL migration planned for v0.2.0.
- **No authentication** — All endpoints are open. OAuth/JWT authentication planned for v0.2.0.
- **Single-user mode** — Multiplayer collaboration infrastructure exists but is not fully tested.
- **No persistent agent state** — Agents restart from scratch on service reboot. Persistent agent memory planned for v0.2.0.
- **Port conflicts** — `embed-shell` and `plannotator-ui` share port 3003; `aegis-dashboard` and `hcom-api` share port 3007. Run only one at a time or override with `PORT` env var.
- **No production deployment** — Docker Compose is for local development only. Production deployment (Kubernetes, managed databases) planned for v0.2.0.
- **Limited error recovery** — Agent error handling is basic. Circuit breakers and retry logic planned for v0.2.0.
