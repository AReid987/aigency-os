I have all the context I need. Let me write the Sprint 5 prompt for the Aigency
OS venture spec platform.

---

# HERMES WORKSPACE — SPRINT 5 ORCHESTRATION PROMPT

## CONTEXT

Sprints 1–4 are **COMPLETE**. The full 8-layer architecture is built, hardened,
and tagged as `v0.1.0`.

You are operating inside the **Turborepo monorepo** at:
`~/CODE/00_PROJECTS/00_APPS/venture-spec-platform`

The codebase contains **9 backend services, 7 frontend apps, and 4 shared
packages**, all running in production Docker Compose with nginx reverse proxy,
TLS, health checks, CI/CD, and full documentation.

**Git tags:** `sprint-1-foundation`, `sprint-2-business-spec-build`,
`sprint-3-quality-crm-brain`, `v0.1.0`

**Read the BACKLOG.md and focus on v0.2.0 capabilities: scale, intelligence, and
real-world robustness.**

---

## SPRINT 5 SCOPE — v0.2.0: SCALE, INTELLIGENCE, & REAL-WORLD ROBUSTNESS

Sprint 5 is the **first post-MVP sprint**. The goal is not to add new layers,
but to make the existing 8 layers **production-grade, intelligent, and
scalable**. This sprint addresses the gaps that block real-world usage by you
and your domain expert.

| Epic   | Name                      | Key Tasks              | Success Criteria                                                                                                     |
| ------ | ------------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **11** | Database Migration        | E11-T1 through E11-T6  | Migrate all 9 services from in-memory stores to PostgreSQL with Prisma ORM, zero data loss, rollback capability      |
| **12** | HCOM v2: Redis Streams    | E12-T1 through E12-T8  | Replace SQLite message bus with Redis Streams, add message persistence, delivery guarantees, horizontal scaling path |
| **13** | Gbrain Intelligence Layer | E13-T1 through E13-T10 | LLM-powered knowledge synthesis, automatic contradiction resolution, smart summaries, decision recommendations       |
| **14** | AEGIS Continuous Audit    | E14-T1 through E14-T8  | Real-time code quality monitoring, pre-commit hooks, automated remediation PRs, trend dashboards                     |
| **15** | Agent Skill Marketplace   | E15-T1 through E15-T8  | ClawHub integration: skill discovery, installation, validation, versioning, sandboxed execution                      |
| **16** | Mobile & Remote Access    | E16-T1 through E16-T6  | PWA for domain expert milestone approvals, amux mobile dashboard, Tailscale mesh networking                          |
| **17** | Analytics & Observability | E17-T1 through E17-E8  | Prometheus metrics, Grafana dashboards, distributed tracing, cost analytics per agent/venture                        |

---

## ASSUMPTIONS FROM SPRINTS 1–4

1. All 9 services start with
   `docker-compose -f infra/docker/docker-compose.yml up -d`
2. HCOM hooks are installed for all agents
3. `pnpm install` and `turbo run build` work at root in <5 minutes
4. Git `main` branch contains `v0.1.0` tag
5. All services have health checks at `/health`
6. nginx reverse proxy routes all traffic with TLS
7. Domain expert onboarding guide and technical founder runbook are complete
8. CI/CD pipeline runs on every push to `main`

---

## AGENT ROSTER & DELEGATION (10 PARALLEL AGENTS)

Spawn each agent in a dedicated Hermes Workspace pane. Every agent must run
inside an HCOM-wrapped session.

