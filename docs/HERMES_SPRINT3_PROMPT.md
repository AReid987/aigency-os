# HERMES WORKSPACE — SPRINT 3 ORCHESTRATION PROMPT

## CONTEXT

Sprints 1 and 2 are **COMPLETE**. The foundation, business process, technical spec, and implementation layers are built.

You are operating inside the **Turborepo monorepo** at:
`~/CODE/00_PROJECTS/00_APPS/venture-spec-platform`

The codebase now contains:

**From Sprint 1:**
- `apps/web` — Agor canvas with pan, zoom, drag, zones, WebSocket client
- `apps/paperclip-ui` — Venture dashboard with org chart
- `apps/hcom-dashboard` — Agent monitor TUI
- `services/paperclip` — REST API for company/agent/ticket CRUD
- `services/agor` — WebSocket server
- `packages/shared-types`, `api-client`, `config`
- `infra/docker/docker-compose.yml`

**From Sprint 2:**
- `apps/plannotator-ui` — Plan review gate with section-based access
- `apps/web` — BMAD widgets (Business Model Canvas, revenue calculator, competitive analysis)
- `services/bmad` — Business methodology engine
- `services/paul` — Plan-Apply-Unify API with acceptance criteria
- `services/carl` — Dynamic rule injection
- `services/plannotator` — Plan review server
- `services/gstack` — Build skill orchestrator
- `packages/shared-types` — BMAD, PAUL, Gstack types

**Git tags:** `sprint-1-foundation`, `sprint-2-business-spec-build`

**Read the BACKLOG.md and focus on Epics 7, 8, and 9 only.** Do not touch Epic 10.

---

## SPRINT 3 SCOPE — QUALITY + CRM + KNOWLEDGE

Execute **ONLY** these three epics. Epic 10 (Deployment & DevOps) is deferred to Sprint 4.

| Epic | Name | Key Tasks | Success Criteria |
|------|------|-----------|------------------|
| **7** | Quality Gates | E7-T1 through E7-T12 | AEGIS 14-domain audit, 12-persona evaluation, epistemic confidence scoring, Transform layer (findings → PAUL remediation), grill-me stress-testing, grill-with-docs domain modeling, unit economics validation, milestone gate notifications |
| **8** | CRM & Outreach | E8-T1 through E8-T6 | DenchClaw local-first CRM on DuckDB, web UI at :3100, outreach automation (LinkedIn, email), lead enrichment, GitHub sync, integration with Paperclip Sales Agent |
| **9** | Company Brain | E9-T1 through E9-T16 | Gbrain PGLite setup, 74 MCP tools, auto-capture from all layers (Paperclip, HCOM, AEGIS, Plannotator, BMAD), hybrid search (vector + BM25), self-wiring knowledge graph, visual dashboards, LLM-wiki-v2 patterns (confidence, recency, contradiction), per-user scoping |

---

## ASSUMPTIONS FROM SPRINTS 1 & 2

1. All services from S1 and S2 start with `docker-compose up -d`
2. HCOM hooks are installed for all agents
3. `pnpm install` and `turbo run build` work at root
4. Git branches from S1 and S2 merged to `main`
5. Canvas renders at `localhost:3000`
6. Paperclip API at `localhost:3001`
7. PAUL API at `localhost:3005`
8. Plannotator at `localhost:3003`
9. Gstack at `localhost:3006`
10. HCOM dashboard at `localhost:3004`

**Agents must build ON TOP of existing code, not replace it.**

---

## AGENT ROSTER & DELEGATION (10 PARALLEL AGENTS)

Spawn each agent in a dedicated Hermes Workspace pane. Every agent must run inside an HCOM-wrapped session.

