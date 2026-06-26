# HERMES WORKSPACE — SPRINT 2 ORCHESTRATION PROMPT

## CONTEXT

Sprint 1 is **COMPLETE**. The foundation layer is built and tagged as `sprint-1-foundation`.

You are operating inside the **Turborepo monorepo** at:
`~/CODE/00_PROJECTS/00_APPS/venture-spec-platform`

The codebase now contains:
- `apps/web` — Agor canvas with pan, zoom, drag, zones, WebSocket client
- `apps/paperclip-ui` — Venture dashboard with org chart mock
- `apps/hcom-dashboard` — Agent monitor TUI
- `services/paperclip` — REST API for company/agent/ticket CRUD
- `services/agor` — WebSocket server placeholder
- `packages/shared-types` — TypeScript interfaces
- `packages/api-client` — Fetch wrappers + WebSocket client
- `packages/config` — ESLint, TS, Tailwind presets
- `infra/docker/docker-compose.yml` — PostgreSQL + services
- `docs/` — 6 BMAD documents (Project Brief, PRD, Architecture, UI/UX, Frontend Arch, Backlog)

**Read the BACKLOG.md and focus on Epics 3, 4, and 6 only.**

---

## SPRINT 2 SCOPE — BUSINESS + SPEC + IMPLEMENTATION

Execute **ONLY** these three epics. Do not touch Epics 7, 8, 9, or 10.

| Epic | Name | Key Tasks | Success Criteria |
|------|------|-----------|------------------|
| **3** | Business Process & Gates | E3-T1 through E3-T13 | BMAD methodology, Babysitter gates, Plannotator plan review, Business Model Canvas, revenue calculator, competitive analysis |
| **4** | Technical Spec | E4-T1 through E4-T9 | PAUL Plan-Apply-Unify loop, SEED typed incubation, CARL dynamic rules, TECH-SPEC generation |
| **6** | Implementation Orchestra | E6-T1 through E6-T10 | Gstack skills integration, GSD Pi standalone, design agents (Google Stitch, Huashu, Open Design), git worktree isolation, parallel builds |

---

## ASSUMPTIONS FROM SPRINT 1

1. All services start with `docker-compose -f infra/docker/docker-compose.yml up -d`
2. HCOM hooks are installed for all agents
3. `pnpm install` and `turbo run build` work at root
4. Git branches from Sprint 1 have been merged to `main`
5. The canvas renders in browser at `localhost:3000`
6. Paperclip API responds at `localhost:3001`
7. HCOM dashboard shows at `localhost:3004`

**Agents must build ON TOP of existing code, not replace it.**

---

## AGENT ROSTER & DELEGATION (10 PARALLEL AGENTS)

Spawn each agent in a dedicated Hermes Workspace pane. Every agent must run inside an HCOM-wrapped session.

| Agent | Model Source | Budget | Epic | Tasks | Git Branch | Why This Agent |
|-------|-------------|--------|------|-------|------------|----------------|
| **Claude Code** | freemodel.dev | **$8/session hard cap** | E3 | Plannotator UI: plan review, annotation threads, section-based access control, diff visualization | `feat/epic-3-plannotator` | Best React/TypeScript for complex UI |
| **Opencode Go** | DeepSeek V4 | $5 plan (~$0.50/task) | E3 | BMAD integration: PRD viewer, business model canvas widget, revenue calculator embed, competitive analysis template | `feat/epic-3-bmad` | Cheap, good at widget wiring |
| **Kimi Code** | $40 plan | ~$2-3/task | E4 | PAUL backend: Plan-Apply-Unify loop API, acceptance criteria engine, headless execution mode, CARL rule loader | `feat/epic-4-paul` | Strong at structured logic + API design |
| **OMP** | Cerebras (free tier) | Free | E4 | SEED + CARL integration: typed project incubation, dynamic rule injection by intent, rule versioning | `feat/epic-4-seed-carl` | Fast inference for rule systems |
| **Mimo Code** | $20 API + free tier | Free tier first | E6 | GSD Pi integration: standalone CLI wrapper, `gsd --web` multi-tab UI embed, auto mode | `feat/epic-6-gsd` | Free tier covers UI scaffolding |
| **Command Code** | $1 plan (DeepSeek V4) | ~$0.20/task | E6 | Gstack skill integration: `/autoplan`, `/ship`, `/qa`, `/design-shotgun` skill wrappers, browser automation hooks | `feat/epic-6-gstack` | Cheapest — perfect for skill glue |
| **Blackbox** | Free tier | Free | E3 | Babysitter gate enforcement: workflow state machine, human breakpoint API, milestone tracker | `feat/epic-3-babysitter` | Good at state machines |
| **Rovo Dev** | GitHub Copilot | Free (included) | Shared | Tests for all new Epic 3/4/6 code, integration tests between S1 and S2 services | `feat/sprint2-tests` | IDE-native, excellent for test writing |
| **Groq API** | Free tier | Free | Overflow | Documentation: README updates for new services, API endpoint docs, docker-compose additions | `feat/sprint2-docs` | Lightning fast for docs |
| **Mistral** | Free tier | Free | Overflow | Shared package updates: new types for BMAD, PAUL, Gstack in `@vscp/shared-types` | `feat/sprint2-types` | Solid for type definitions |

