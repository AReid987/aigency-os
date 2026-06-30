# Sprint 2 Implementation Plan — BMAD + PAUL + Gstack

> **For Hermes:** Use subagent-driven-development to implement this plan task-by-task.

**Goal:** Build the business methodology, technical spec, and implementation orchestration layers for Aigency OS.

**Architecture:** Three new Fastify services (bmad, paul, gstack), one new React app (plannotator-ui), extended shared-types and api-client packages, updated docker-compose. All services use in-memory stores (same pattern as Sprint 1 Paperclip API) — no external dependencies required.

**Tech Stack:** Fastify 5, React 19, Vite 6, TypeScript 5.5, Tailwind 4, Zustand 5, Zod, Vitest

---

## Phase 1: Shared Types & API Clients (No dependencies)

### Task 1: Add Sprint 2 types to @aigency-os/shared-types

**Objective:** Define TypeScript interfaces for BMAD, PAUL, CARL, and Gstack domains.

**Files:**
- Create: `packages/shared-types/src/bmad.ts`
- Create: `packages/shared-types/src/paul.ts`
- Create: `packages/shared-types/src/carl.ts`
- Create: `packages/shared-types/src/gstack.ts`
- Modify: `packages/shared-types/src/index.ts`

**Types to define:**

bmad.ts:
- BusinessModel (id, name, segments[], valuePropositions[], revenueStreams[], costStructure[])
- RevenueModel (id, type: 'subscription'|'usage'|'one-time', tiers[], unitEconomics)
- Milestone (id, title, gateStatus: GateStatus, approvals[], deadline)
- GateStatus = 'pending' | 'approved' | 'rejected' | 'blocked'
- CompetitiveAnalysis (id, competitors[], featureMatrix, positioning)
- BusinessModelCanvas (id, sections[9], companyId)

paul.ts:
- PaulPlan (id, title, tasks[], acceptanceCriteria[], status, prdSource)
- PaulTask (id, title, description, status, dependencies[], estimatedDays)
- AcceptanceCriteria (id, description, verified: boolean, evidence)
- UnifyResult (id, planId, status, findings[], score)
- TechSpec (id, planId, sections[], architecture, apiSpec)

carl.ts:
- CarlRule (id, name, domain: Domain, intent, conditions[], actions[])
- Domain = 'business' | 'architecture' | 'paul' | 'security' | 'testing'
- RuleSet (id, name, domain, rules[], version)
- Intent (keyword, domain, confidence)

gstack.ts:
- BuildJob (id, spec, status, steps[], startedAt, completedAt)
- BuildStep (id, name, status, output, duration)
- SkillInvocation (id, skill, args, result, duration)
- DesignOutput (id, type: 'mockup'|'html'|'screenshot', url, thumbnail)

**Verification:** `cd packages/shared-types && pnpm build` compiles with zero errors.

### Task 2: Add Sprint 2 API clients to @aigency-os/api-client

**Objective:** Create typed fetch wrappers for all new services.

**Files:**
- Create: `packages/api-client/src/bmad.ts`
- Create: `packages/api-client/src/paul.ts`
- Create: `packages/api-client/src/plannotator.ts`
- Create: `packages/api-client/src/gstack.ts`
- Modify: `packages/api-client/src/index.ts`

Each client follows the same pattern as the existing `client.ts` — uses `createAPIClient` with service-specific base URL and typed endpoints.

**Verification:** `cd packages/api-client && pnpm build && pnpm test` passes.

---

## Phase 2: Backend Services (Depends on Phase 1)

### Task 3: BMAD Service — Business Methodology Engine

**Objective:** Fastify service at port 3010 that implements BMAD methodology (business model canvas, revenue models, milestones, competitive analysis).

**Files:**
- Create: `services/bmad/package.json`
- Create: `services/bmad/tsconfig.json`
- Create: `services/bmad/src/index.ts` — Fastify server, port 3010
- Create: `services/bmad/src/store.ts` — In-memory store (same pattern as paperclip)
- Create: `services/bmad/src/schemas.ts` — Zod validation schemas
- Create: `services/bmad/src/routes/canvas.ts` — Business Model Canvas CRUD
- Create: `services/bmad/src/routes/revenue.ts` — Revenue model CRUD + calculator
- Create: `services/bmad/src/routes/milestones.ts` — Milestone + gate management
- Create: `services/bmad/src/routes/competitive.ts` — Competitive analysis CRUD

**API Endpoints:**
- POST/GET /api/v1/canvas — Create/list BMCs
- POST/GET /api/v1/revenue — Create/list revenue models
- POST /api/v1/revenue/calculate — Calculate unit economics (CAC, LTV, payback)
- POST/GET /api/v1/milestones — Create/list milestones
- PATCH /api/v1/milestones/:id/gate — Approve/reject gate
- POST/GET /api/v1/competitive — Create/list competitive analyses
- GET /health — Health check