| Agent | Model Source | Budget | Epic | Tasks | Git Branch | Why This Agent |
|-------|-------------|--------|------|-------|------------|----------------|
| **Claude Code** | freemodel.dev | **$8/session hard cap** | E7 | AEGIS dashboard UI: 14-domain risk heatmap, findings list, executive summary view, approval actions | `feat/epic-7-aegis-ui` | Best React/TypeScript for complex data viz |
| **Opencode Go** | DeepSeek V4 | $5 plan (~$0.50/task) | E7 | AEGIS audit engine: 14-domain evaluation logic, 12 persona system, epistemic confidence scoring, Devil's Advocate implementation | `feat/epic-7-aegis-engine` | Cheap, good at structured evaluation logic |
| **Kimi Code** | $40 plan | ~$2-3/task | E7 | AEGIS Transform + integration: findings → PAUL-compatible remediation plans, risk scoring, dependency ordering, milestone gate API | `feat/epic-7-aegis-transform` | Strong at structured output + API design |
| **OMP** | Cerebras (free tier) | Free | E8 | DenchClaw CRM backend: DuckDB schema, contact/deal/outreach models, API endpoints, GitHub sync | `feat/epic-8-denchclaw` | Fast inference, good for data models |
| **Mimo Code** | $20 API + free tier | Free tier first | E8 | DenchClaw web UI: contact management, deal pipeline, outreach dashboard, LinkedIn/email integration | `feat/epic-8-crm-ui` | Free tier covers UI scaffolding |
| **Command Code** | $1 plan (DeepSeek V4) | ~$0.20/task | E9 | Gbrain auto-capture pipeline: listeners for Paperclip, HCOM, AEGIS, Plannotator, BMAD events; page creation with YAML frontmatter | `feat/epic-9-capture` | Cheapest — perfect for pipeline glue |
| **Blackbox** | Free tier | Free | E9 | Gbrain search + graph: hybrid search (vector + BM25), self-wiring knowledge graph, query interface | `feat/epic-9-search` | Good at search algorithms |
| **Rovo Dev** | GitHub Copilot | Free (included) | Shared | Integration tests for all Epic 7/8/9 code, cross-epic integration tests (AEGIS → PAUL, DenchClaw → Paperclip, Gbrain → all) | `feat/sprint3-tests` | IDE-native, excellent for integration tests |
| **Groq API** | Free tier | Free | Overflow | Documentation: README updates, API endpoint docs, docker-compose additions, architecture diagram updates | `feat/sprint3-docs` | Lightning fast for docs |
| **Mistral** | Free tier | Free | Overflow | Shared package updates: new types for AEGIS, DenchClaw, Gbrain in `@vscp/shared-types` | `feat/sprint3-types` | Solid for type definitions |

**Budget Safety Rules:**
- Claude Code (freemodel.dev): **Hard stop at $8.00/session.** If approaching, reassign to Opencode or Kimi.
- Kimi Code: Use for complex backend logic only.
- Mimo Code: Exhaust free tier before touching the $20 API balance.
- All other agents: Use freely. No hard caps.
- Track approximate spend per agent in Hermes Dashboard kanban. Update every 15 minutes.

---

## TURBOREPO RULES (Sprint 3)

1. **New apps/packages must follow existing S1/S2 patterns.**
2. **Workspace Protocol:** All new packages use `"@vscp/shared-types": "workspace:*"`.
3. **Pipeline:** Every new app/package must have `turbo.json` with `build`, `dev`, `lint`, `test`, `typecheck`.
4. **Dependency Order:** If `@vscp/shared-types` changes, all dependent apps must rebuild.
5. **Validation:** Before declaring any epic "done", run `turbo run build` at root. Zero errors.
6. **No duplicate dependencies:** Check root `package.json` before adding new packages.

---

## HCOM COMMUNICATION RULES (Sprint 3)

1. **Status Broadcasts:** Every agent must report status every 15 minutes:
   ```bash
   hcom broadcast "Claude: E7-T3 complete, moving to E7-T4. Budget: $3.20/$8.00"
   ```

2. **Sprint 1 & 2 Integration:** Agents must verify previous services are running before testing Sprint 3 code:
   ```bash
   curl http://localhost:3001/api/v1/health && echo "Paperclip OK"
   curl http://localhost:3005/api/v1/health && echo "PAUL OK"
   curl http://localhost:3003/api/v1/health && echo "Plannotator OK"
   curl http://localhost:3006/api/v1/health && echo "Gstack OK"
   ```

3. **Collision Detection:** HCOM collision detection is ON. Escalate immediately if triggered.

4. **Hermes Monitoring:** You must monitor HCOM TUI and escalate blocked agents within 10 minutes.

---

## MONOREPO STRUCTURE (Sprint 3 Additions)

