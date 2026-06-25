# PRODUCT BACKLOG

**Project:** Venture Spec Collaboration Platform  
**Version:** 1.0  
**Date:** 2026-06-24  
**Template:** BMAD Method — Epics & Tasks  
**Status:** Ready for Sprint Planning  

---

## How to Read This Backlog

- **Epics** are major deliverables that span multiple sprints
- **Tasks** are actionable items that can be completed in 1-3 days
- **Priority:** P0 = Must have for MVP, P1 = Should have, P2 = Nice to have
- **Dependencies:** Tasks marked with `→` must be completed before the dependent task
- **Owner:** Primary responsible party (Frontend, Backend, DevOps, Agent)

---

## EPIC 1: Agor Canvas Foundation
**Goal:** Build the shared multiplayer visual canvas with role-based zones
**Priority:** P0  
**Estimated Duration:** 2 weeks  
**Dependencies:** None  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E1-T1 | Scaffold Agor web app with Vite + React + TypeScript + Tailwind | P0 | Frontend | 1 | None | `pnpm dev` runs, hot reload works, TypeScript compiles |
| E1-T2 | Implement infinite canvas with Fabric.js/PixiJS rendering | P0 | Frontend | 3 | E1-T1 | Canvas pans smoothly, zooms 0.1x-3x, grid visible, 60fps |
| E1-T3 | Build draggable card system with snap-to-grid | P0 | Frontend | 2 | E1-T2 | Cards drag, snap to 20px grid, collision detection, selection box |
| E1-T4 | Create zone system: Business Zone (amber) + Engineering Zone (blue) | P0 | Frontend | 2 | E1-T2 | Zones render with distinct colors, cards belong to zones, zone headers visible |
| E1-T5 | Implement WebSocket server for real-time sync | P0 | Backend | 3 | E1-T1 | WebSocket accepts connections, broadcasts cursor moves, card updates, presence |
| E1-T6 | Add multiplayer cursors and presence indicators | P0 | Frontend | 2 | E1-T5 | Cursors visible for all users, names shown, smooth interpolation |
| E1-T7 | Implement RBAC: DE full access to Business, read-only to Engineering | P0 | Frontend | 2 | E1-T4 | DE cannot drag cards in Engineering Zone, cannot create Engineering cards, sees read-only badge |
| E1-T8 | Build card types: text, image, link, embed | P0 | Frontend | 2 | E1-T3 | All card types render correctly, content editable inline, images lazy-load |
| E1-T9 | Add floating toolbar: +Card, +Zone, +Agent, +Preview, Brain Query | P1 | Frontend | 2 | E1-T3 | Toolbar floats, auto-hides, all buttons functional |
| E1-T10 | Implement minimap and zoom controls | P1 | Frontend | 1 | E1-T2 | Minimap shows viewport rectangle, click-to-navigate, zoom slider |
| E1-T11 | Add undo/redo history for canvas actions | P1 | Frontend | 1 | E1-T3 | Ctrl+Z undoes last action, Ctrl+Y redoes, history persists per session |
| E1-T12 | Build card embed system for micro-frontends (iframe + postMessage) | P0 | Frontend | 3 | E1-T8 | Embeds render in cards, resize correctly, communicate via postMessage, sandboxed |
| E1-T13 | Implement auto-save to PostgreSQL | P0 | Backend | 2 | E1-T5 | Canvas state saves every 5s, restores on reload, handles conflicts |
| E1-T14 | Add search and filter for cards | P1 | Frontend | 1 | E1-T8 | Search bar finds cards by text, filters by type, highlights results |

---

