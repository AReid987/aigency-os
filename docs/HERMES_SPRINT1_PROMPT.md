# HERMES WORKSPACE — SPRINT 1 ORCHESTRATION PROMPT

## CONTEXT

You are operating inside a **Turborepo monorepo** at:
`~/CODE/00_PROJECTS/00_APPS/venture-spec-platform`

The `./docs/` directory contains 6 BMAD-method documents:
- `PROJECT_BRIEF.md` — PRFAQ, vision, competitive landscape, GTM
- `PRD.md` — Full requirements, user stories, functional specs, API specs, data model
- `ARCHITECTURE.md` — 8-layer system architecture, component breakdown, deployment, security
- `UI_UX.md` — Design philosophy, personas, screen designs, component library, interaction patterns
- `FRONTEND_ARCHITECTURE.md` — React/Vite stack, state management, component architecture, testing
- `BACKLOG.md` — 10 epics, 100+ tasks, sprint plan, definition of done

**Read all 6 documents before taking any action.**

---

## YOUR ECOSYSTEM

You have access to:
- **Hermes Workspace** — Multi-pane terminal layout (you are here)
- **Hermes Dashboard** — Web UI kanban, agent status, cost tracking
- **Hermes Desktop** — macOS menu bar for quick actions and notifications
- **HCOM** — Agent communication layer (installed, hooks needed for most agents)
- **Turborepo** — Monorepo build orchestration with remote caching

**Use all three Hermes interfaces.** Open the Dashboard now and create a kanban board.

---

## SPRINT 1 SCOPE — FOUNDATION LAYER

Execute **ONLY** these three epics. Do not touch Epics 3, 4, 6, 7, 8, 9, or 10.

| Epic | Name | Key Tasks | Success Criteria |
|------|------|-----------|------------------|
| **1** | Agor Canvas Foundation | E1-T1 through E1-T8 (minimum), E1-T12, E1-T13 | Infinite canvas with pan, zoom, drag, zones, cards, WebSocket sync, embeds |
| **2** | Paperclip Venture Orchestration | E2-T1 through E2-T8 (minimum), E2-T11 | Company CRUD, org chart, agent hiring, heartbeat mock, budget tracking, ticket system |
| **5** | HCOM Agent Communication | E5-T1 through E5-T8 (minimum) | HCOM hooks for all agents, TUI dashboard, message bus, collision detection, lifecycle |

---

## AGENT ROSTER & DELEGATION (10 PARALLEL AGENTS)

Spawn each agent in a dedicated Hermes Workspace pane. Every agent must run inside an HCOM-wrapped session.

| Agent | Model Source | Budget | Epic | Tasks | Git Branch | Why This Agent |
|-------|-------------|--------|------|-------|------------|----------------|
| **Claude Code** | freemodel.dev | **$8/session hard cap** | E1 | Canvas React app: Vite + TS + Tailwind, infinite canvas, pan/zoom, draggable cards, zones, WebSocket client | `feat/epic-1-canvas` | Best React/TypeScript reasoning |
| **Opencode Go** | DeepSeek V4 | $5 plan (~$0.50/task) | E1 | Micro-frontend embed shell: iframe sandbox, postMessage bridge, service discovery | `feat/epic-1-embeds` | Cheap, good at component wiring |
| **Kimi Code** | $40 plan | ~$2-3/task | E2 | Paperclip API: Express/Fastify, PostgreSQL schema, company/agent/ticket/budget CRUD, REST endpoints | `feat/epic-2-paperclip` | Strong API design + database modeling |
| **OMP** | Cerebras (free tier) | Free | E2 | Paperclip dashboard UI: org chart (D3/React Flow), ticket board, budget tracker, agent cards | `feat/epic-2-dashboard` | Fast inference, good for data viz |
| **Mimo Code** | $20 API + free tier | Free tier first | E5 | HCOM dashboard React: agent list, message feed, status rings, terminal preview panes | `feat/epic-5-hcom-ui` | Free tier covers UI scaffolding |
| **Command Code** | $1 plan (DeepSeek V4) | ~$0.20/task | E5 | HCOM backend: SQLite schema, message bus API, hook installation scripts, collision detection logic | `feat/epic-5-hcom-api` | Cheapest — perfect for infrastructure |
| **Blackbox** | Free tier | Free | Shared | `@aigency-os/shared-types`: TypeScript interfaces for canvas, agent, user, brain, ticket, card, zone | `feat/shared-types` | Good at boilerplate TypeScript |
| **Rovo Dev** | GitHub Copilot | Free (included) | Shared | `@aigency-os/api-client`: Fetch wrappers, WebSocket client, error handling, retry logic, tests | `feat/api-client` | IDE-native, excellent for test writing |
| **Groq API** | Free tier | Free | Overflow | Documentation: README per app, docker-compose validation, root scripts | `feat/docs` | Lightning fast for docs |
| **Mistral** | Free tier | Free | Overflow | Shared config: ESLint preset, Prettier config, root `package.json` scripts, `turbo.json` | `feat/config` | Solid for config files |