**Budget Safety Rules:**
- Claude Code (freemodel.dev): **Hard stop at $8.00/session.** If approaching, reassign to Opencode or Kimi.
- Kimi Code: Use for complex backend logic only.
- Mimo Code: Exhaust free tier before touching the $20 API balance.
- All other agents: Use freely. No hard caps.
- Track approximate spend per agent in Hermes Dashboard kanban. Update every 15 minutes.

---

## TURBOREPO RULES (Sprint 2 Additions)

1. **New apps/packages must follow existing patterns.** Copy `apps/web` or `apps/paperclip-ui` structure.
2. **Workspace Protocol:** All new packages use `"@vscp/shared-types": "workspace:*"`.
3. **Pipeline:** Every new app/package must have `turbo.json` with `build`, `dev`, `lint`, `test`, `typecheck`.
4. **Dependency Order:** If `@vscp/shared-types` changes, all dependent apps must rebuild.
5. **Validation:** Before declaring any epic "done", run `turbo run build` at root. Zero errors.
6. **No duplicate dependencies:** Check root `package.json` before adding new packages.

---

## HCOM COMMUNICATION RULES (Sprint 2)

1. **Status Broadcasts:** Every agent must report status every 15 minutes:
   ```bash
   hcom broadcast "Claude: E3-T3 complete, moving to E3-T4. Budget: $3.20/$8.00"
   ```

2. **Sprint 1 Integration:** Agents must verify Sprint 1 services are running before testing Sprint 2 code:
   ```bash
   curl http://localhost:3001/api/v1/health && echo "Paperclip OK"
   ```

3. **Collision Detection:** HCOM collision detection is ON. If two agents edit the same file, both are alerted. Escalate to me immediately.

4. **Hermes Monitoring:** You must monitor HCOM TUI and escalate blocked agents within 10 minutes.

---

## MONOREPO STRUCTURE (Sprint 2 Additions)

```
venture-spec-platform/
├── apps/
│   ├── web/                    # [S1] Agor canvas — ADD: BMAD widgets, Plannotator embed
│   ├── paperclip-ui/           # [S1] Paperclip dashboard — ADD: org chart data binding
│   ├── plannotator-ui/         # [NEW] Plan review gate (React + Vite)
│   ├── hcom-dashboard/         # [S1] Agent monitor — ADD: Gstack build status
│   └── gbrain-dashboard/       # [S1 placeholder] — NO TOUCH
├── packages/
│   ├── shared-types/           # [S1] — ADD: BMAD, PAUL, Gstack types
│   ├── api-client/             # [S1] — ADD: Plannotator, PAUL, Gstack clients
│   ├── ui/                     # [S1 placeholder] — ADD: shared components
│   └── config/                 # [S1] — no changes expected
├── services/
│   ├── agor/                   # [S1] WebSocket server — ADD: BMAD card events
│   ├── paperclip/              # [S1] Node.js API — ADD: ticket status webhooks
│   ├── bmad/                   # [NEW] Business methodology engine
│   ├── paul/                   # [NEW] Plan-Apply-Unify API
│   ├── carl/                   # [NEW] Dynamic rule injection service
│   ├── gstack/                 # [NEW] Build skill orchestrator
│   ├── gbrain/                 # [S1 placeholder] — NO TOUCH
│   ├── plannotator/            # [NEW] Plan review server
│   └── hcom/                   # [external] Rust binary — NO TOUCH
├── infra/
│   └── docker/
│       └── docker-compose.yml  # [S1] — ADD: bmad, paul, carl, gstack, plannotator services
├── docs/                       # 6 BMAD documents
└── turbo.json                  # [S1] — ADD: new app/package pipelines
```

**Agents must write code INTO this structure.** No new top-level directories.

---

## TECH STACK PER EPIC

### Epic 3: Business Process (Claude + Opencode + Blackbox)
- **Framework:** React 19 + TypeScript 5.5 + Vite 6 (same as S1)
- **Styling:** Tailwind CSS 4 + Radix UI
- **State:** Zustand 5
- **BMAD Integration:** Node.js CLI wrapper that reads/writes canvas cards
- **Babysitter:** State machine (XState or similar) for workflow enforcement
- **Plannotator:** Standalone React app with plan annotation, section-based RBAC, diff viewer