## EPIC 2: Paperclip Venture Orchestration
**Goal:** Integrate Paperclip for AI company management with org charts, budgets, and heartbeats
**Priority:** P0  
**Estimated Duration:** 2 weeks  
**Dependencies:** E1 (Agor Canvas)  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E2-T1 | Install and configure Paperclip locally (Node.js + PostgreSQL) | P0 | DevOps | 1 | None | `pnpm dev` runs Paperclip at localhost:3001, database migrations applied |
| E2-T2 | Create company creation flow: name, mission, goal | P0 | Frontend | 2 | E2-T1 | Form validates, creates company, redirects to dashboard |
| E2-T3 | Build org chart visualization with D3.js or React Flow | P0 | Frontend | 3 | E2-T2 | Org chart renders hierarchically, reporting lines visible, avatars shown, interactive |
| E2-T4 | Implement agent hiring flow: role, adapter, budget | P0 | Frontend | 2 | E2-T3 | Form for hiring, validates budget, creates agent in Paperclip API |
| E2-T5 | Build heartbeat scheduler (4h, 8h, 12h, continuous) | P0 | Backend | 3 | E2-T1 | Scheduler wakes agents on schedule, event triggers bypass schedule, logs all wakes |
| E2-T6 | Create ticket system: create, assign, track, close | P0 | Frontend | 3 | E2-T4 | Tickets have title, description, assignee, status, priority, threaded comments |
| E2-T7 | Implement per-agent budget tracking with soft/hard limits | P0 | Backend | 2 | E2-T1 | Budgets stored per agent, soft warning at 80%, hard stop at 100%, auto-pause |
| E2-T8 | Build budget dashboard with progress bars and alerts | P0 | Frontend | 2 | E2-T7 | Dashboard shows all agents' budgets, color-coded, alerts for overruns |
| E2-T9 | Create board approval workflow for major decisions | P1 | Frontend | 2 | E2-T6 | Board sees pending decisions, can approve/reject/comment, audit trail stored |
| E2-T10 | Implement goal ancestry: every task traces to mission | P1 | Backend | 2 | E2-T5 | Tasks store parent goal chain, agents see "why" in context, visualized in UI |
| E2-T11 | Build Paperclip embed for Agor canvas | P0 | Frontend | 2 | E1-T12, E2-T3 | Paperclip dashboard renders as embeddable card in Agor, real-time sync |
| E2-T12 | Add multi-company support with data isolation | P2 | Backend | 2 | E2-T1 | Companies isolated at database level, user can switch between companies |

---

## EPIC 3: Business Process & Gates (BMAD + Babysitter + Plannotator)
**Goal:** Implement business methodology with human approval gates
**Priority:** P0  
**Estimated Duration:** 1.5 weeks  
**Dependencies:** E1 (Agor Canvas)  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E3-T1 | Install and configure BMAD CLI | P0 | DevOps | 1 | None | `npx bmad-method` works, all commands available |
| E3-T2 | Build Business Model Canvas template in Agor | P0 | Frontend | 2 | E1-T8 | Pre-built BMC template with 9 sections, draggable, auto-saves |
| E3-T3 | Create revenue model calculator widget | P0 | Frontend | 2 | E3-T2 | Calculator supports subscription, usage, one-time, validates unit economics |
| E3-T4 | Implement BMAD analysis commands: forge-idea, market-research | P1 | Backend | 2 | E3-T1 | Commands run, produce structured output, stored in Gbrain |
| E3-T5 | Build BMAD planning commands: prd, product-brief, prfaq | P1 | Backend | 2 | E3-T1 | Commands produce markdown documents, versioned, linked to canvas |
| E3-T6 | Install Babysitter plugin and configure workflow gates | P0 | DevOps | 1 | None | Babysitter enforces gates at configured milestones, blocks progression |
| E3-T7 | Create gate configuration: which milestones require approval | P0 | Backend | 1 | E3-T6 | Config file defines gates, Babysitter reads and enforces |
| E3-T8 | Build milestone gate cards in Agor | P0 | Frontend | 2 | E3-T7 | Gate cards appear at milestones, show status, require approval action |
| E3-T9 | Install and configure Plannotator | P0 | DevOps | 1 | None | Plannotator runs at localhost:3003, intercepts plans |
| E3-T10 | Build plan annotation UI with section-based access | P0 | Frontend | 3 | E3-T9 | Plans render with sections, DE sees business only, TF sees all, annotations threaded |
| E3-T11 | Implement structured feedback export to agents | P0 | Backend | 2 | E3-T10 | Annotations exported as structured JSON, consumed by PAUL/CARL |
| E3-T12 | Add plan diff visualization between versions | P1 | Frontend | 2 | E3-T10 | Side-by-side diff, highlights changes, shows who changed what |
| E3-T13 | Build competitive analysis template | P1 | Frontend | 1 | E3-T2 | Template with competitor cards, feature matrix, positioning map |

---