| Agent            | Model Source          | Budget                  | Epic     | Tasks                                                                                                             | Git Branch                      | Why This Agent                                  |
| ---------------- | --------------------- | ----------------------- | -------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------------------------------------------- |
| **Claude Code**  | freemodel.dev         | **$8/session hard cap** | E11      | Database migration: Prisma schema design, migration scripts, data seeding, rollback procedures                    | `feat/epic-11-postgres`         | Best at schema design + migration safety        |
| **Opencode Go**  | DeepSeek V4           | $5 plan (~$0.50/task)   | E12      | HCOM v2: Redis Streams integration, message persistence, delivery guarantee logic, consumer groups                | `feat/epic-12-hcom-v2`          | Cheap, good at streaming infrastructure         |
| **Kimi Code**    | $40 plan              | ~$2-3/task              | E13      | Gbrain intelligence: LLM synthesis engine, contradiction resolution, smart summary generation, recommendation API | `feat/epic-13-gbrain-llm`       | Strong at LLM orchestration + structured output |
| **OMP**          | Cerebras (free tier)  | Free                    | E14      | AEGIS continuous: real-time audit daemon, pre-commit hook integration, automated remediation PR generation        | `feat/epic-14-aegis-continuous` | Fast inference for daemon logic                 |
| **Mimo Code**    | $20 API + free tier   | Free tier first         | E15      | Skill marketplace: ClawHub API client, skill manifest parser, installation workflow, validation sandbox           | `feat/epic-15-skills`           | Free tier covers UI scaffolding                 |
| **Command Code** | $1 plan (DeepSeek V4) | ~$0.20/task             | E16      | Mobile access: PWA manifest, service workers, offline milestone approval, amux mobile API endpoints               | `feat/epic-16-mobile`           | Cheapest — perfect for mobile glue              |
| **Blackbox**     | Free tier             | Free                    | E17      | Observability: Prometheus metrics endpoints, Grafana dashboard JSON, distributed tracing middleware               | `feat/epic-17-observability`    | Good at metrics + dashboard config              |
| **Rovo Dev**     | GitHub Copilot        | Free (included)         | Shared   | Migration tests: database migration validation, data integrity checks, rollback tests, performance benchmarks     | `feat/sprint5-tests`            | IDE-native, excellent for test infrastructure   |
| **Groq API**     | Free tier             | Free                    | Overflow | Documentation: v0.2.0 changelog, migration guide, architecture updates, API versioning docs                       | `feat/sprint5-docs`             | Lightning fast for docs                         |
| **Mistral**      | Free tier             | Free                    | Overflow | Shared package updates: Prisma client types, Redis types, metrics types in `@aigency-os/shared-types`                   | `feat/sprint5-types`            | Solid for type definitions                      |

**Budget Safety Rules:**

- Claude Code (freemodel.dev): **Hard stop at $8.00/session.** If approaching,
  reassign to Opencode or Kimi.
- Kimi Code: Use for complex LLM orchestration only.
- Mimo Code: Exhaust free tier before touching the $20 API balance.
- All other agents: Use freely. No hard caps.
- Track approximate spend per agent in Hermes Dashboard kanban. Update every 15
  minutes.

---

## TURBOREPO RULES (Sprint 5)

1. **New packages allowed:** `@aigency-os/prisma` (shared Prisma client),
   `@aigency-os/redis` (shared Redis client).
2. **Workspace Protocol:** All new packages use
   `"@aigency-os/shared-types": "workspace:*"`.
3. **Pipeline:** Every new package must have `turbo.json` with `build`, `dev`,
   `lint`, `test`, `typecheck`, `db:migrate`, `db:seed`.
4. **Dependency Order:** `@aigency-os/prisma` must build before any service that uses
   it.
5. **Validation:** Before declaring any epic "done", run `turbo run build` at
   root. Zero errors.
6. **Database safety:** All migrations must be reversible. Never drop columns
   without backup.

---

## HCOM COMMUNICATION RULES (Sprint 5)

1. **Status Broadcasts:** Every agent must report status every 15 minutes:
   ```bash
   hcom broadcast "Claude: E11-T3 complete, moving to E11-T4. Budget: $3.20/$8.00"
   ```

2. **v0.1.0 Verification:** Agents must verify ALL v0.1.0 services are healthy
   before testing v0.2.0 code:
   ```bash
   ./infra/scripts/health-check.sh
   ```

3. **Collision Detection:** HCOM collision detection is ON. Escalate immediately
   if triggered.