### Epic 4: Technical Spec (Kimi + OMP)
- **Backend:** Express.js or Fastify
- **PAUL:** Plan-Apply-Unify loop with acceptance criteria validation
- **SEED:** Typed project templates (Application, Workflow, Client, Campaign)
- **CARL:** Dynamic rule loader with intent detection, YAML/JSON rule format
- **Database:** PostgreSQL (same as S1)

### Epic 6: Implementation Orchestra (Mimo + Command)
- **Gstack:** Skill wrapper that exposes `/autoplan`, `/ship`, `/qa`, `/design-shotgun` as API endpoints
- **GSD Pi:** Standalone CLI wrapper with `gsd --web` spawning
- **Design Agents:** MCP server integration for Google Stitch, Huashu, Open Design
- **Git:** Worktree isolation per parallel build

---

## SHARED PACKAGES (Mistral + Rovo)

### `@vscp/shared-types` (Mistral)
Add these types to `packages/shared-types/src/`:
- `bmad.ts` — BusinessModel, RevenueModel, Milestone, GateStatus
- `paul.ts` — Plan, Task, AcceptanceCriteria, UnifyResult
- `carl.ts` — Rule, RuleSet, Intent, Domain
- `gstack.ts` — BuildJob, SkillInvocation, DesignOutput
- Update `index.ts` to re-export all

### `@vscp/api-client` (Rovo)
Add these clients to `packages/api-client/src/`:
- `bmad.ts` — BMAD methodology API client
- `paul.ts` — PAUL plan/apply/unify client
- `plannotator.ts` — Plan review annotation client
- `gstack.ts` — Build skill invocation client
- Tests for all new clients using Vitest + MSW

---

## DOCKER COMPOSE (Groq)

Update `infra/docker/docker-compose.yml` to add:
- **bmad-service** — Node.js business methodology engine
- **paul-service** — Node.js Plan-Apply-Unify API
- **carl-service** — Node.js dynamic rule injection
- **plannotator-service** — Node.js plan review server
- **gstack-service** — Node.js build skill orchestrator

All services must:
- Connect to existing PostgreSQL
- Expose health check endpoints at `/health`
- Use internal Docker network
- Mount local code as volume for dev mode

Validate: `docker-compose -f infra/docker/docker-compose.yml up -d` starts ALL services without errors.

---

## DEFINITION OF DONE (Per Task)

Every task must satisfy ALL of these before moving to "Done":
- [ ] Code written and committed to git with conventional commit message
- [ ] Unit tests written and passing (coverage > 80% for shared packages, > 60% for apps)
- [ ] TypeScript compiles with `tsc --noEmit` (zero errors, zero warnings)
- [ ] Lint passes with `eslint` (zero errors)
- [ ] Manual QA: feature works as described in PRD acceptance criteria
- [ ] No console errors or warnings in browser dev tools
- [ ] Accessible: keyboard navigation works, ARIA labels present
- [ ] Committed to the correct git branch (not main)
- [ ] Hermes Dashboard kanban updated: task moved to "Done"
- [ ] HCOM broadcast sent: "[Agent]: [Task-ID] done"
- [ ] **NEW Sprint 2:** Integration with Sprint 1 services verified (e.g., Plannotator reads Paperclip tickets)

---

## PROCESS INSTRUCTIONS

1. **Read Phase (10 minutes):**
   - Read BACKLOG.md Epics 3, 4, 6
   - Review existing Sprint 1 code in `apps/`, `services/`, `packages/`
   - Identify which S1 APIs need to be extended for S2 features

2. **Setup Phase (15 minutes):**
   - Open Hermes Dashboard → Create Sprint 2 kanban board
   - Run `git checkout main && git pull` to get latest Sprint 1 code
   - Run `pnpm install` at root (new dependencies may be needed)
   - Run `docker-compose -f infra/docker/docker-compose.yml up -d` to verify S1 services
   - Verify `turbo run build` passes with S1 code
   - Install HCOM hooks for any NEW agents (if any were added)
   - Spawn all 10 agents in Hermes Workspace panes

3. **Delegation Phase (10 minutes):**
   - Assign tasks to agents via HCOM broadcast
   - Each agent checks out its own branch: `git checkout -b feat/epic-X-name`
   - Shared package agents (Mistral, Rovo) start FIRST
   - Wait for `shared-types` updates before starting app agents

4. **Execution Phase (Ongoing):**
   - Monitor HCOM TUI every 15 minutes
   - Monitor Hermes Dashboard kanban every 15 minutes
   - Track agent budgets in Dashboard
   - If any agent is blocked for >10 minutes, escalate to me immediately
   - If Claude approaches $8.00, PAUSE and reassign