## EPIC 4: Technical Spec (PAUL + SEED + CARL)
**Goal:** Implement technical planning and dynamic rule injection
**Priority:** P0  
**Estimated Duration:** 1 week  
**Dependencies:** E3 (Business Process)  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E4-T1 | Install and configure PAUL framework | P0 | DevOps | 1 | None | `npx paul-framework` works, init/plan/apply/unify commands available |
| E4-T2 | Install and configure SEED incubator | P1 | DevOps | 1 | None | `npx seed-incubator` works, typed project creation |
| E4-T3 | Install and configure CARL core | P0 | DevOps | 1 | None | `npx carl-core` works, rule loading functional |
| E4-T4 | Build PAUL integration: consume BMAD PRD, produce TECH-SPEC | P0 | Backend | 2 | E4-T1, E3-T5 | PAUL reads PRD markdown, generates TECH-SPEC with acceptance criteria |
| E4-T5 | Implement CARL dynamic rule loading by intent | P0 | Backend | 2 | E4-T3 | CARL detects intent ("design system" → architecture rules), loads JIT |
| E4-T6 | Create CARL rule sets: BUSINESS, ARCHITECTURE, PAUL | P0 | Backend | 1 | E4-T5 | Three rule sets defined, CARL switches between them correctly |
| E4-T7 | Build TECH-SPEC viewer in Agor Engineering Zone | P0 | Frontend | 2 | E4-T4 | TECH-SPEC renders as structured document, sections collapsible, linked to cards |
| E4-T8 | Add PAUL headless execution for CI/CD | P1 | Backend | 1 | E4-T4 | PAUL runs without TUI, produces JSON output, exit codes |
| E4-T9 | Implement CARL rule versioning and rollback | P1 | Backend | 1 | E4-T5 | Rules versioned in git, CARL can load previous versions |

---

## EPIC 5: HCOM Agent Communication + Terminal Multiplexer
**Goal:** Connect 15+ CLI agents with seamless messaging and persistent sessions
**Priority:** P0  
**Estimated Duration:** 2 weeks  
**Dependencies:** E1 (Agor Canvas), E2 (Paperclip)  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E5-T1 | Install HCOM (Rust binary + SQLite) | P0 | DevOps | 1 | None | `hcom` command works, SQLite database created |
| E5-T2 | Configure HCOM hooks for all 15+ CLI agents | P0 | DevOps | 2 | E5-T1 | `hcom claude`, `hcom kimi`, `hcom hermes`, etc. all work, hooks installed |
| E5-T3 | Implement HCOM message bus: SQLite pub/sub | P0 | Backend | 3 | E5-T1 | Messages insert to SQLite, delivered to recipients, <50ms latency |
| E5-T4 | Build HCOM TUI dashboard with React | P0 | Frontend | 3 | E5-T3 | Dashboard shows all agents, messages, statuses, terminal previews |
| E5-T5 | Implement agent observation: transcripts, file edits, terminal screens | P0 | Backend | 2 | E5-T3 | Hooks capture agent activity, observable via API, TUI shows live |
| E5-T6 | Add collision detection for simultaneous file edits | P0 | Backend | 2 | E5-T5 | Two agents editing same file within 30s triggers alert, both notified |
| E5-T7 | Implement agent lifecycle: spawn, fork, resume, kill | P0 | Backend | 2 | E5-T3 | All lifecycle commands work via HCOM API, TUI shows changes |
| E5-T8 | Build HCOM embed for Agor canvas | P0 | Frontend | 2 | E1-T12, E5-T4 | HCOM dashboard renders as embeddable card, real-time agent status |
| E5-T9 | Configure tmux for persistent remote sessions | P0 | DevOps | 1 | None | tmux sessions survive SSH disconnect, reattachable from anywhere |
| E5-T10 | Install and configure amux (optional upgrade) | P1 | DevOps | 1 | E5-T9 | amux runs, web dashboard accessible, mobile PWA works |
| E5-T11 | Implement amux self-healing watchdog | P1 | Backend | 2 | E5-T10 | Watchdog detects crashed agents, auto-restarts with preserved context |
| E5-T12 | Add amux REST API for remote session management | P2 | Backend | 2 | E5-T10 | API endpoints for list, create, attach, kill sessions |
| E5-T13 | Build cross-device MQTT relay for distributed workflows | P2 | Backend | 2 | E5-T3 | Agents on different machines communicate via MQTT relay |

---