4. **Hermes Monitoring:** You must monitor HCOM TUI and escalate blocked agents
   within 10 minutes.

5. **Database Coordination:** Only ONE agent may run migrations at a time. Use
   HCOM to coordinate:
   ```bash
   hcom broadcast "Claude: LOCKING database for migration E11-T3"
   hcom broadcast "Claude: UNLOCKING database, migration complete"
   ```

---

## MONOREPO STRUCTURE (Sprint 5 Additions)

```
venture-spec-platform/
├── apps/
│   ├── web/                    # [v0.1] — ADD: PWA manifest, offline BMC editing
│   ├── paperclip-ui/           # [v0.1] — ADD: cost analytics, venture performance charts
│   ├── plannotator-ui/         # [v0.1] — ADD: offline annotation draft, sync on reconnect
│   ├── hcom-dashboard/         # [v0.1] — ADD: Redis Streams metrics, message throughput
│   ├── aegis-dashboard/        # [v0.1] — ADD: continuous audit trend graphs, remediation history
│   ├── denchclaw-ui/           # [v0.1] — ADD: mobile-optimized pipeline view
│   ├── gbrain-dashboard/       # [v0.1] — ADD: LLM synthesis panel, recommendation cards
│   └── embed-shell/            # [v0.1] — POLISH: faster iframe loading, sandbox hardening
├── packages/
│   ├── shared-types/           # [v0.1] — ADD: Prisma, Redis, metrics, skill types
│   ├── api-client/             # [v0.1] — ADD: Prisma query helpers, Redis pub/sub client
│   ├── ui/                     # [v0.1] — ADD: analytics charts, mobile components
│   ├── config/                 # [v0.1] — no changes
│   ├── prisma/                 # [NEW] Shared Prisma schema + client
│   │   ├── schema.prisma       # Unified schema for all 9 services
│   │   ├── migrations/         # Migration files
│   │   └── seed.ts             # Seed data for development
│   └── redis/                  # [NEW] Shared Redis client + stream helpers
│       ├── client.ts           # ioredis client factory
│       └── streams.ts          # Redis Streams pub/sub helpers
├── services/
│   ├── agor/                   # [v0.1] — MIGRATE: PostgreSQL persistence, Redis cache
│   ├── paperclip-api/          # [v0.1] — MIGRATE: PostgreSQL + Prisma, add analytics
│   ├── bmad/                   # [v0.1] — MIGRATE: PostgreSQL, add trend data
│   ├── paul/                   # [v0.1] — MIGRATE: PostgreSQL, add plan versioning
│   ├── carl/                   # [v0.1] — MIGRATE: PostgreSQL, add rule analytics
│   ├── plannotator/            # [v0.1] — MIGRATE: PostgreSQL, add offline sync
│   ├── gstack/                 # [v0.1] — MIGRATE: PostgreSQL, add build metrics
│   ├── aegis/                  # [v0.1] — MIGRATE: PostgreSQL, add continuous audit daemon
│   ├── denchclaw/              # [v0.1] — MIGRATE: PostgreSQL (retain DuckDB for local-first)
│   ├── gbrain/                 # [v0.1] — MIGRATE: PostgreSQL + pgvector, add LLM synthesis
│   ├── hcom-api/               # [v0.1] — MIGRATE: Redis Streams, retain SQLite for fallback
│   └── hcom/                   # [external] — NO TOUCH (Rust binary)
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml  # [v0.1] — ADD: Redis, Grafana, Prometheus
│   ├── nginx/
│   │   └── nginx.conf          # [v0.1] — ADD: rate limiting by IP, WebSocket upgrade rules
│   ├── scripts/
│   │   ├── health-check.sh     # [v0.1] — UPDATE: check Redis, Prometheus
│   │   ├── backup.sh           # [v0.1] — UPDATE: PostgreSQL pg_dump, Redis RDB
│   │   ├── restore.sh          # [v0.1] — UPDATE: PostgreSQL restore, Redis restore
│   │   └── migrate.sh          # [NEW] Database migration runner with rollback
│   └── monitoring/
│       ├── prometheus.yml        # [NEW] Prometheus scrape config
│       └── grafana-dashboards/ # [NEW] JSON dashboard definitions
├── docs/                       # [v0.1] — ADD: v0.2.0 migration guide, API changelog
├── tests/                      # [v0.1] — ADD: migration tests, load tests
├── CHANGELOG.md                # [v0.1] — UPDATE: v0.2.0 release notes
└── turbo.json                  # [v0.1] — ADD: db:migrate, db:seed, db:rollback tasks
```