**Verification:** `curl http://localhost:3010/health` returns `{"status":"ok"}`. CRUD operations work.

### Task 4: PAUL Service — Plan-Apply-Unify Engine

**Objective:** Fastify service at port 3011 that implements PAUL plan generation from PRDs, acceptance criteria validation, and TECH-SPEC output.

**Files:**
- Create: `services/paul/package.json`
- Create: `services/paul/tsconfig.json`
- Create: `services/paul/src/index.ts` — Fastify server, port 3011
- Create: `services/paul/src/store.ts` — In-memory store
- Create: `services/paul/src/schemas.ts` — Zod schemas
- Create: `services/paul/src/routes/plan.ts` — Plan generation from PRD text
- Create: `services/paul/src/routes/apply.ts` — Apply plan (mark tasks in-progress)
- Create: `services/paul/src/routes/unify.ts` — Unify results, generate TECH-SPEC
- Create: `services/paul/src/routes/criteria.ts` — Acceptance criteria management

**API Endpoints:**
- POST /api/v1/plan — Generate plan from PRD text (returns structured plan with tasks + criteria)
- GET /api/v1/plan/:id — Get plan details
- POST /api/v1/plan/:id/apply — Start executing plan
- POST /api/v1/plan/:id/unify — Run unification, generate TECH-SPEC
- GET /api/v1/plan/:id/criteria — List acceptance criteria
- PATCH /api/v1/plan/:id/criteria/:cid — Verify criteria
- GET /health — Health check

**Verification:** `curl -X POST http://localhost:3011/api/v1/plan -d '{"prd":"Build auth system"}'` returns structured plan.

### Task 5: Gstack Service — Build Skill Orchestrator

**Objective:** Fastify service at port 3012 that wraps build skills (autoplan, ship, qa, design-shotgun) as API endpoints with HCOM status reporting.

**Files:**
- Create: `services/gstack/package.json`
- Create: `services/gstack/tsconfig.json`
- Create: `services/gstack/src/index.ts` — Fastify server, port 3012
- Create: `services/gstack/src/store.ts` — In-memory store
- Create: `services/gstack/src/schemas.ts` — Zod schemas
- Create: `services/gstack/src/routes/autoplan.ts` — Auto-plan from spec
- Create: `services/gstack/src/routes/ship.ts` — Ship/build execution
- Create: `services/gstack/src/routes/qa.ts` — QA check execution
- Create: `services/gstack/src/routes/design.ts` — Design skill invocation
- Create: `services/gstack/src/routes/jobs.ts` — Job status tracking

**API Endpoints:**
- POST /api/v1/autoplan — Create auto-plan from spec (returns job ID)
- POST /api/v1/ship — Execute ship/build (returns job ID)
- POST /api/v1/qa — Run QA checks (returns job ID)
- POST /api/v1/design — Invoke design skill (returns job ID)
- GET /api/v1/jobs/:id — Get job status + output
- GET /api/v1/jobs — List all jobs
- GET /health — Health check

**Verification:** `curl -X POST http://localhost:3012/api/v1/autoplan -d '{"spec":"auth system"}'` returns job ID.

### Task 6: Plannotator Service — Plan Review Server

**Objective:** Fastify service at port 3013 that serves plan review data — plans from PAUL, annotations, section-based access control, diffs.

**Files:**
- Create: `services/plannotator/package.json`
- Create: `services/plannotator/tsconfig.json`
- Create: `services/plannotator/src/index.ts` — Fastify server, port 3013
- Create: `services/plannotator/src/store.ts` — In-memory store
- Create: `services/plannotator/src/schemas.ts` — Zod schemas
- Create: `services/plannotator/src/routes/plans.ts` — Plan CRUD + section access
- Create: `services/plannotator/src/routes/annotations.ts` — Annotation threads
- Create: `services/plannotator/src/routes/diffs.ts` — Plan version diffs

**API Endpoints:**
- GET /api/v1/plans — List plans (filter by source=paperclip)
- GET /api/v1/plans/:id — Get plan with sections
- GET /api/v1/plans/:id?role=domain_expert — Sections filtered by RBAC
- POST /api/v1/plans/:id/annotations — Add annotation
- GET /api/v1/plans/:id/annotations — List annotations
- GET /api/v1/plans/:id/diff/:v1/:v2 — Get diff between versions
- GET /health — Health check

**Verification:** `curl http://localhost:3013/api/v1/plans` returns plan list. RBAC filtering works.

---

## Phase 3: Frontend Apps (Depends on Phase 2)

### Task 7: Plannotator UI — Plan Review App

**Objective:** New React app at port 3003 for plan review with section-based access, annotations, and diff viewing.

