# HERMES WORKSPACE — SPRINT 4 ORCHESTRATION PROMPT

## CONTEXT

Sprints 1, 2, and 3 are **COMPLETE**. The full 8-layer architecture is built.

You are operating inside the **Turborepo monorepo** at:
`~/CODE/00_PROJECTS/00_APPS/venture-spec-platform`

The codebase now contains **9 services, 7 apps, and 4 shared packages**:

**From Sprint 1 (Foundation):**
- `apps/web` — Agor canvas with pan, zoom, drag, zones, WebSocket sync
- `apps/paperclip-ui` — Venture dashboard with org chart, tickets, budgets
- `apps/hcom-dashboard` — Agent monitor TUI
- `services/agor` — WebSocket server
- `services/paperclip` — REST API for company/agent/ticket/budget CRUD
- `packages/shared-types`, `api-client`, `config`

**From Sprint 2 (Business + Spec + Build):**
- `apps/plannotator-ui` — Plan review gate with section-based access control
- `apps/web` — BMAD widgets (Business Model Canvas, revenue calculator, competitive analysis)
- `services/bmad` — Business methodology engine
- `services/paul` — Plan-Apply-Unify API with acceptance criteria
- `services/carl` — Dynamic rule injection by intent
- `services/plannotator` — Plan review server
- `services/gstack` — Build skill orchestrator (`/autoplan`, `/ship`, `/qa`)

**From Sprint 3 (Quality + CRM + Brain):**
- `apps/aegis-dashboard` — 14-domain risk heatmap, findings, executive summary
- `apps/denchclaw-ui` — CRM web UI at `localhost:3100`
- `apps/gbrain-dashboard` — Knowledge graph + query interface
- `services/aegis` — 14-domain audit engine with 12 personas
- `services/denchclaw` — CRM API (Node.js + DuckDB)
- `services/gbrain` — Knowledge brain API (Bun + PGLite, 74 MCP tools)

**Git tags:** `sprint-1-foundation`, `sprint-2-business-spec-build`, `sprint-3-quality-crm-brain`

**Read the BACKLOG.md and focus on Epic 10 plus final integration, polish, and ship.**

---

## SPRINT 4 SCOPE — DEPLOYMENT, DEVOPS, POLISH, SHIP

Execute Epic 10 in full. Additionally, perform final integration across all sprints, security hardening, performance optimization, and prepare the platform for real-world use by you and your domain expert.

| Epic | Name | Key Tasks | Success Criteria |
|------|------|-----------|------------------|
| **10** | Deployment & DevOps | E10-T1 through E10-T10 | Production Docker Compose, reverse proxy with TLS, health checks, log aggregation, CI/CD pipeline, disaster recovery runbook, onboarding docs |
| **Integration** | Cross-Sprint Integration | All layers wired together | End-to-end workflow: idea → BMAD canvas → Plannotator approval → PAUL spec → Gstack build → AEGIS audit → Gbrain capture → DenchClaw CRM |
| **Polish** | Performance & Security | Optimization pass | <200ms API response, 60fps canvas, zero security secrets in code, error boundaries on all components, input validation on all endpoints |
| **Ship** | v0.1 Release | Tag and handoff | `v0.1.0` tag, changelog, domain expert onboarding guide, technical founder runbook |

---

## ASSUMPTIONS FROM SPRINTS 1–3

1. All 9 services start with `docker-compose up -d`
2. HCOM hooks are installed for all agents
3. `pnpm install` and `turbo run build` work at root
4. Git branches from S1–S3 merged to `main`
5. Canvas renders at `localhost:3000`
6. Paperclip API at `localhost:3001`
7. PAUL API at `localhost:3005`
8. Plannotator at `localhost:3003`
9. Gstack at `localhost:3006`
10. AEGIS at `localhost:3007`
11. DenchClaw at `localhost:3100` / API at `localhost:3101`
12. Gbrain at `localhost:3008`
13. HCOM dashboard at `localhost:3004`

**Agents must harden, integrate, and polish existing code. No new features beyond Epic 10 infrastructure.**

---

## AGENT ROSTER & DELEGATION (10 PARALLEL AGENTS)

Spawn each agent in a dedicated Hermes Workspace pane. Every agent must run inside an HCOM-wrapped session.