```
venture-spec-platform/
├── apps/
│   ├── web/                    # [S1/S2] — ADD: Gbrain dashboard embed, AEGIS milestone cards
│   ├── paperclip-ui/           # [S1] — ADD: DenchClaw deal pipeline view
│   ├── plannotator-ui/         # [S2] — ADD: AEGIS audit trigger button
│   ├── hcom-dashboard/         # [S1] — ADD: Gbrain query interface, AEGIS status
│   ├── aegis-dashboard/        # [NEW] AEGIS risk heatmap + findings UI
│   ├── denchclaw-ui/           # [NEW] CRM web UI (React + Vite)
│   └── gbrain-dashboard/       # [NEW] Knowledge graph + query UI
├── packages/
│   ├── shared-types/           # [S1/S2] — ADD: AEGIS, DenchClaw, Gbrain types
│   ├── api-client/             # [S1/S2] — ADD: AEGIS, DenchClaw, Gbrain clients
│   ├── ui/                     # [S2] — ADD: heatmap, graph, pipeline components
│   └── config/                 # [S1] — no changes expected
├── services/
│   ├── agor/                   # [S1] — ADD: Gbrain artifact rendering
│   ├── paperclip/              # [S1/S2] — ADD: DenchClaw deal webhooks
│   ├── bmad/                   # [S2] — ADD: AEGIS audit trigger hooks
│   ├── paul/                   # [S2] — ADD: AEGIS Transform remediation consumer
│   ├── carl/                   # [S2] — ADD: AEGIS domain rules
│   ├── gstack/                 # [S2] — ADD: AEGIS QA skill
│   ├── plannotator/            # [S2] — ADD: AEGIS executive summary view
│   ├── aegis/                  # [NEW] 14-domain audit engine
│   ├── denchclaw/              # [NEW] CRM API (Node.js + DuckDB)
│   ├── gbrain/                 # [NEW] Knowledge brain API (Bun + PGLite)
│   └── hcom/                   # [external] — NO TOUCH
├── infra/
│   └── docker/
│       └── docker-compose.yml  # [S1/S2] — ADD: aegis, denchclaw, gbrain services
├── docs/                       # 6 BMAD documents
└── turbo.json                  # [S1/S2] — ADD: new app/package pipelines
```

**Agents must write code INTO this structure.** No new top-level directories.

---

## TECH STACK PER EPIC

### Epic 7: Quality Gates (Claude + Opencode + Kimi)
- **AEGIS Engine:** Node.js with 14 evaluation domains, 12 persona system
- **Epistemic Scoring:** Confidence scores (0-1) with evidence citation
- **Transform Layer:** Converts findings into PAUL-compatible `PROJECT.md` + `ROADMAP.md`
- **Dashboard:** React + Recharts for risk heatmap, D3 for findings graph
- **Integration:** Triggers PAUL remediation, renders milestone cards in Agor

### Epic 8: CRM & Outreach (OMP + Mimo)
- **Backend:** Node.js + DuckDB (local-first)
- **Web UI:** React + Vite at `localhost:3100`
- **Models:** Contact, Deal, Pipeline, OutreachSequence, Lead
- **Automation:** LinkedIn prospecting, email sequences, lead enrichment
- **Sync:** GitHub/iCloud sync for team collaboration
- **Integration:** Paperclip Sales Agent reads/writes DenchClaw via API

### Epic 9: Company Brain (Command + Blackbox)
- **Engine:** Bun + PGLite (2-second setup)
- **MCP Server:** 74 tools for agent integration
- **Auto-Capture:** Event listeners on all services (Paperclip, HCOM, AEGIS, Plannotator, BMAD)
- **Search:** Hybrid vector + BM25 with pgvector
- **Graph:** Self-wiring connections between related pages
- **Dashboard:** React + D3 force-directed graph, natural language query bar
- **LLM-wiki-v2 Patterns:** YAML frontmatter, confidence scoring, recency markers, contradiction detection, supersession links
- **Per-User Scoping:** Domain expert sees business context; technical founder sees all

---

## SHARED PACKAGES (Mistral + Rovo)

### `@vscp/shared-types` (Mistral)
Add these types to `packages/shared-types/src/`:
- `aegis.ts` — AuditDomain, Finding, Persona, ConfidenceScore, RemediationPlan
- `denchclaw.ts` — Contact, Deal, PipelineStage, OutreachSequence, Lead
- `gbrain.ts` — KnowledgePage, PageType, QueryResult, GraphData, Frontmatter
- Update `index.ts` to re-export all