**Files:**
- Create: `apps/plannotator-ui/package.json`
- Create: `apps/plannotator-ui/tsconfig.json`
- Create: `apps/plannotator-ui/vite.config.ts` (port 3003)
- Create: `apps/plannotator-ui/index.html`
- Create: `apps/plannotator-ui/src/main.tsx`
- Create: `apps/plannotator-ui/src/App.tsx`
- Create: `apps/plannotator-ui/src/index.css` (same design system)
- Create: `apps/plannotator-ui/src/components/PlanViewer.tsx`
- Create: `apps/plannotator-ui/src/components/AnnotationThread.tsx`
- Create: `apps/plannotator-ui/src/components/SectionToggle.tsx`
- Create: `apps/plannotator-ui/src/components/DiffViewer.tsx`
- Create: `apps/plannotator-ui/src/components/Atmosphere.tsx`
- Create: `apps/plannotator-ui/public/atmosphere.js`

**Features:**
- Plan viewer with collapsible sections (Business, Technical, Architecture)
- RBAC toggle: Domain Expert sees business only, Technical Founder sees all
- Annotation threads per section with reply capability
- Side-by-side diff viewer for plan versions
- Same design system (dark void, frosted glass, teal/magenta)

**Verification:** `cd apps/plannotator-ui && pnpm build` compiles. Renders at :3003.

### Task 8: Canvas BMAD Widgets — Business Model Canvas + Revenue Calculator

**Objective:** Add BMAD-specific card types to the Agor canvas — Business Model Canvas template and Revenue Calculator widget.

**Files:**
- Modify: `apps/web/src/stores/canvasStore.ts` — Add BMC card type + demo data
- Create: `apps/web/src/canvas/cards/BMCCard.tsx` — Business Model Canvas card (9 sections)
- Create: `apps/web/src/canvas/cards/RevenueCard.tsx` — Revenue calculator card
- Create: `apps/web/src/canvas/cards/GateCard.tsx` — Milestone gate card
- Create: `apps/web/src/canvas/cards/SpecCard.tsx` — TECH-SPEC viewer card
- Modify: `apps/web/src/canvas/Card.tsx` — Add new card type renderers
- Modify: `apps/web/src/canvas/Toolbar.tsx` — Add BMC, Revenue, Gate, Spec to card type dropdown

**Features:**
- BMC Card: 9-section grid (Key Partners, Activities, Resources, Value Props, Customer Relationships, Channels, Customer Segments, Cost Structure, Revenue Streams)
- Revenue Card: Calculator with subscription/usage/one-time toggle, unit economics display
- Gate Card: Shows milestone status (pending/approved/rejected), approve/reject buttons
- Spec Card: Renders TECH-SPEC sections with collapsible architecture details

**Verification:** `cd apps/web && pnpm build` compiles. New card types appear in toolbar dropdown.

---

## Phase 4: Integration & Docker (Depends on Phase 2)

### Task 9: Update Docker Compose for Sprint 2 Services

**Objective:** Add all new services to docker-compose.yml.

**Files:**
- Modify: `infra/docker/docker-compose.yml`

Add services: bmad (3010), paul (3011), gstack (3012), plannotator (3013). All use `tsx` for dev mode, connect to existing PostgreSQL, health checks at /health.

**Verification:** `docker-compose -f infra/docker/docker-compose.yml config --quiet` validates.

### Task 10: Add Tests for All Sprint 2 Services

**Objective:** Write vitest tests for each new service (health endpoint + core CRUD).

**Files:**
- Create: `services/bmad/vitest.config.ts` + `src/__tests__/bmad.test.ts`
- Create: `services/paul/vitest.config.ts` + `src/__tests__/paul.test.ts`
- Create: `services/gstack/vitest.config.ts` + `src/__tests__/gstack.test.ts`
- Create: `services/plannotator/vitest.config.ts` + `src/__tests__/plannotator.test.ts`
- Create: `apps/plannotator-ui/vite.config.ts` test config

**Verification:** `turbo run test` passes with all new tests.

---

## Execution Order

```
Phase 1 (parallel):
  Task 1: shared-types ← no deps
  Task 2: api-client ← depends on Task 1

Phase 2 (parallel, depends on Phase 1):
  Task 3: bmad service
  Task 4: paul service
  Task 5: gstack service
  Task 6: plannotator service

Phase 3 (parallel, depends on Phase 2):
  Task 7: plannotator-ui app
  Task 8: canvas BMAD widgets

Phase 4 (parallel, depends on Phase 2):
  Task 9: docker-compose update
  Task 10: tests for all services

Final: turbo run lint typecheck test build
```

## Success Criteria Mapping

| Sprint 2 Criteria | Task |
|---|---|
| `turbo run lint typecheck test build` passes | All tasks |
| Docker compose starts all services | Task 9 |
| Canvas shows BMAD widgets | Task 8 |
| Plannotator renders plans at :3003 | Task 7 |
| PAUL generates specs at :3005 | Task 4 (port 3011) |
| Gstack runs builds at :3006 | Task 5 (port 3012) |
| Integration: Plannotator reads Paperclip tickets | Task 6 |
| Git history clean | All tasks commit |