---

## TECH STACK PER EPIC

### Epic 11: Database Migration (Claude)

- **Prisma:** Unified schema across all 9 services with multi-schema support
- **Migration Strategy:** `prisma migrate dev` for development,
  `prisma migrate deploy` for production
- **Data Migration:** Seed scripts that populate PostgreSQL from existing
  in-memory state
- **Rollback:** Every migration has a down script. `pnpm db:rollback` reverses
  last migration.
- **Performance:** Connection pooling via PgBouncer, read replicas for Gbrain
  queries

### Epic 12: HCOM v2 (Opencode)

- **Redis Streams:** Replace SQLite pub/sub with `XADD`/`XREADGROUP` for message
  bus
- **Persistence:** Messages retained for 7 days in Redis, archived to PostgreSQL
- **Delivery Guarantees:** At-least-once delivery with consumer groups and ACK
  tracking
- **Horizontal Scaling:** Multiple HCOM API instances can read from same Redis
  Streams
- **Fallback:** SQLite mode remains for single-machine deployments without Redis

### Epic 13: Gbrain Intelligence (Kimi)

- **LLM Synthesis:** OpenAI/Anthropic API calls to summarize knowledge pages,
  detect contradictions
- **Smart Summaries:** Auto-generated "What happened this week" reports for
  domain experts
- **Decision Recommendations:** "Based on past decisions, we recommend..."
  suggestions
- **Contradiction Resolution:** LLM-mediated merging of conflicting knowledge
  pages
- **Confidence Evolution:** Track how confidence scores change over time, flag
  decaying knowledge

### Epic 14: AEGIS Continuous (OMP)

- **Daemon Mode:** `aegis --watch` runs continuously, monitoring codebase for
  quality regressions
- **Pre-commit Hooks:** `aegis-check` runs before every git commit, blocks on
  critical findings
- **Automated Remediation:** AEGIS Transform generates PRs with fixes for
  approved findings
- **Trend Dashboard:** Track code quality over time — are we getting better or
  worse?
- **Integration:** GitHub Actions runs AEGIS on every PR, posts findings as PR
  comments

### Epic 15: Skill Marketplace (Mimo)

- **ClawHub API:** Query skills.sh for available skills, versions, ratings
- **Manifest Parser:** Validate `skill.json` schema before installation
- **Installation Flow:** One-click skill install with dependency resolution
- **Validation Sandbox:** Dry-run skill execution in isolated environment before
  production
- **Versioning:** Pin skill versions, auto-update with approval, rollback on
  failure

### Epic 16: Mobile & Remote (Command)

- **PWA:** Service workers for offline canvas editing, background sync for
  annotations
- **amux Mobile:** REST API endpoints for session status, agent control from
  phone
- **Tailscale:** Optional mesh networking for remote access without public VPS
- **Push Notifications:** Milestone gate alerts sent to domain expert's phone

### Epic 17: Observability (Blackbox)

- **Prometheus:** Metrics endpoints on all 9 services (request count, latency,
  errors, agent budget)
- **Grafana:** Pre-built dashboards for service health, agent performance,
  venture progress
- **Distributed Tracing:** OpenTelemetry spans across service boundaries (Agor →
  Paperclip → HCOM → Gstack)
- **Cost Analytics:** Per-agent token spend visualization, per-venture total
  cost tracking