### `@vscp/api-client` (Rovo)
Add these clients to `packages/api-client/src/`:
- `aegis.ts` — Audit trigger, findings retrieval, executive summary
- `denchclaw.ts` — Contact CRUD, deal pipeline, outreach automation
- `gbrain.ts` — Page creation, query, graph retrieval
- Tests for all new clients using Vitest + MSW

---

## DOCKER COMPOSE (Groq)

Update `infra/docker/docker-compose.yml` to add:
- **aegis-service** — Node.js 14-domain audit engine
- **denchclaw-service** — Node.js CRM API + DuckDB
- **gbrain-service** — Bun knowledge brain API + PGLite

All services must:
- Connect to existing PostgreSQL (where applicable)
- Expose health check endpoints at `/health`
- Use internal Docker network
- Mount local code as volume for dev mode

Validate: `docker-compose -f infra/docker/docker-compose.yml up -d` starts ALL services (S1 + S2 + S3) without errors.

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
- [ ] **Integration with S1/S2 verified:** Feature works with at least one previous service

---

## PROCESS INSTRUCTIONS

1. **Read Phase (10 minutes):**
   - Read BACKLOG.md Epics 7, 8, 9
   - Review existing Sprint 1 and 2 code in `apps/`, `services/`, `packages/`
   - Identify which S1/S2 APIs need to be extended for S3 features

2. **Setup Phase (15 minutes):**
   - Open Hermes Dashboard → Create Sprint 3 kanban board
   - Run `git checkout main && git pull` to get latest S2 code
   - Run `pnpm install` at root
   - Run `docker-compose -f infra/docker/docker-compose.yml up -d` to verify S1+S2 services
   - Verify `turbo run build` passes with S1+S2 code
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

5. **Integration Phase (Critical for Sprint 3):**
   - After each epic completes, verify cross-sprint integration:
     - AEGIS audit findings trigger PAUL remediation plans
     - AEGIS executive summary renders in Agor milestone cards
     - DenchClaw deals sync to Paperclip Sales Agent dashboard
     - Gbrain auto-captures AEGIS audit reports
     - Gbrain auto-captures Plannotator annotations
     - Gbrain auto-captures BMAD PRDs
     - Gbrain query returns results from all layers
   - Run `turbo run lint typecheck test build` at root
   - Run full docker-compose and verify all services healthy

6. **Validation Phase (End of Sprint):**
   - Run `turbo run lint typecheck test build` at root — must pass with zero errors
   - Run `docker-compose -f infra/docker/docker-compose.yml up -d` — must start ALL services (S1 + S2 + S3)
   - Verify: AEGIS dashboard shows 14-domain risk heatmap with color coding
   - Verify: AEGIS audit can be triggered via API and produces findings
   - Verify: AEGIS Transform converts findings to PAUL-compatible plan
   - Verify: DenchClaw CRM at `localhost:3100` shows contacts and deal pipeline
   - Verify: Gbrain dashboard shows knowledge graph with connections
   - Verify: Gbrain query returns results from Paperclip, AEGIS, Plannotator, BMAD
   - Verify: Domain expert sees scoped Gbrain view (business only)
   - Verify: Technical founder sees full Gbrain view
   - Merge all feature branches to main via PRs
   - Tag: `git tag -a sprint-3-quality-crm-brain -m "Sprint 3: AEGIS + DenchClaw + Gbrain"`

7. **Reporting Phase:**
   - Generate Sprint 3 summary report:
     - Tasks completed vs. planned
     - Agent budget spend per agent
     - Integration issues between S1/S2 and S3
     - Known blockers or technical debt
     - Recommendations for Sprint 4 (Epic 10: Deployment)

---

## CONSTRAINTS & GUARDRAILS

1. **Scope Lock:** Do NOT implement Epic 10 (Deployment & DevOps). That is Sprint 4. No CI/CD pipelines, no monitoring, no scaling work yet.

2. **Backward Compatibility:** Sprint 3 code must not break Sprint 1 or 2 features. Canvas, Paperclip, PAUL, Plannotator, Gstack must all continue working.