## EPIC 6: Implementation Orchestra (Gstack + GSD Pi + Design Skills)
**Goal:** Integrate build skills and design agents for parallel implementation
**Priority:** P0  
**Estimated Duration:** 1.5 weeks  
**Dependencies:** E4 (Technical Spec), E5 (HCOM)  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E6-T1 | Install and configure Gstack skills | P0 | DevOps | 1 | None | `~/.claude/skills/gstack` exists, all slash commands available |
| E6-T2 | Integrate Gstack with HCOM: build status reports to message bus | P0 | Backend | 2 | E5-T3, E6-T1 | Gstack `/autoplan` progress reported via HCOM, visible in TUI |
| E6-T3 | Configure Gstack design skills: /design-shotgun, /design-html | P0 | DevOps | 1 | E6-T1 | Design commands generate mockups and HTML, output linked to canvas |
| E6-T4 | Install and configure GSD Pi | P0 | DevOps | 1 | None | `gsd --web` spawns multi-tab UI, auto mode works |
| E6-T5 | Integrate GSD Pi with HCOM as parallel worker | P0 | Backend | 2 | E5-T3, E6-T4 | GSD Pi sessions communicate via HCOM, status visible in TUI |
| E6-T6 | Configure design agent MCP servers: Google Stitch, Huashu, Open Design | P1 | DevOps | 2 | None | MCP servers registered, agents can call design tools |
| E6-T7 | Build implementation status dashboard in Agor | P0 | Frontend | 2 | E6-T2 | Dashboard shows Gstack progress, GSD Pi status, design output, live previews |
| E6-T8 | Implement git worktree isolation per agent session | P0 | Backend | 1 | E5-T9 | Each agent gets unique worktree, no merge conflicts, PR creation |
| E6-T9 | Add Gstack browser automation: /browser, /pair-agent | P1 | Backend | 2 | E6-T1 | Browser automation works, screenshots captured, pair-agent coordinates |
| E6-T10 | Build design output gallery in Agor Business Zone | P1 | Frontend | 2 | E6-T3 | Design mockups displayed as gallery, domain expert can select favorites |

---

## EPIC 7: Quality Gates (AEGIS + Matt Pocock Skills)
**Goal:** Implement milestone validation with multi-domain audit and plan stress-testing
**Priority:** P0  
**Estimated Duration:** 1.5 weeks  
**Dependencies:** E6 (Implementation Orchestra)  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E7-T1 | Install and configure AEGIS | P0 | DevOps | 1 | None | AEGIS commands work, 14 domains defined |
| E7-T2 | Implement AEGIS 14-domain audit engine | P0 | Backend | 3 | E7-T1 | All 14 domains evaluated, findings structured, severity ranked |
| E7-T3 | Build 12 persona evaluation system including Devil's Advocate | P0 | Backend | 2 | E7-T2 | Personas evaluate findings, Devil's Advocate challenges assumptions |
| E7-T4 | Implement epistemic confidence scoring | P0 | Backend | 2 | E7-T2 | Each finding has confidence score (0-1), evidence cited |
| E7-T5 | Build AEGIS Transform: findings → PAUL remediation plans | P0 | Backend | 2 | E7-T2 | Transform produces PAUL-compatible PROJECT.md, risk-scored, ordered |
| E7-T6 | Create AEGIS embed for Agor: risk heatmap + findings | P0 | Frontend | 3 | E7-T2 | Heatmap renders 14 domains with color coding, findings expandable |
| E7-T7 | Build executive summary generator for domain expert | P0 | Backend | 2 | E7-T2 | Summary extracts business-relevant findings, hides technical detail |
| E7-T8 | Install Matt Pocock skills: grill-me, grill-with-docs | P1 | DevOps | 1 | None | Skills installed, commands available |
| E7-T9 | Integrate grill-me with Plannotator: stress-test before implementation | P1 | Backend | 2 | E7-T8, E3-T10 | grill-me runs on plans, produces decision tree walk, results in Plannotator |
| E7-T10 | Integrate grill-with-docs with Gbrain: domain modeling | P1 | Backend | 2 | E7-T8 | grill-with-docs builds CONTEXT.md, stored in Gbrain, linked to pages |
| E7-T11 | Implement unit economics validation gate | P1 | Backend | 2 | E7-T2 | CAC, LTV, payback period validated, flags if CAC > LTV |
| E7-T12 | Build milestone gate notification system | P0 | Frontend | 2 | E7-T6 | Notifications sent to DE and TF when gate reached, cards appear on canvas |

---