- **Alerting:** Prometheus Alertmanager for budget overruns, service downtime,
  quality regressions

---

## SHARED PACKAGES (Mistral + Rovo)

### `@aigency-os/shared-types` (Mistral)

Add these types to `packages/shared-types/src/`:

- `prisma.ts` — Prisma model type exports (generated)
- `redis.ts` — Redis Streams message types, consumer group types
- `metrics.ts` — Prometheus metric types, Grafana panel types
- `skills.ts` — SkillManifest, SkillVersion, SkillRating, SkillInstallation
- `mobile.ts` — PushNotification, OfflineSync, PWAEvent
- Update `index.ts` to re-export all

### `@aigency-os/prisma` (NEW — Claude)

- `schema.prisma` — Unified database schema with `@@schema` annotations per
  service
- `client.ts` — Prisma client singleton with connection pooling
- `migrate.ts` — Migration runner script
- `seed.ts` — Development seed data

### `@aigency-os/redis` (NEW — Opencode)

- `client.ts` — ioredis client factory with cluster support
- `streams.ts` — `XADD`, `XREADGROUP`, `XACK` wrappers with TypeScript types
- `pubsub.ts` — Legacy pub/sub fallback for simple use cases

### `@aigency-os/api-client` (Rovo)

Add these clients to `packages/api-client/src/`:

- `prisma.ts` — Prisma query helpers for frontend data fetching
- `redis.ts` — Redis pub/sub client for real-time features
- `metrics.ts` — Prometheus query client for Grafana data
- `skills.ts` — ClawHub API client for skill marketplace
- Tests for all new clients using Vitest + MSW

---

## DOCKER COMPOSE (Claude + Opencode + Blackbox)

Update `infra/docker/docker-compose.yml` to add:

- **redis** — Redis 7 with Streams enabled, persistent volume
- **prometheus** — Prometheus 2.x with scrape config
- **grafana** — Grafana 10.x with pre-loaded dashboards
- **pgbouncer** — Connection pooler for PostgreSQL (optional, performance)

All services must:

- Connect to PostgreSQL via `@aigency-os/prisma`
- Connect to Redis via `@aigency-os/redis`
- Expose Prometheus metrics at `/metrics`
- Use internal Docker network for service-to-service
- Health checks include database connectivity

Validate: `docker-compose -f infra/docker/docker-compose.yml up -d` starts ALL
services + infrastructure in <90 seconds.

---

## DEFINITION OF DONE (Per Task)

Every task must satisfy ALL of these before moving to "Done":

- [ ] Code written and committed to git with conventional commit message
- [ ] Unit tests passing (coverage > 80% for shared packages, > 60% for apps)
- [ ] Integration tests passing for all cross-service flows
- [ ] TypeScript compiles with `tsc --noEmit` (zero errors, zero warnings)
- [ ] Lint passes with `eslint` (zero errors)
- [ ] Database migration tested: up + down + re-up
- [ ] Manual QA: feature works in production-like environment
- [ ] Committed to the correct git branch (not main)
- [ ] Hermes Dashboard kanban updated: task moved to "Done"
- [ ] HCOM broadcast sent: "[Agent]: [Task-ID] done"
- [ ] **Migration safety verified:** Rollback tested, no data loss

---

## PROCESS INSTRUCTIONS

1. **Read Phase (10 minutes):**
   - Read BACKLOG.md Epics 11–17
   - Review ALL existing v0.1.0 code in `apps/`, `services/`, `packages/`
   - Identify which services need PostgreSQL first (hint: Paperclip and Gbrain
     are highest priority)

2. **Setup Phase (15 minutes):**
   - Open Hermes Dashboard → Create Sprint 5 kanban board
   - Run `git checkout main && git pull` to get latest v0.1.0 code
   - Run `pnpm install` at root
   - Run `docker-compose -f infra/docker/docker-compose.yml up -d` to verify
     v0.1.0 services
   - Run `./infra/scripts/health-check.sh` — all 9 must pass
   - Spawn all 10 agents in Hermes Workspace panes