**Budget Safety Rules:**
- Claude Code (freemodel.dev): **Hard stop at $8.00/session.** If approaching, pause immediately and reassign task to Opencode Go or Kimi Code.
- Kimi Code: Use for complex backend logic only. Do not use for simple CRUD or documentation.
- Mimo Code: Exhaust free tier before touching the $20 API balance.
- All other agents: Use freely. No hard caps.
- Track approximate spend per agent in the Hermes Dashboard kanban. Update every 15 minutes.

---

## TURBOREPO RULES

1. **Package Manager:** All agents use `pnpm`. Run `pnpm install` at root before any agent starts coding.
2. **Workspace Protocol:** Local packages reference each other via `"@aigency-os/shared-types": "workspace:*"` — never relative paths.
3. **Pipeline:** Every app/package must have a `turbo.json` with these tasks: `build`, `dev`, `lint`, `test`, `typecheck`.
4. **Dependency Order:** Shared packages (`shared-types`, `api-client`, `ui`, `config`) must build before apps. Use `dependsOn: ["^build"]`.
5. **Validation:** Before declaring any epic "done", run `turbo run build` at root. Zero errors required.
6. **Caching:** Remote caching is enabled. Agents should not rebuild packages already cached.

---

## HCOM COMMUNICATION RULES

1. **Hook Installation:** Before Sprint 1 begins, install HCOM hooks for ALL agents:
   ```bash
   hcom claude --install-hooks
   hcom kimi --install-hooks
   hcom omp --install-hooks
   hcom mimo --install-hooks
   hcom opencode --install-hooks
   hcom command --install-hooks
   hcom blackbox --install-hooks
   hcom groq --install-hooks
   hcom mistral --install-hooks
   ```
   If an agent does not support auto-hooks, use `hcom start` inside its terminal session.

2. **Session Wrapping:** Every agent must spawn with `hcom <agent-name>` as the prefix. Example: `hcom claude` not just `claude`.

3. **Status Broadcasts:** Every agent must report status every 15 minutes via HCOM:
   ```bash
   hcom broadcast "Claude: E1-T3 complete, starting E1-T4. Budget: $2.10/$8.00"
   ```

4. **Collision Detection:** HCOM collision detection is ON. If two agents edit the same file within 30 seconds, both receive an alert. Escalate to me immediately if this happens.

5. **Hermes Monitoring:** You (Hermes) must monitor the HCOM TUI (`hcom` command) and escalate blocked agents to me within 10 minutes.

---

## MONOREPO STRUCTURE (Already Scaffolded)

```
venture-spec-platform/
├── apps/
│   ├── web/                    # Agor canvas shell (React + Vite + Tailwind)
│   ├── paperclip-ui/           # Paperclip dashboard (React + Vite)
│   ├── plannotator-ui/         # Plan review gate (placeholder for Sprint 2)
│   ├── hcom-dashboard/         # Agent monitor TUI (React + Vite)
│   └── gbrain-dashboard/       # Knowledge visualizer (placeholder for Sprint 2)
├── packages/
│   ├── shared-types/           # TypeScript interfaces (zero runtime deps)
│   ├── api-client/             # Fetch wrappers + WebSocket client
│   ├── ui/                     # Shared component library (Tailwind + Radix)
│   └── config/                 # ESLint, TS, Tailwind presets
├── services/
│   ├── agor/                   # Node.js WebSocket server (placeholder)
│   ├── paperclip/              # Node.js API server (Epic 2)
│   ├── gbrain/                 # Bun API server (placeholder)
│   ├── plannotator/            # Node.js plan review (placeholder)
│   └── hcom/                   # Rust binary (external, NOT in monorepo)
├── infra/
│   └── docker/
│       └── docker-compose.yml  # PostgreSQL + placeholder services
├── docs/                       # 6 BMAD documents
├── turbo.json                  # Root pipeline config
├── pnpm-workspace.yaml         # pnpm workspace definition
└── package.json                # Root scripts + devDependencies
```