## EPIC 8: CRM & Outreach (DenchClaw)
**Goal:** Integrate local-first CRM for customer and sales management
**Priority:** P1  
**Estimated Duration:** 1 week  
**Dependencies:** E2 (Paperclip)  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E8-T1 | Install and configure DenchClaw | P1 | DevOps | 1 | None | `npx denchclaw bootstrap` works, Web UI at localhost:3100 |
| E8-T2 | Build DenchClaw embed for Agor canvas | P1 | Frontend | 2 | E1-T12, E8-T1 | CRM dashboard renders as embeddable card, pipeline visible |
| E8-T3 | Integrate DenchClaw with Paperclip Sales Agent | P1 | Backend | 2 | E8-T1, E2-T1 | Sales agent can read/write DenchClaw contacts, deals, outreach |
| E8-T4 | Configure outreach skills: LinkedIn, email, cold campaigns | P2 | DevOps | 1 | E8-T1 | Skills installed, automation sequences configurable |
| E8-T5 | Add GitHub sync for team collaboration | P2 | Backend | 2 | E8-T1 | DenchClaw data syncs to GitHub repo, conflict resolution |

---

## EPIC 9: Company Brain (Gbrain + LLM-wiki-v2 Patterns)
**Goal:** Build automatic knowledge capture and visualized query interface
**Priority:** P0  
**Estimated Duration:** 2 weeks  
**Dependencies:** E1 (Agor Canvas), E2 (Paperclip), E7 (Quality Gates)  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E9-T1 | Install and configure Gbrain with PGLite | P0 | DevOps | 1 | None | `gbrain init --pglite` works, database ready in 2 seconds |
| E9-T2 | Configure Gbrain MCP server with 74 tools | P0 | Backend | 2 | E9-T1 | `claude mcp add gbrain` works, all tools accessible |
| E9-T3 | Build auto-capture pipeline from Paperclip | P0 | Backend | 2 | E9-T1, E2-T1 | Every ticket closed → KnowledgePage created, categorized |
| E9-T4 | Build auto-capture pipeline from HCOM | P0 | Backend | 2 | E9-T1, E5-T3 | Every message sent → transcript appended to agent memory page |
| E9-T5 | Build auto-capture pipeline from AEGIS | P0 | Backend | 2 | E9-T1, E7-T2 | Every audit complete → findings stored with confidence scores |
| E9-T6 | Build auto-capture pipeline from Plannotator | P0 | Backend | 2 | E9-T1, E3-T10 | Every annotation → stored as decision page with evidence |
| E9-T7 | Build auto-capture pipeline from BMAD | P0 | Backend | 2 | E9-T1, E3-T1 | Every PRD, plan, assumption → stored with source attribution |
| E9-T8 | Implement hybrid search: vector + BM25 | P0 | Backend | 3 | E9-T1 | Natural language queries return semantic + keyword results, ranked |
| E9-T9 | Build self-wiring knowledge graph | P0 | Backend | 3 | E9-T8 | Pages auto-link based on shared terms, entities, references |
| E9-T10 | Create Gbrain query interface with natural language | P0 | Frontend | 3 | E9-T8 | Search bar accepts natural language, returns ranked results with snippets |
| E9-T11 | Build visual knowledge graph renderer | P0 | Frontend | 3 | E9-T9 | Graph shows nodes (pages) and edges (connections), zoomable, clickable |
| E9-T12 | Implement LLM-wiki-v2 patterns: YAML frontmatter, confidence, recency | P1 | Backend | 2 | E9-T1 | Every page has frontmatter, confidence score, recency marker, supersession links |
| E9-T13 | Build contradiction detection engine | P1 | Backend | 2 | E9-T12 | System flags pages with contradictory claims, suggests resolution |
| E9-T14 | Create Gbrain dashboard embed for Agor | P0 | Frontend | 2 | E9-T11, E1-T12 | Dashboard renders as embeddable card, shows graph, recent captures, query bar |
| E9-T15 | Implement per-user scoping: DE sees business, TF sees all | P0 | Backend | 2 | E9-T1 | Query results filtered by user role, business pages visible to DE, all to TF |
| E9-T16 | Add company-brain mode for multi-user access | P1 | Backend | 2 | E9-T15 | Multiple users query same brain, scoped to their permissions |

---

## EPIC 10: Deployment & DevOps
**Goal:** Create production-ready deployment with Docker, reverse proxy, and monitoring
**Priority:** P0  
**Estimated Duration:** 1 week  
**Dependencies:** All above epics  