3. **Delegation Phase (10 minutes):**
   - Assign tasks to agents via HCOM broadcast
   - Each agent checks out its own branch: `git checkout -b feat/epic-XX-name`
   - **CRITICAL ORDER:** Mistral (types) → Claude (Prisma schema) → All other
     agents
   - Wait for `@aigency-os/prisma` package before any service migration begins

4. **Execution Phase (Ongoing):**
   - Monitor HCOM TUI every 15 minutes
   - Monitor Hermes Dashboard kanban every 15 minutes
   - Track agent budgets in Dashboard
   - If any agent is blocked for >10 minutes, escalate to me immediately
   - If Claude approaches $8.00, PAUSE and reassign

5. **Database Migration Phase (Critical):**
   - Claude designs unified Prisma schema first
   - Rovo writes migration tests before any migration runs
   - ONE service at a time: migrate → test → validate → next service
   - Order: Paperclip → Gbrain → AEGIS → DenchClaw → BMAD → PAUL → Plannotator →
     Gstack → Agor → HCOM
   - Each migration must pass: `pnpm db:migrate` → verify data →
     `pnpm db:rollback` → verify empty → `pnpm db:migrate` → verify restored

6. **Integration Phase (Critical for Sprint 5):**
   - After each epic completes, verify cross-epic integration:
     - PostgreSQL data appears in Grafana dashboards
     - Redis Streams messages are visible in HCOM Dashboard
     - Gbrain LLM synthesis uses migrated PostgreSQL data
     - AEGIS continuous audit reads from PostgreSQL
     - Mobile PWA can approve milestones stored in PostgreSQL
   - Run `turbo run lint typecheck test build` at root
   - Run full docker-compose and verify all services + infrastructure healthy

7. **Validation Phase (End of Sprint):**
   - Run `turbo run lint typecheck test build` at root — must pass with zero
     errors in <5 minutes
   - Run `docker-compose -f infra/docker/docker-compose.yml up -d` — must start
     ALL services + Redis + Prometheus + Grafana in <90 seconds
   - Run `./infra/scripts/health-check.sh` — all services + infrastructure
     report healthy
   - Run `pnpm audit` — zero high-severity vulnerabilities
   - Run database migration test suite — all migrations reversible
   - Run load test: 100 concurrent canvas users, 50 parallel agents
   - Verify: Grafana dashboard shows metrics for all 9 services
   - Verify: Redis Streams delivers messages with <10ms latency
   - Verify: Gbrain LLM synthesis produces coherent summary from real data
   - Verify: AEGIS continuous audit detects a deliberate quality regression
   - Verify: Mobile PWA loads offline and syncs annotations on reconnect
   - Merge all feature branches to main via PRs
   - Tag:
     `git tag -a v0.2.0 -m "v0.2.0 — Scale, Intelligence, and Real-World Robustness"`

8. **Reporting Phase:**
   - Generate Sprint 5 summary report:
     - Tasks completed vs. planned
     - Agent budget spend per agent (total across all 5 sprints)
     - Migration statistics: tables, rows, migration time
     - Performance benchmarks: API latency, canvas FPS, query times
     - Security audit results
     - Known limitations and v0.3 roadmap

---

## CONSTRAINTS & GUARDRAILS

1. **No Breaking Changes:** v0.2.0 must be backward-compatible with v0.1.0 data
   and APIs. Deprecate, don't delete.

2. **Database Safety:** NEVER run a migration without a rollback test. NEVER
   modify a migration after it has been applied to another agent's environment.

3. **Git Discipline:** Every agent works in its own branch. No direct commits to
   main. Merge only after full validation.

4. **Production Readiness:** By the end of Sprint 5, the platform must handle
   100+ ventures, 50+ concurrent agents, and survive a single service restart
   without data loss.

5. **Security First:** No API keys in code. All secrets in `.env`.
   `.env.example` committed. `.env.local` in `.gitignore`.