| Agent | Model Source | Budget | Focus | Tasks | Git Branch | Why This Agent |
|-------|-------------|--------|-------|-------|------------|----------------|
| **Claude Code** | freemodel.dev | **$8/session hard cap** | Epic 10 + Polish | Production Docker Compose, nginx/Caddy reverse proxy, TLS, environment configuration, security hardening | `feat/epic-10-deploy` | Best at infrastructure-as-code |
| **Opencode Go** | DeepSeek V4 | $5 plan (~$0.50/task) | Epic 10 | CI/CD pipeline (GitHub Actions), automated testing on push, build matrix, artifact publishing | `feat/epic-10-cicd` | Cheap, good at YAML/config |
| **Kimi Code** | $40 plan | ~$2-3/task | Epic 10 | Health check endpoints for all 9 services, log aggregation, monitoring basics, disaster recovery runbook | `feat/epic-10-ops` | Strong at ops scripting |
| **OMP** | Cerebras (free tier) | Free | Integration | End-to-end integration testing: full workflow from idea to ship, cross-service data flow validation, fix integration bugs | `feat/sprint4-integration` | Fast inference for test logic |
| **Mimo Code** | $20 API + free tier | Free tier first | Polish | Performance optimization: canvas FPS, API response times, bundle size reduction, lazy loading | `feat/sprint4-perf` | Free tier covers profiling |
| **Command Code** | $1 plan (DeepSeek V4) | ~$0.20/task | Polish | Security audit: secret scanning, input validation, SQL injection prevention, XSS prevention, dependency audit | `feat/sprint4-security` | Cheapest — perfect for audit scripts |
| **Blackbox** | Free tier | Free | Documentation | Onboarding docs: domain expert guide, technical founder runbook, API documentation, architecture decision records (ADRs) | `feat/sprint4-docs` | Good at structured documentation |
| **Rovo Dev** | GitHub Copilot | Free (included) | Testing | Full test suite: unit, integration, and E2E tests across all 9 services, coverage report, flaky test fixes | `feat/sprint4-tests` | IDE-native, excellent for test writing |
| **Groq API** | Free tier | Free | Overflow | Changelog generation, release notes, `v0.1.0` tag preparation, version bumping | `feat/sprint4-release` | Lightning fast for release tasks |
| **Mistral** | Free tier | Free | Overflow | Root `package.json` cleanup, dependency deduplication, unused package removal, `pnpm-lock.yaml` cleanup | `feat/sprint4-cleanup` | Solid for config cleanup |

**Budget Safety Rules:**
- Claude Code (freemodel.dev): **Hard stop at $8.00/session.** If approaching, reassign to Opencode or Kimi.
- Kimi Code: Use for complex ops scripting only.
- Mimo Code: Exhaust free tier before touching the $20 API balance.
- All other agents: Use freely. No hard caps.
- Track approximate spend per agent in Hermes Dashboard kanban. Update every 15 minutes.

---

## TURBOREPO RULES (Sprint 4)

1. **No new apps or packages.** Only modify existing ones for polish and hardening.
2. **Dependency cleanup:** Remove unused packages. Deduplicate where possible.
3. **Pipeline:** All `turbo.json` tasks must pass in <5 minutes total.
4. **Build caching:** Verify remote caching works. All agents should pull from cache.
5. **Validation:** `turbo run build` at root must pass with zero errors before any merge.

---

## HCOM COMMUNICATION RULES (Sprint 4)

1. **Status Broadcasts:** Every agent must report status every 15 minutes:
   ```bash
   hcom broadcast "Claude: E10-T3 complete, moving to E10-T4. Budget: $3.20/$8.00"
   ```

2. **Full Stack Verification:** Agents must verify ALL previous services before testing:
   ```bash
   for port in 3001 3003 3005 3006 3007 3101 3008; do
     curl -sf http://localhost:$port/api/v1/health || echo "FAIL: $port"
   done
   ```

3. **Collision Detection:** HCOM collision detection is ON. Escalate immediately if triggered.

4. **Hermes Monitoring:** You must monitor HCOM TUI and escalate blocked agents within 10 minutes.

---

## MONOREPO STRUCTURE (Sprint 4 — Final State)