**Agents must write code INTO this structure.** Do not create new top-level directories.

---

## TECH STACK PER EPIC

### Epic 1: Agor Canvas (Claude + Opencode)
- **Framework:** React 19 + TypeScript 5.5 + Vite 6
- **Styling:** Tailwind CSS 4 + Radix UI primitives
- **Canvas:** Fabric.js or PixiJS (choose based on PRD requirements)
- **State:** Zustand 5 (lightweight, no Provider boilerplate)
- **Queries:** TanStack Query 5 (server state, caching)
- **Real-time:** Socket.io-client 4 (WebSocket sync)
- **Icons:** Lucide React
- **Testing:** Vitest (unit) + Playwright (E2E)

### Epic 2: Paperclip (Kimi + OMP)
- **Backend:** Express.js or Fastify (Node.js)
- **Database:** PostgreSQL 16 (via Docker)
- **ORM:** Prisma or Drizzle (type-safe, migration-friendly)
- **Frontend:** React 19 + Vite + Tailwind (same as Epic 1)
- **Visualization:** D3.js or React Flow (org chart)
- **Scheduling:** node-cron or BullMQ (heartbeat scheduler)

### Epic 5: HCOM (Mimo + Command)
- **Backend:** SQLite (already installed by HCOM) + optional REST wrapper
- **Frontend:** React 19 + Vite + Tailwind (agent monitor UI)
- **Communication:** HCOM Rust binary (external) + JavaScript bridge
- **Terminal:** tmux (session persistence) + amux (optional upgrade)

---

## SHARED PACKAGES (Blackbox + Rovo + Mistral)

### `@aigency-os/shared-types` (Blackbox)
Define these types in `packages/shared-types/src/`:
- `canvas.ts` — Card, Zone, Position, CardType
- `agent.ts` — Agent, Task, Ticket, AgentStatus, Message
- `user.ts` — User, Role, Permission, UserRole
- `brain.ts` — KnowledgePage, PageType, QueryResult, GraphData
- `company.ts` — Company, Goal, Budget, OrgChartNode
- `index.ts` — Re-exports all

### `@aigency-os/api-client` (Rovo)
Build these clients in `packages/api-client/src/`:
- `agor.ts` — WebSocket client for canvas sync
- `paperclip.ts` — REST client for company/agent/ticket CRUD
- `gbrain.ts` — REST client for knowledge query (placeholder)
- `hcom.ts` — REST client for agent status/messages
- `index.ts` — Re-exports all
- Include tests for all clients using Vitest + MSW

### `@aigency-os/config` (Mistral)
Create in `packages/config/`:
- `eslint-preset.js` — Shared ESLint config (TypeScript, React, import sorting)
- `tsconfig-base.json` — Shared TypeScript config (strict, esnext, jsx react-jsx)
- `tailwind-preset.js` — Shared Tailwind config (colors, fonts, spacing)

---

## DOCKER COMPOSE (Groq)

Create `infra/docker/docker-compose.yml` with:
- **PostgreSQL 16** — For Paperclip, Agor persistence, Gbrain
- **Redis** (optional) — For canvas state caching, session store
- **Placeholder services** — For Agor, Paperclip, Gbrain (build from local Dockerfiles)
- **Volumes** — Named volumes for PostgreSQL data, Redis data
- **Network** — Internal Docker network for service-to-service communication

Validate: `docker-compose -f infra/docker/docker-compose.yml up -d` must start without errors.

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

---

## PROCESS INSTRUCTIONS

1. **Read Phase (10 minutes):**
   - Read all 6 documents in `./docs/`
   - Identify task dependencies from BACKLOG.md
   - Note which tasks in Epics 1, 2, 5 have dependencies on shared packages