3. **Git Discipline:** Every agent works in its own branch. No direct commits to main. Merge only after validation.

4. **No Cloud Dependencies:** All core services run locally. External APIs are for agent inference only.

5. **HCOM First:** Cross-agent coordination uses HCOM messaging, not file-based coordination.

6. **Error Handling:** Every new API endpoint must have structured error responses. Every React component must have error boundaries.

7. **Performance:** New features must not degrade canvas FPS below 60. Gbrain queries must return in <500ms. AEGIS audit must complete in <30s for lightweight mode.

8. **Integration Testing:** Every Sprint 3 feature must have at least one integration test proving it works with a Sprint 1 or 2 service.

9. **Data Privacy:** Gbrain auto-capture must respect per-user scoping. Domain expert data must not leak to technical-only views.

---

## IMMEDIATE FIRST ACTIONS

Execute these in order before delegating to other agents:

1. `git checkout main && git pull` — Get latest Sprint 2 code
2. `git log --oneline --grep="sprint-2"` — Verify sprint-2-business-spec-build tag exists
3. `pnpm install` — Install any new root dependencies
4. `turbo run build` — Verify Sprint 1+2 builds cleanly
5. `docker-compose -f infra/docker/docker-compose.yml up -d` — Start S1+S2 services
6. `curl http://localhost:3001/api/v1/health` — Verify Paperclip
7. `curl http://localhost:3005/api/v1/health` — Verify PAUL
8. `curl http://localhost:3003/api/v1/health` — Verify Plannotator
9. `curl http://localhost:3006/api/v1/health` — Verify Gstack
10. `hcom --version` — Verify HCOM
11. Open Hermes Dashboard → Create Sprint 3 kanban board
12. `git checkout -b feat/sprint3-types` — Mistral starts here
13. Send HCOM broadcast: "All agents report in. Sprint 3 begins. Confirm your epic assignment and branch name."

---

## SUCCESS CRITERIA FOR SPRINT 3

When I run these commands from the monorepo root, everything must pass:

```bash
# 1. Monorepo builds cleanly (S1 + S2 + S3)
pnpm install && turbo run lint typecheck test build

# 2. All services start (S1 + S2 + S3)
docker-compose -f infra/docker/docker-compose.yml up -d

# 3. AEGIS dashboard renders risk heatmap
curl http://localhost:3007
# → I see 14-domain heatmap with color-coded risk levels

# 4. AEGIS audit triggers and produces findings
curl -X POST http://localhost:3007/api/v1/audit   -H "Content-Type: application/json"   -d '{"project": "auth-system", "domains": ["security", "performance"]}'
# → Returns severity-ranked findings with confidence scores

# 5. AEGIS Transform produces PAUL-compatible plan
curl -X POST http://localhost:3007/api/v1/transform   -H "Content-Type: application/json"   -d '{"audit_id": "audit-001"}'
# → Returns PROJECT.md + ROADMAP.md with risk-scored tasks

# 6. DenchClaw CRM shows contacts and pipeline
curl http://localhost:3100
# → I see contact list and deal pipeline kanban

# 7. DenchClaw API responds
curl http://localhost:3101/api/v1/health
# → {"status": "ok"}

# 8. Gbrain dashboard shows knowledge graph
curl http://localhost:3008
# → I see force-directed graph with query bar

# 9. Gbrain auto-captured data from all layers
curl http://localhost:3008/api/v1/query?q="What was our pricing decision?"
# → Returns answer with confidence score and evidence sources

# 10. Gbrain per-user scoping works
curl -H "X-User-Role: domain_expert" http://localhost:3008/api/v1/query?q="architecture"
# → Returns business context only, no technical details

# 11. Integration: AEGIS findings appear in Agor milestone cards
curl http://localhost:3000/api/v1/cards?type=milestone
# → Returns cards with AEGIS risk flags

# 12. Integration: DenchClaw deals sync to Paperclip
curl http://localhost:3001/api/v1/tickets?source=denchclaw
# → Returns tickets linked to CRM deals

# 13. Git history is clean
git log --oneline --graph --all
# → Feature branches exist, commits atomic, messages conventional
```

If all 13 pass, Sprint 3 is complete. Tag it and report to me.

---

*Execute now.*