```
venture-spec-platform/
├── apps/
│   ├── web/                    # [S1/S2] — POLISH: error boundaries, lazy loading, perf
│   ├── paperclip-ui/           # [S1] — POLISH: data binding, error handling
│   ├── plannotator-ui/         # [S2] — POLISH: accessibility, keyboard nav
│   ├── hcom-dashboard/         # [S1] — POLISH: real-time updates, status colors
│   ├── aegis-dashboard/        # [S3] — POLISH: responsive design, export
│   ├── denchclaw-ui/           # [S3] — POLISH: mobile-friendly, notifications
│   └── gbrain-dashboard/       # [S3] — POLISH: query suggestions, graph zoom
├── packages/
│   ├── shared-types/           # [S1/S2/S3] — CLEANUP: remove unused types
│   ├── api-client/             # [S1/S2/S3] — CLEANUP: remove unused clients
│   ├── ui/                     # [S2/S3] — POLISH: add missing components
│   └── config/                 # [S1] — no changes
├── services/
│   ├── agor/                   # [S1] — HARDEN: rate limiting, input validation
│   ├── paperclip/              # [S1] — HARDEN: auth, rate limiting, validation
│   ├── bmad/                   # [S2] — HARDEN: input sanitization
│   ├── paul/                   # [S2] — HARDEN: plan size limits, timeout handling
│   ├── carl/                   # [S2] — HARDEN: rule validation, sandbox
│   ├── plannotator/            # [S2] — HARDEN: plan size limits, encryption
│   ├── gstack/                 # [S2] — HARDEN: build timeout, resource limits
│   ├── aegis/                  # [S3] — HARDEN: audit timeout, rate limiting
│   ├── denchclaw/              # [S3] — HARDEN: data validation, sync conflict resolution
│   ├── gbrain/                 # [S3] — HARDEN: query timeout, memory limits
│   └── hcom/                   # [external] — NO TOUCH
├── infra/
│   ├── docker/
│   │   └── docker-compose.yml  # [S4] — FINAL: production-ready, all 9 services
│   ├── nginx/
│   │   └── nginx.conf          # [NEW] reverse proxy with TLS
│   ├── scripts/
│   │   ├── health-check.sh     # [NEW] comprehensive health check
│   │   ├── backup.sh           # [NEW] database backup script
│   │   └── restore.sh          # [NEW] disaster recovery script
│   └── .github/
│       └── workflows/
│           └── ci.yml          # [NEW] GitHub Actions CI/CD
├── docs/                       # [S4] — FINAL: onboarding, runbooks, ADRs
├── tests/                      # [S4] — NEW: E2E test suite
├── CHANGELOG.md                # [S4] — v0.1.0 release notes
└── turbo.json                  # [S4] — FINAL: optimized pipeline
```

---

## TECH STACK PER FOCUS AREA