2. **Setup Phase (15 minutes):**
   - Open Hermes Dashboard → Create kanban board with columns: Backlog, In Progress, Review, Done
   - Run `pnpm install` at monorepo root
   - Verify `turbo run build` runs (will fail on empty packages — that's expected)
   - Install HCOM hooks for all 10 agents
   - Spawn all 10 agents in Hermes Workspace panes with HCOM wrapping

3. **Delegation Phase (10 minutes):**
   - Assign tasks to agents via HCOM broadcast
   - Each agent checks out its own branch: `git checkout -b feat/epic-X-name`
   - Shared package agents (Blackbox, Rovo, Mistral) start FIRST — other agents depend on them
   - Wait for `shared-types` and `config` to be committed before starting app agents

4. **Execution Phase (Ongoing):**
   - Monitor HCOM TUI every 15 minutes
   - Monitor Hermes Dashboard kanban every 15 minutes
   - Track agent budgets in Dashboard
   - If any agent is blocked for >10 minutes, escalate to me immediately
   - If Claude approaches $8.00, PAUSE and reassign to Opencode or Kimi

5. **Validation Phase (End of Sprint):**
   - Run `turbo run lint typecheck test build` at root — must pass with zero errors
   - Run `docker-compose -f infra/docker/docker-compose.yml up -d` — must start all services
   - Verify canvas renders in browser with pan, zoom, drag, zones
   - Verify Paperclip API responds to CRUD requests
   - Verify HCOM dashboard shows agent statuses
   - Merge all feature branches to main via PRs (or fast-forward if clean)
   - Tag: `git tag -a sprint-1-foundation -m "Sprint 1: Agor + Paperclip + HCOM"`

6. **Reporting Phase:**
   - Generate a Sprint 1 summary report including:
     - Tasks completed vs. planned
     - Agent budget spend per agent
     - Known blockers or technical debt
     - Recommendations for Sprint 2

---

## CONSTRAINTS & GUARDRAILS

1. **Scope Lock:** Do NOT implement anything beyond Epics 1, 2, and 5. If an agent finishes early, have them write tests, documentation, or refine existing code. Do NOT start Epic 3, 4, 6, 7, 8, 9, or 10.

2. **Git Discipline:** Every agent works in its own branch. No direct commits to main. Merge only after validation.

3. **No Cloud Dependencies:** All core services must run locally. External APIs (Claude, Kimi, etc.) are for agent inference only — not for the platform's runtime.

4. **Agent API Keys:** Store all API keys in `.env.local` at root. Never commit keys. Use `.env.example` for templates.

5. **HCOM First:** If two agents need to coordinate, they must use HCOM messaging, not file-based coordination. File edits are for code; HCOM is for status and decisions.

6. **Error Handling:** Every API endpoint must have structured error responses. Every React component must have error boundaries. No unhandled exceptions in production code.

7. **Performance:** Canvas must maintain 60fps during pan/zoom. API endpoints must respond in <200ms. WebSocket messages must deliver in <100ms.

---

## IMMEDIATE FIRST ACTIONS

Execute these in order before delegating to other agents:

1. `cat ./docs/PROJECT_BRIEF.md ./docs/PRD.md ./docs/ARCHITECTURE.md ./docs/UI_UX.md ./docs/FRONTEND_ARCHITECTURE.md ./docs/BACKLOG.md` — Read all docs
2. `pnpm install` — Install root dependencies
3. `git checkout -b feat/shared-types` — Blackbox starts here
4. `git checkout -b feat/config` — Mistral starts here
5. `hcom --version` — Verify HCOM is installed
6. `hcom claude --install-hooks` — Install hooks for all agents (loop through roster)
7. Open Hermes Dashboard → Create kanban board
8. Send HCOM broadcast: "All agents report in. Confirm your epic assignment and branch name."

---

## SUCCESS CRITERIA FOR SPRINT 1

When I run these commands from the monorepo root, everything must pass:

```bash
# 1. Monorepo builds cleanly
pnpm install && turbo run lint typecheck test build

# 2. Docker services start
 docker-compose -f infra/docker/docker-compose.yml up -d

# 3. Canvas renders in browser
open http://localhost:3000
# → I see an infinite canvas with amber Business Zone and blue Engineering Zone
# → I can pan, zoom, drag cards, see multiplayer cursors

# 4. Paperclip API responds
curl http://localhost:3001/api/v1/health
# → {"status": "ok"}

# 5. HCOM dashboard shows agents
open http://localhost:3004
# → I see a list of agents with status rings and a message feed

# 6. Git history is clean
git log --oneline --graph --all
# → Feature branches exist, commits are atomic, messages are conventional
```

If all 6 pass, Sprint 1 is complete. Tag it and report to me.

---

*Execute now.*