### Tasks

| ID | Task | Priority | Owner | Est. Days | Dependencies | Acceptance Criteria |
|----|------|----------|-------|-----------|--------------|---------------------|
| E10-T1 | Create Docker Compose for all services | P0 | DevOps | 2 | None | `docker compose up` starts all services, networks connected, volumes persisted |
| E10-T2 | Configure nginx/Caddy reverse proxy with TLS | P0 | DevOps | 1 | E10-T1 | HTTPS on 443, routes to correct services, auto-renewal |
| E10-T3 | Set up PostgreSQL with backups | P0 | DevOps | 1 | E10-T1 | Database persistent, daily dumps, WAL archiving |
| E10-T4 | Configure Tailscale for remote access (optional) | P1 | DevOps | 1 | E10-T1 | Tailscale network created, all services accessible via magic DNS |
| E10-T5 | Create environment configuration system | P0 | DevOps | 1 | E10-T1 | `.env` files for dev/staging/prod, secrets management |
| E10-T6 | Build health check endpoints for all services | P0 | Backend | 1 | E10-T1 | `/health` on all services returns 200 + status |
| E10-T7 | Set up log aggregation and monitoring | P1 | DevOps | 1 | E10-T1 | Logs centralized, basic metrics (CPU, RAM, disk) visible |
| E10-T8 | Create disaster recovery runbook | P1 | DevOps | 1 | E10-T3 | Documented procedures for machine failure, DB corruption, key rotation |
| E10-T9 | Build CI/CD pipeline (GitHub Actions) | P2 | DevOps | 2 | E10-T1 | Lint, test, build, deploy on push to main |
| E10-T10 | Create onboarding documentation for new users | P1 | Frontend | 2 | All | Step-by-step guide for DE and TF to get started |

---

## Sprint Planning Recommendations

### Sprint 1 (Week 1): Foundation
**Goal:** Get the canvas and basic orchestration running
- E1-T1 through E1-T8 (Agor canvas core)
- E2-T1 through E2-T4 (Paperclip setup + org chart)
- E5-T1 through E5-T4 (HCOM setup + TUI)
- E10-T1 (Docker Compose)

### Sprint 2 (Week 2): Business Layer
**Goal:** Enable domain expert to work on business model
- E1-T12, E1-T13 (Embeds + auto-save)
- E3-T1 through E3-T8 (BMAD + Babysitter + gates)
- E2-T5 through E2-T8 (Paperclip heartbeats + budgets)
- E5-T5 through E5-T8 (HCOM observation + embed)

### Sprint 3 (Week 3): Technical Layer
**Goal:** Connect technical planning and agent communication
- E4-T1 through E4-T7 (PAUL + CARL + TECH-SPEC)
- E3-T9 through E3-T12 (Plannotator + diff)
- E5-T9 through E5-T11 (tmux + amux)
- E6-T1 through E6-T5 (Gstack + GSD Pi)

### Sprint 4 (Week 4): Quality & Brain
**Goal:** Add quality gates and knowledge capture
- E7-T1 through E7-T7 (AEGIS audit + heatmap)
- E9-T1 through E9-T7 (Gbrain setup + auto-capture)
- E7-T8 through E7-T10 (Matt Pocock skills)
- E9-T8 through E9-T11 (Search + graph)

### Sprint 5 (Week 5): Polish & Integration
**Goal:** Wire everything together, test with real venture
- E9-T12 through E9-T16 (LLM-wiki-v2 + dashboards)
- E7-T11, E7-T12 (Unit economics + notifications)
- E8-T1 through E8-T3 (DenchClaw)
- E6-T6 through E6-T10 (Design skills + gallery)
- E10-T2 through E10-T10 (Deployment + docs)

---

## Definition of Done

Every task must satisfy:
- [ ] Code written and committed to git
- [ ] Unit tests written and passing (coverage > 80%)
- [ ] Integration tests passing (if applicable)
- [ ] Manual QA performed on the feature
- [ ] Documentation updated (README, inline comments)
- [ ] Code review completed (if team > 1)
- [ ] No console errors or warnings
- [ ] Accessibility checked (keyboard navigation, screen reader)
- [ ] Performance budget met (if frontend)
- [ ] Security review passed (no secrets in code, input validated)

---

*End of Product Backlog*