### Epic 10: Deployment (Claude + Opencode + Kimi)
- **Docker Compose:** Production-ready with health checks, restart policies, resource limits
- **Reverse Proxy:** nginx or Caddy with automatic TLS (Let's Encrypt), rate limiting
- **Environment:** `.env.production` template, secret management, port mapping
- **Health Checks:** `/health` on all 9 services with dependency checks
- **Backups:** PostgreSQL daily dumps, Gbrain Git sync, DenchClaw GitHub sync
- **CI/CD:** GitHub Actions — lint → typecheck → test → build → deploy
- **Disaster Recovery:** Documented runbook for machine failure, DB corruption, key rotation

### Integration (OMP)
- **End-to-End Workflow:**
  1. Domain expert creates Business Model Canvas in Agor
  2. BMAD generates PRD → Plannotator review
  3. Domain expert annotates business sections → approves
  4. PAUL generates TECH-SPEC with acceptance criteria
  5. Gstack runs `/autoplan` → builds MVP
  6. AEGIS audits at milestone → finds issues
  7. AEGIS Transform creates remediation plan → PAUL executes
  8. Gstack ships → live preview in Agor
  9. Gbrain auto-captures all decisions and plans
  10. DenchClaw tracks customer outreach for the venture
- **Validation:** Each step must produce data visible in the next step's UI

### Polish (Mimo + Command)
- **Performance:**
  - Canvas maintains 60fps with 100+ cards
  - API endpoints respond in <200ms (p95)
  - Gbrain queries return in <500ms
  - Bundle size <500KB per app (initial load)
- **Security:**
  - No API keys in code (all in `.env.local`)
  - Input validation on every endpoint (Zod or similar)
  - SQL injection prevention (parameterized queries)
  - XSS prevention (React escapes by default, verify)
  - CSRF protection on state-changing endpoints
  - Dependency audit (`pnpm audit` passes)

### Documentation (Blackbox)
- **Domain Expert Onboarding Guide:**
  - How to open Agor and create a Business Model Canvas
  - How to review plans in Plannotator
  - How to approve milestone gates
  - How to view Gbrain dashboards
  - How to use DenchClaw for customer management
- **Technical Founder Runbook:**
  - How to start all services
  - How to spawn agents via HCOM
  - How to monitor agent budgets
  - How to read AEGIS audit reports
  - How to query Gbrain for past decisions
  - How to deploy updates
- **Architecture Decision Records (ADRs):**
  - Why Turborepo
  - Why HCOM for agent communication
  - Why PAUL for technical specs
  - Why Gbrain for knowledge capture

---

## SHARED PACKAGES (Mistral + Rovo)

### `@vscp/shared-types` (Mistral)
- **Cleanup:** Remove any unused types from S1/S2 that were superseded
- **Finalization:** Ensure all 9 services have types defined
- **Validation:** `tsc --noEmit` passes with zero errors

### `@vscp/api-client` (Rovo)
- **Cleanup:** Remove unused clients
- **Finalization:** All 9 services have corresponding API clients
- **Tests:** 100% client coverage with Vitest + MSW

---

## DOCKER COMPOSE (Claude + Opencode)

Final `infra/docker/docker-compose.yml` must include:
- **All 9 services** with proper dependency ordering
- **PostgreSQL 16** with persistent volume and backup
- **Redis** (if used for caching)
- **Health checks** on every service
- **Restart policies:** `unless-stopped`
- **Resource limits:** CPU and memory caps per service
- **Network isolation:** Internal network for service-to-service, exposed ports for frontends
- **Environment variables:** All secrets externalized to `.env`

Validate: `docker-compose -f infra/docker/docker-compose.yml up -d` starts ALL 9 services in <60 seconds.

---

## DEFINITION OF DONE (Per Task)

Every task must satisfy ALL of these before moving to "Done":
- [ ] Code written and committed to git with conventional commit message
- [ ] Unit tests passing (coverage > 80% for shared packages, > 60% for apps)
- [ ] Integration tests passing for all cross-service flows
- [ ] TypeScript compiles with `tsc --noEmit` (zero errors, zero warnings)
- [ ] Lint passes with `eslint` (zero errors)
- [ ] Security audit passes (no secrets, validated inputs, no vulnerabilities)
- [ ] Performance budget met (API <200ms, canvas 60fps, bundle <500KB)
- [ ] Manual QA: feature works in production-like environment
- [ ] Committed to the correct git branch (not main)
- [ ] Hermes Dashboard kanban updated: task moved to "Done"
- [ ] HCOM broadcast sent: "[Agent]: [Task-ID] done"
- [ ] **Integration verified:** Works with all 9 services running simultaneously

---

## PROCESS INSTRUCTIONS

1. **Read Phase (10 minutes):**
   - Read BACKLOG.md Epic 10
   - Review ALL existing code from S1, S2, S3
   - Identify integration gaps, security holes, performance bottlenecks

2. **Setup Phase (15 minutes):**
   - Open Hermes Dashboard → Create Sprint 4 kanban board
   - Run `git checkout main && git pull` to get latest S3 code
   - Run `pnpm install` at root
   - Run `docker-compose -f infra/docker/docker-compose.yml up -d` to verify S1+S2+S3 services
   - Verify `turbo run build` passes with S1+S2+S3 code
   - Run full health check on all 9 services
   - Spawn all 10 agents in Hermes Workspace panes

3. **Delegation Phase (10 minutes):**
   - Assign tasks to agents via HCOM broadcast
   - Each agent checks out its own branch: `git checkout -b feat/epic-10-name`
   - Security audit (Command) starts FIRST — findings guide other agents' polish work
   - Integration testing (OMP) starts in parallel — catches gaps early

4. **Execution Phase (Ongoing):**
   - Monitor HCOM TUI every 15 minutes
   - Monitor Hermes Dashboard kanban every 15 minutes
   - Track agent budgets in Dashboard
   - If any agent is blocked for >10 minutes, escalate to me immediately
   - If Claude approaches $8.00, PAUSE and reassign

5. **Integration Phase (Critical for Sprint 4):**
   - Run the full end-to-end workflow at least once daily:
     1. Create BMC in Agor → verify BMAD captures it
     2. Generate PRD → verify Plannotator receives it
     3. Approve in Plannotator → verify PAUL generates spec
     4. Build via Gstack → verify HCOM shows progress
     5. Audit via AEGIS → verify findings captured in Gbrain
     6. Track customer in DenchClaw → verify sync to Paperclip
   - Fix any broken integration immediately

6. **Validation Phase (End of Sprint):**
   - Run `turbo run lint typecheck test build` at root — must pass with zero errors in <5 minutes
   - Run `docker-compose -f infra/docker/docker-compose.yml up -d` — must start ALL 9 services in <60 seconds
   - Run `pnpm audit` — must pass with zero high-severity vulnerabilities
   - Run Lighthouse audit on all 7 apps — must score >90 on Performance, Accessibility, Best Practices
   - Run full E2E test suite — must pass with zero failures
   - Run security scan — no secrets in code, all inputs validated
   - Merge all feature branches to main via PRs
   - Tag: `git tag -a v0.1.0 -m "v0.1.0 — Venture Spec Platform MVP"`
   - Generate CHANGELOG.md

7. **Reporting Phase:**
   - Generate Sprint 4 summary report:
     - Tasks completed vs. planned
     - Agent budget spend per agent (total across all 4 sprints)
     - Final architecture summary (services, apps, packages)
     - Performance benchmarks
     - Security audit results
     - Known limitations and v0.2 roadmap

---

## CONSTRAINTS & GUARDRAILS

1. **No New Features:** Sprint 4 is about hardening, integrating, and shipping. Do not add new capabilities beyond Epic 10 infrastructure.

2. **Backward Compatibility:** All S1, S2, and S3 features must continue working. The canvas must still pan/zoom. Paperclip must still manage companies. PAUL must still generate specs. AEGIS must still audit. Gbrain must still capture.

3. **Git Discipline:** Every agent works in its own branch. No direct commits to main. Merge only after full validation.

4. **Production Readiness:** By the end of Sprint 4, the platform must be deployable to a VPS by running `docker-compose up -d` and accessible via HTTPS.

5. **Security First:** No API keys, passwords, or tokens in code. All in `.env` files. `.env.example` committed as template. `.env.local` in `.gitignore`.

6. **Performance Budget:** Canvas 60fps. APIs <200ms. Bundles <500KB. Gbrain queries <500ms. AEGIS lightweight audit <30s.

7. **Documentation Complete:** A domain expert with zero technical knowledge must be able to onboard using only the docs.

8. **Test Coverage:** Every service has unit tests. Every cross-service flow has an integration test. Critical user journeys have E2E tests.

---

## IMMEDIATE FIRST ACTIONS

Execute these in order before delegating to other agents:

1. `git checkout main && git pull` — Get latest Sprint 3 code
2. `git log --oneline --grep="sprint-3"` — Verify sprint-3-quality-crm-brain tag exists
3. `pnpm install` — Install any new root dependencies
4. `turbo run build` — Verify Sprint 1+2+3 builds cleanly
5. `docker-compose -f infra/docker/docker-compose.yml up -d` — Start S1+S2+S3 services
6. Run health check on all 9 services:
   ```bash
   for port in 3001 3003 3005 3006 3007 3101 3008; do
     echo -n "Port $port: "
     curl -sf http://localhost:$port/api/v1/health && echo "OK" || echo "FAIL"
   done
   ```
7. `hcom --version` — Verify HCOM
8. Open Hermes Dashboard → Create Sprint 4 kanban board
9. `git checkout -b feat/epic-10-security` — Command starts here (security audit first)
10. Send HCOM broadcast: "All agents report in. Sprint 4 — FINAL SPRINT — begins. Confirm your assignment and branch."

---

## SUCCESS CRITERIA FOR SPRINT 4 (v0.1.0 SHIP)

When I run these commands from the monorepo root, everything must pass:

```bash
# 1. Monorepo builds cleanly and fast (<5 min)
pnpm install && turbo run lint typecheck test build

# 2. All 9 services start in <60 seconds
docker-compose -f infra/docker/docker-compose.yml up -d

# 3. Health check passes on all services
./infra/scripts/health-check.sh
# → All 9 services report "healthy"

# 4. Security audit passes
pnpm audit
# → Zero high-severity vulnerabilities

# 5. No secrets in code
grep -r "sk-" --include="*.ts" --include="*.tsx" --include="*.js" . || echo "No secrets found"
# → Exit 0 (no matches)

# 6. End-to-end workflow test
./tests/e2e/full-workflow.sh
# → Passes: idea → BMC → PRD → Plannotator → PAUL → Gstack → AEGIS → Gbrain → DenchClaw

# 7. Performance benchmarks
./tests/perf/benchmark.sh
# → API p95 <200ms, canvas 60fps, bundle <500KB, Gbrain <500ms

# 8. Lighthouse scores >90
npx lighthouse http://localhost:3000 --output=json --chrome-flags="--headless"
# → Performance >90, Accessibility >90, Best Practices >90

# 9. Domain expert can onboard without help
# → Manual test: give onboarding guide to non-technical person, they create a BMC in <10 minutes

# 10. Technical founder runbook is complete
# → Manual test: follow runbook to spawn agents, build a feature, audit it, capture in Gbrain

# 11. Git tag exists
git tag | grep "v0.1.0"
# → v0.1.0

# 12. CHANGELOG exists
cat CHANGELOG.md | head -20
# → v0.1.0 release notes with all 4 sprint summaries
```

If all 12 pass, **v0.1.0 is shipped**. Tag it, celebrate, and report to me.

---

*Execute now. This is the final sprint.*