6. **Performance Budget:** Canvas 60fps with 500+ cards. APIs <100ms p95. Gbrain
   queries <300ms. Redis Streams <10ms. PostgreSQL queries <50ms.

7. **Documentation Complete:** v0.2.0 migration guide must allow a v0.1.0 user
   to upgrade in <30 minutes.

8. **Observability:** If a service fails in production, you must be able to
   diagnose the root cause in <5 minutes using Grafana + logs.

---

## IMMEDIATE FIRST ACTIONS

Execute these in order before delegating to other agents:

1. `git checkout main && git pull` — Get latest v0.1.0 code
2. `git log --oneline --grep="v0.1.0"` — Verify v0.1.0 tag exists
3. `pnpm install` — Install any new root dependencies
4. `turbo run build` — Verify v0.1.0 builds cleanly in <5 minutes
5. `docker-compose -f infra/docker/docker-compose.yml up -d` — Start v0.1.0
   services
6. `./infra/scripts/health-check.sh` — Verify all 9 services healthy
7. `hcom --version` — Verify HCOM
8. Open Hermes Dashboard → Create Sprint 5 kanban board
9. `git checkout -b feat/sprint5-types` — Mistral starts here (types FIRST)
10. Send HCOM broadcast: "All agents report in. Sprint 5 — v0.2.0 — begins.
    Confirm your epic assignment and branch."

---

## SUCCESS CRITERIA FOR SPRINT 5 (v0.2.0 SHIP)

When I run these commands from the monorepo root, everything must pass:

```bash
# 1. Monorepo builds cleanly and fast (<5 min)
pnpm install && turbo run lint typecheck test build

# 2. All services + infrastructure start in <90 seconds
docker-compose -f infra/docker/docker-compose.yml up -d

# 3. Health check passes on all services + infrastructure
./infra/scripts/health-check.sh
# → All 9 services + Redis + Prometheus + Grafana report "healthy"

# 4. Database migrations are reversible
cd packages/prisma && pnpm db:migrate && pnpm db:rollback && pnpm db:migrate
# → All pass with zero errors

# 5. Redis Streams message delivery
redis-cli XADD hcom:messages '*' from "test" to "test" type "test" payload "hello"
# → Message appears in HCOM Dashboard within 10ms

# 6. Grafana dashboards show live metrics
curl -s http://localhost:3009/api/dashboards/uid/aigency-overview
# → Returns dashboard JSON with metrics for all 9 services

# 7. Gbrain LLM synthesis works
curl -X POST http://localhost:3016/api/v1/synthesize \
  -H "Content-Type: application/json" \
  -d '{"ventureId": "venture-001", "period": "last-7-days"}'
# → Returns coherent summary with key decisions and recommendations

# 8. AEGIS continuous audit detects regression
# (Deliberately introduce a bug in a test service)
curl -X POST http://localhost:3014/api/v1/audit/continuous \
  -H "Content-Type: application/json" \
  -d '{"target": "test-service", "trigger": "code-change"}'
# → Returns findings within 30 seconds

# 9. Mobile PWA loads offline
# (Open http://localhost:3000 in Chrome, enable offline, refresh)
# → Canvas renders with cached data, annotations sync on reconnect

# 10. Load test passes
./tests/perf/load-test.sh
# → 100 concurrent canvas users, 50 parallel agents, 0 errors, <200ms p95

# 11. Security audit passes
pnpm audit
# → Zero high-severity vulnerabilities
grep -r "sk-" --include="*.ts" --include="*.tsx" --include="*.js" . || echo "No secrets found"
# → Exit 0 (no matches)

# 12. Git tag exists
git tag | grep "v0.2.0"
# → v0.2.0

# 13. CHANGELOG updated
cat CHANGELOG.md | head -30
# → v0.2.0 release notes with all 5 sprint summaries
```

If all 13 pass, **v0.2.0 is shipped**. Tag it, celebrate, and report to me.

---

_Execute now. This is the scale sprint._