5. **Integration Phase (Critical for Sprint 2):**
   - After each epic completes, verify it integrates with Sprint 1:
     - Plannotator can read Paperclip tickets
     - BMAD canvas widgets sync to Agor WebSocket
     - PAUL plans can be rendered in Plannotator
     - Gstack build status appears in HCOM Dashboard
   - Run `turbo run lint typecheck test build` at root
   - Run full docker-compose and verify all services healthy

6. **Validation Phase (End of Sprint):**
   - Run `turbo run lint typecheck test build` at root — must pass with zero errors
   - Run `docker-compose -f infra/docker/docker-compose.yml up -d` — must start ALL services (S1 + S2)
   - Verify: Business Model Canvas renders in Agor with revenue calculator
   - Verify: Plannotator opens plans with section-based access control
   - Verify: PAUL generates TECH-SPEC with acceptance criteria
   - Verify: Gstack `/autoplan` runs via API and reports status to HCOM
   - Merge all feature branches to main via PRs
   - Tag: `git tag -a sprint-2-business-spec-build -m "Sprint 2: BMAD + PAUL + Gstack"`

7. **Reporting Phase:**
   - Generate Sprint 2 summary report:
     - Tasks completed vs. planned
     - Agent budget spend per agent
     - Integration issues between S1 and S2
     - Known blockers or technical debt
     - Recommendations for Sprint 3

---

## CONSTRAINTS & GUARDRAILS

1. **Scope Lock:** Do NOT implement anything beyond Epics 3, 4, and 6. No DenchClaw (Epic 8), no AEGIS (Epic 7), no Gbrain auto-capture (Epic 9).

2. **Backward Compatibility:** Sprint 2 code must not break Sprint 1 features. The canvas must still pan/zoom. Paperclip API must still respond. HCOM must still route messages.

3. **Git Discipline:** Every agent works in its own branch. No direct commits to main. Merge only after validation.

4. **No Cloud Dependencies:** All core services run locally. External APIs are for agent inference only.

5. **HCOM First:** Cross-agent coordination uses HCOM messaging, not file-based coordination.

6. **Error Handling:** Every new API endpoint must have structured error responses. Every React component must have error boundaries.

7. **Performance:** New features must not degrade canvas FPS below 60. API endpoints must respond in <200ms.

8. **Integration Testing:** Every Sprint 2 feature must have at least one integration test proving it works with a Sprint 1 service.

---

## IMMEDIATE FIRST ACTIONS

Execute these in order before delegating to other agents:

1. `git checkout main && git pull` — Get latest Sprint 1 code
2. `git log --oneline -5` — Verify sprint-1-foundation tag exists
3. `pnpm install` — Install any new root dependencies
4. `turbo run build` — Verify Sprint 1 builds cleanly
5. `docker-compose -f infra/docker/docker-compose.yml up -d` — Start S1 services
6. `curl http://localhost:3001/api/v1/health` — Verify Paperclip API
7. `hcom --version` — Verify HCOM
8. Open Hermes Dashboard → Create Sprint 2 kanban board
9. `git checkout -b feat/sprint2-types` — Mistral starts here
10. Send HCOM broadcast: "All agents report in. Sprint 2 begins. Confirm your epic assignment and branch name."

---

## SUCCESS CRITERIA FOR SPRINT 2

When I run these commands from the monorepo root, everything must pass:

```bash
# 1. Monorepo builds cleanly (S1 + S2)
pnpm install && turbo run lint typecheck test build

# 2. All services start (S1 + S2)
docker-compose -f infra/docker/docker-compose.yml up -d

# 3. Canvas shows BMAD widgets
curl http://localhost:3000
# → I see Business Model Canvas template with revenue calculator

# 4. Plannotator renders plans
curl http://localhost:3003
# → I see plan review UI with business/technical section toggle

# 5. PAUL generates specs
curl -X POST http://localhost:3005/api/v1/plan   -H "Content-Type: application/json"   -d '{"prd": "Build auth system"}'
# → Returns structured plan with acceptance criteria

# 6. Gstack runs builds via API
curl -X POST http://localhost:3006/api/v1/autoplan   -H "Content-Type: application/json"   -d '{"spec": "auth system"}'
# → Returns build job ID, status trackable in HCOM dashboard

# 7. Integration: Plannotator reads Paperclip tickets
curl http://localhost:3003/api/v1/plans?source=paperclip
# → Returns plans linked to Paperclip tickets

# 8. Git history is clean
git log --oneline --graph --all
# → Feature branches exist, commits atomic, messages conventional
```

If all 8 pass, Sprint 2 is complete. Tag it and report to me.

---

*Execute now.*
