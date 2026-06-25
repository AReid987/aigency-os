# PRODUCT REQUIREMENTS DOCUMENT (PRD)

**Project:** Venture Spec Collaboration Platform  
**Version:** 1.0  
**Date:** 2026-06-24  
**Template:** BMAD Method — PRD  
**Status:** Draft — Ready for Implementation  

---

## 1. Overview

### 1.1 Product Summary
The Venture Spec Collaboration Platform is a self-hosted, visual-first workspace that enables a technical founder and a domain expert to collaboratively design, validate, and build new ventures using an orchestra of AI agents. The platform combines eight specialized layers into a unified system with deterministic human approval gates.

### 1.2 Problem Statement
Technical founders running 15+ CLI agents face three critical problems:
1. **Coordination Chaos:** Agents run in isolated terminals with no shared context or communication.
2. **Domain Expert Exclusion:** Non-technical stakeholders cannot contribute meaningfully to technical projects.
3. **Knowledge Loss:** Every agent session, decision, and audit result is lost unless manually documented.

### 1.3 Solution Statement
A unified platform that:
- Provides a shared infinite canvas (Agor) with role-based zones
- Orchestrates ventures via an AI CEO agent (Paperclip) with org charts and budgets
- Enforces business methodology (BMAD) with human approval gates (Babysitter)
- Connects 15+ CLI agents via a communication layer (HCOM)
- Implements features via specialized skills (Gstack)
- Audits quality via 14-domain checks (AEGIS)
- Manages customers via local CRM (DenchClaw)
- Captures all knowledge automatically (Gbrain)

### 1.4 Target Users
- **Primary:** Technical Founder (expert CLI user, admin access)
- **Primary:** Domain Expert (non-technical, business zone full access)
- **Secondary:** 15+ AI CLI agents (Hermes, Claude, Kimi, Qwen, Gemini, Codex, OpenCode, Kilo, Pi, Antigravity, Cursor, Copilot, Blackbox, Droid, Mimo, Mistral)

### 1.5 Success Criteria
- Domain expert can create business model canvas without code
- Technical founder can spawn 5+ agents in parallel, all communicating
- 100% knowledge capture into searchable brain
- >90% milestone pass rate on first quality gate
- MVP shipped in <14 days from idea

---

## 2. User Stories & Requirements

### 2.1 Domain Expert Stories

**US-DE-001: Business Model Canvas Creation**
> As a domain expert, I want to create a business model canvas on a shared infinite canvas so that I can define the venture's value proposition, revenue streams, and customer segments.

**Acceptance Criteria:**
- [ ] Infinite canvas with drag-and-drop cards
- [ ] Pre-built Business Model Canvas template
- [ ] Real-time multiplayer cursors
- [ ] Ability to add text, images, and links to cards
- [ ] Cards can be grouped into zones (Value Prop, Revenue, Customers, etc.)
- [ ] Changes sync in real-time to the technical founder's view
- [ ] Auto-save to Gbrain knowledge base

**US-DE-002: Revenue Model Definition**
> As a domain expert, I want to define pricing tiers and revenue projections so that the technical founder can build the billing system correctly.

**Acceptance Criteria:**
- [ ] Revenue model calculator widget on canvas
- [ ] Support for subscription, usage-based, and one-time pricing
- [ ] Unit economics validation (CAC, LTV, payback period)
- [ ] Export to structured markdown for agent consumption
- [ ] Integration with AEGIS unit economics quality gate

**US-DE-003: Plan Review & Annotation**
> As a domain expert, I want to review technical plans and annotate only the business-relevant sections so that I can approve scope without being overwhelmed by technical details.

**Acceptance Criteria:**
- [ ] Plans open in visual annotation UI (Plannotator)
- [ ] Business-logic sections are highlighted and editable
- [ ] Technical sections (architecture, API, database) are collapsed/hidden
- [ ] Annotations are threaded and versioned
- [ ] Structured feedback sent back to agents automatically
- [ ] Approval gate requires explicit sign-off before proceeding

**US-DE-004: Milestone Approval**
> As a domain expert, I want to receive milestone summaries with risk flags so that I can approve or reject progression to the next phase.

**Acceptance Criteria:**
- [ ] Milestone summaries rendered as visual cards on canvas
- [ ] Risk flags (red/yellow/green) for each domain
- [ ] One-click approve/reject/request-changes
- [ ] Babysitter enforces: no progression without approval
- [ ] Audit trail of all approvals stored in Gbrain

**US-DE-005: Live Preview Access**
> As a domain expert, I want to view live previews of the running MVP without needing to run code locally.

**Acceptance Criteria:**
- [ ] Shared preview URLs for each worktree/branch
- [ ] Preview rendered as embeddable iframe on canvas
- [ ] No local setup required
- [ ] Read-only access to running application

---

### 2.2 Technical Founder Stories

**US-TF-001: Agent Orchestra Spawn**
> As a technical founder, I want to spawn multiple CLI agents in parallel with a single command so that I can delegate tasks efficiently.

**Acceptance Criteria:**
- [ ] Single command spawns N agents in isolated terminal sessions
- [ ] Each agent gets a unique identity in HCOM
- [ ] Agents can message, observe, and spawn each other
- [ ] Collision detection prevents simultaneous file edits
- [ ] TUI dashboard shows all active agents and their status
- [ ] Remote access via SSH + tmux/amux

**US-TF-002: Venture Orchestration Dashboard**
> As a technical founder, I want to view and manage the AI company org chart, budgets, and agent assignments from a web dashboard.

**Acceptance Criteria:**
- [ ] Paperclip dashboard accessible via web UI
- [ ] Org chart with roles, reporting lines, and status
- [ ] Per-agent budget tracking and cost alerts
- [ ] Heartbeat schedule configuration (4h, 8h, 12h)
- [ ] Ticket system with full trace of tool calls and decisions
- [ ] Ability to pause, resume, or terminate any agent
- [ ] Board approval workflow for major decisions

**US-TF-003: Technical Spec Translation**
> As a technical founder, I want to convert approved business requirements into agent-readable technical specs with acceptance criteria.

**Acceptance Criteria:**
- [ ] BMAD PRD fed into PAUL automatically
- [ ] PAUL generates structured technical plan with acceptance criteria
- [ ] CARL loads relevant domain rules dynamically
- [ ] Plan diff visible between versions
- [ ] Integration with Plannotator for human annotation
- [ ] Output: TECH-SPEC.md with architecture, data model, API surface

**US-TF-004: Quality Gate Execution**
> As a technical founder, I want to run a 14-domain audit on the codebase at major milestones so that I can catch issues before they become expensive.

**Acceptance Criteria:**
- [ ] AEGIS audit triggered automatically at milestone boundaries
- [ ] 14 domains: Architecture, Security, Performance, Testing, Scalability, etc.
- [ ] Devil's Advocate persona challenges assumptions
- [ ] Severity-ranked findings with epistemic confidence scores
- [ ] Transform layer converts findings into PAUL-compatible remediation plans
- [ ] Executive summary for domain expert; full detail for technical founder

**US-TF-005: Knowledge Brain Query**
> As a technical founder, I want to query the company brain for past decisions, plans, and audit results so that I can make informed choices.

**Acceptance Criteria:**
- [ ] Gbrain query interface with natural language search
- [ ] Hybrid search: vector similarity + BM25 keyword
- [ ] Self-wiring graph showing connections between decisions
- [ ] Visual dashboard rendered as Agor artifact
- [ ] Per-user scoping: domain expert sees business context; technical founder sees all
- [ ] Auto-capture from all layers (Paperclip, HCOM, AEGIS, Plannotator)

---

### 2.3 Agent Stories

**US-AG-001: Cross-Agent Communication**
> As an AI agent, I want to message other agents and receive their responses so that I can coordinate work without human intervention.

**Acceptance Criteria:**
- [ ] HCOM message bus with @mentions and broadcast
- [ ] Intent-based messaging with bundled context
- [ ] Real-time delivery between terminal sessions
- [ ] Ability to subscribe to events (file edits, status changes)
- [ ] Collision detection notifications

**US-AG-002: Context Injection**
> As an AI agent, I want to receive my full context (identity, plan, assignments) every time I wake up so that I can operate as a stateful worker.

**Acceptance Criteria:**
- [ ] Heartbeat checklist: read identity, check plan, fetch assignments, execute, store memory, report
- [ ] Goal ancestry: every task carries full chain back to company mission
- [ ] Memory persistence across sessions via Gbrain
- [ ] Budget awareness: agent knows its spending limit

**US-AG-003: Skill Discovery**
> As an AI agent, I want to discover and install skills dynamically so that I can extend my capabilities.

**Acceptance Criteria:**
- [ ] Skills marketplace (skills.sh / ClawHub)
- [ ] One-command skill installation
- [ ] Skill validation before execution
- [ ] Sandboxed skill execution (future)

---

## 3. Functional Requirements

### 3.1 Agor Canvas (Layer 1)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-AG-001 | Self-hosted multiplayer canvas with WebSocket sync | P0 | Backend |
| FR-AG-002 | Role-based zones: Business Zone (full), Engineering Zone (read-only for DE) | P0 | Backend |
| FR-AG-003 | Drag-and-drop cards with text, images, links, and embeds | P0 | Frontend |
| FR-AG-004 | Real-time cursors and presence indicators | P0 | Frontend |
| FR-AG-005 | Worktree-based card system for agent session tracking | P1 | Backend |
| FR-AG-006 | MCP server exposing canvas to agents (spawn, move, create) | P1 | Backend |
| FR-AG-007 | Artifact rendering: live dashboards, calculators, previews | P1 | Frontend |
| FR-AG-008 | Knowledge base integration: auto-save cards to Gbrain | P1 | Backend |

### 3.2 Paperclip Venture Orchestration (Layer 2)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-PC-001 | Company creation with goal, mission, and org chart | P0 | Backend |
| FR-PC-002 | CEO agent that drafts hiring plans and strategy | P0 | Backend |
| FR-PC-003 | Agent hiring with role, title, reporting line, budget | P0 | Backend |
| FR-PC-004 | Heartbeat loop: scheduled wake + event-based triggers | P0 | Backend |
| FR-PC-005 | Goal ancestry: every task traces back to mission | P0 | Backend |
| FR-PC-006 | Per-agent budget tracking with soft (80%) and hard (100%) limits | P0 | Backend |
| FR-PC-007 | Ticket system with structured threads, tool-call tracing, audit log | P0 | Backend |
| FR-PC-008 | Board approval workflow for hires, strategy, and major decisions | P1 | Backend |
| FR-PC-009 | Maximizer Mode (outcome-based, continuous execution) | P2 | Backend |
| FR-PC-010 | Multi-company support with data isolation | P2 | Backend |

### 3.3 Business Process (Layer 3A)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-BM-001 | BMAD Analysis phase: idea forging, market research, domain research | P0 | Backend |
| FR-BM-002 | BMAD Planning phase: PRD, product brief, PRFAQ generation | P0 | Backend |
| FR-BM-003 | Babysitter workflow enforcement with human breakpoints | P0 | Backend |
| FR-BM-004 | Business Model Canvas template with revenue calculator | P0 | Frontend |
| FR-BM-005 | Unit economics validation (CAC, LTV, payback) | P1 | Backend |
| FR-BM-006 | Competitive landscape analysis template | P1 | Frontend |

### 3.4 Plannotator Gate (Layer 3B)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-PL-001 | Plan interception and visual annotation UI | P0 | Frontend |
| FR-PL-002 | Section-based access: business sections visible to DE, technical hidden | P0 | Frontend |
| FR-PL-003 | Threaded annotations with version history | P0 | Frontend |
| FR-PL-004 | Structured feedback export to agent systems | P0 | Backend |
| FR-PL-005 | Small plans: URL-encoded sharing (no server) | P1 | Frontend |
| FR-PL-006 | Large plans: encrypted short-links with auto-delete | P1 | Backend |
| FR-PL-007 | Plan diff visualization between versions | P1 | Frontend |

### 3.5 Technical Spec (Layer 3B)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-TS-001 | SEED typed project incubation (Application, Workflow, Client, Campaign) | P1 | Backend |
| FR-TS-002 | PAUL Plan-Apply-Unify loop with acceptance criteria | P0 | Backend |
| FR-TS-003 | PAUL headless execution for CI/CD integration | P1 | Backend |
| FR-TS-004 | CARL dynamic rule injection by intent/domain | P0 | Backend |
| FR-TS-005 | CARL rule versioning and rollback | P1 | Backend |
| FR-TS-006 | TECH-SPEC.md generation with architecture, data model, API | P0 | Backend |

### 3.6 HCOM Agent Communication (Layer 4)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-HC-001 | Single Rust binary, no background services | P0 | Backend |
| FR-HC-002 | SQLite message bus with real-time delivery | P0 | Backend |
| FR-HC-003 | Support for 15+ CLI agents: Hermes, Claude, Kimi, Qwen, Gemini, Codex, OpenCode, Kilo, Pi, Antigravity, Cursor, Copilot, Blackbox, Droid, Mimo, Mistral | P0 | Backend |
| FR-HC-004 | Cross-agent messaging with @mentions and broadcast | P0 | Backend |
| FR-HC-005 | Agent observation: transcripts, file edits, terminal screens | P0 | Backend |
| FR-HC-006 | Event subscriptions with automatic reactions | P0 | Backend |
| FR-HC-007 | Collision detection for simultaneous file edits | P0 | Backend |
| FR-HC-008 | Agent lifecycle: spawn, fork, resume, kill | P0 | Backend |
| FR-HC-009 | TUI dashboard for monitoring all agents | P0 | Frontend |
| FR-HC-010 | Cross-device MQTT relay for distributed workflows | P2 | Backend |

### 3.7 Terminal Multiplexer (Layer 4)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-TM-001 | Persistent remote sessions via SSH | P0 | Backend |
| FR-TM-002 | Session persistence across disconnections | P0 | Backend |
| FR-TM-003 | Web dashboard for session monitoring (amux) | P1 | Frontend |
| FR-TM-004 | Mobile PWA + iOS access (amux) | P2 | Frontend |
| FR-TM-005 | Self-healing watchdog: auto-restart crashed agents | P1 | Backend |
| FR-TM-006 | Git worktree isolation per agent session | P0 | Backend |
| FR-TM-007 | Kanban board for task tracking (amux) | P1 | Frontend |
| FR-TM-008 | REST API for session management (amux) | P2 | Backend |

### 3.8 Implementation Orchestra (Layer 5)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-IO-001 | Gstack skill integration: /office-hours, /autoplan, /ship, /qa, /cso | P0 | Backend |
| FR-IO-002 | Gstack design skills: /design-shotgun, /design-html, /design-consultation | P0 | Backend |
| FR-IO-003 | Gstack browser automation: /browser, /pair-agent | P1 | Backend |
| FR-IO-004 | GSD Pi standalone CLI with `gsd --web` multi-tab UI | P1 | Backend |
| FR-IO-005 | GSD Pi auto mode for unattended execution | P1 | Backend |
| FR-IO-006 | Design agent skills: Google Stitch, Huashu, Open Design, Open Generative AI | P1 | Backend |
| FR-IO-007 | Isolated git worktrees per parallel agent | P0 | Backend |
| FR-IO-008 | Supervisor agent (Hermes) delegates to worker agents via HCOM | P0 | Backend |

### 3.9 Quality Gates (Layer 6)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-QG-001 | AEGIS 14-domain audit at milestone boundaries | P0 | Backend |
| FR-QG-002 | 12 persona evaluation including Devil's Advocate | P0 | Backend |
| FR-QG-003 | Epistemic schema with confidence scoring | P0 | Backend |
| FR-QG-004 | AEGIS Transform: findings → PAUL-compatible remediation | P0 | Backend |
| FR-QG-005 | Risk-scored, dependency-ordered task lists | P0 | Backend |
| FR-QG-006 | grill-me stress-testing on plans before implementation | P1 | Backend |
| FR-QG-007 | grill-with-docs domain modeling and CONTEXT.md building | P1 | Backend |
| FR-QG-008 | Unit economics validation gate | P1 | Backend |
| FR-QG-009 | Executive summary for domain expert; full detail for technical founder | P0 | Frontend |

### 3.10 CRM & Outreach (Layer 7)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-CR-001 | DenchClaw local-first CRM on DuckDB | P1 | Backend |
| FR-CR-002 | Web UI at localhost:3100 for contact/deal management | P1 | Frontend |
| FR-CR-003 | Outreach automation: LinkedIn, email, cold campaigns | P2 | Backend |
| FR-CR-004 | Lead enrichment and scoring | P2 | Backend |
| FR-CR-005 | Skills store integration (58,237+ skills) | P2 | Backend |
| FR-CR-006 | GitHub/iCloud sync for team collaboration | P2 | Backend |

### 3.11 Company Brain (Layer 8)
| ID | Requirement | Priority | Owner |
|----|-------------|----------|-------|
| FR-CB-001 | Gbrain initialization with PGLite (2-second setup) | P0 | Backend |
| FR-CB-002 | Auto-capture from Paperclip, HCOM, AEGIS, Plannotator, BMAD | P0 | Backend |
| FR-CB-003 | Hybrid search: vector + BM25 | P0 | Backend |
| FR-CB-004 | Self-wiring knowledge graph | P0 | Backend |
| FR-CB-005 | 74 MCP tools for agent integration | P0 | Backend |
| FR-CB-006 | Company-brain mode with per-user scoping | P0 | Backend |
| FR-CB-007 | Visual dashboard rendered as Agor artifact | P1 | Frontend |
| FR-CB-008 | LLM-wiki-v2 patterns: YAML frontmatter, confidence, recency, contradiction, supersession | P1 | Backend |
| FR-CB-009 | Query interface: natural language + graph queries | P1 | Frontend |

---

## 4. Non-Functional Requirements

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-001 | Self-hosted: all core services run locally | 100% local | P0 |
| NFR-002 | Remote access: SSH + web dashboard | Any device | P0 |
| NFR-003 | Concurrent agents: support 15+ parallel sessions | 15+ agents | P0 |
| NFR-004 | Latency: canvas sync <100ms | <100ms | P0 |
| NFR-005 | Availability: 99.9% uptime for local services | 99.9% | P1 |
| NFR-006 | Security: encrypted plan sharing (AES-256-GCM) | Military-grade | P1 |
| NFR-007 | Cost tracking: per-agent token spend with alerts | Real-time | P0 |
| NFR-008 | Knowledge retention: 100% capture, zero loss | 100% | P0 |
| NFR-009 | Accessibility: domain expert needs zero coding knowledge | Zero code | P0 |
| NFR-010 | Portability: single-machine deployment, Docker optional | Single machine | P0 |

---

## 5. Data Model

### 5.1 Core Entities

```
Company
├── id: UUID
├── name: String
├── mission: String
├── goals: Goal[]
├── agents: Agent[]
├── projects: Project[]
├── budgets: Budget
└── audit_log: AuditEntry[]

Agent
├── id: UUID
├── name: String
├── role: Enum [CEO, CTO, CMO, Sales, Engineer, QA, Designer]
├── reporting_to: Agent.id
├── budget_limit: Decimal
├── budget_spent: Decimal
├── heartbeat_schedule: Enum [4h, 8h, 12h, continuous]
├── status: Enum [active, paused, terminated]
├── skills: Skill[]
├── adapter: String [claude, codex, gemini, cursor, hermes, ...]
└── memory: MemoryEntry[]

Goal
├── id: UUID
├── company_id: UUID
├── parent_goal_id: UUID (nullable)
├── title: String
├── description: String
├── status: Enum [backlog, in_progress, done, blocked]
├── priority: Enum [P0, P1, P2]
└── tasks: Task[]

Task
├── id: UUID
├── goal_id: UUID
├── assignee_id: UUID
├── title: String
├── description: String
├── acceptance_criteria: String[]
├── status: Enum [backlog, in_progress, review, done, rejected]
├── context_chain: String[] (goal ancestry)
├── tool_calls: ToolCall[]
└── audit_trail: AuditEntry[]

CanvasZone
├── id: UUID
├── type: Enum [business, engineering, shared]
├── name: String
├── cards: Card[]
├── collaborators: User[]
└── permissions: Permission[]

Card
├── id: UUID
├── zone_id: UUID
├── type: Enum [text, image, link, embed, calculator, preview]
├── content: JSON
├── position: {x, y}
├── created_by: User.id
├── last_modified: Timestamp
└── version_history: Version[]

KnowledgePage
├── id: UUID
├── source: Enum [paperclip, hcom, aegis, plannotator, bmad, manual]
├── type: Enum [decision, plan, audit, assumption, fact]
├── title: String
├── content: Markdown
├── frontmatter: YAML
├── confidence: Float (0-1)
├── recency: Timestamp
├── evidence_sources: String[]
├── supersedes: UUID[]
└── contradictions: UUID[]

```

---

## 6. API Specifications

### 6.1 Agor Canvas API
```
POST /api/v1/zones
  Body: { name, type, permissions }
  Response: { zone_id, ws_url }

GET /api/v1/zones/{zone_id}/cards
  Response: { cards: [...] }

POST /api/v1/zones/{zone_id}/cards
  Body: { type, content, position }
  Response: { card_id }

WS /ws/zones/{zone_id}
  Events: cursor_move, card_create, card_update, card_delete, presence

POST /api/v1/mcp/canvas/spawn
  Body: { agent_id, zone_id, task_id }
  Response: { session_id, worktree_path }
```

### 6.2 Paperclip API
```
POST /api/v1/companies
  Body: { name, mission, goal }
  Response: { company_id, ceo_agent_id }

POST /api/v1/companies/{id}/agents
  Body: { name, role, reporting_to, budget, adapter }
  Response: { agent_id, heartbeat_schedule }

POST /api/v1/companies/{id}/agents/{agent_id}/tasks
  Body: { title, description, priority, context_chain }
  Response: { task_id }

GET /api/v1/companies/{id}/dashboard
  Response: { org_chart, budgets, active_tasks, audit_log }

POST /api/v1/companies/{id}/board/approve
  Body: { decision_type, decision_id, approval }
  Response: { status, next_steps }
```

### 6.3 HCOM API
```
POST /hcom/agents
  Body: { name, adapter, terminal_type }
  Response: { agent_id, session_id, inbox }

POST /hcom/agents/{id}/message
  Body: { recipient_id, intent, content, context_bundle }
  Response: { message_id, delivery_status }

GET /hcom/agents/{id}/status
  Response: { name, status, active_task, last_heartbeat }

GET /hcom/dashboard
  Response: { agents: [...], messages: [...], collisions: [...] }

POST /hcom/agents/{id}/spawn
  Body: { fork_from, task_description }
  Response: { new_agent_id, session_id }
```

### 6.4 Gbrain API
```
POST /api/v1/pages
  Body: { source, type, title, content, frontmatter, confidence }
  Response: { page_id, embedding_status }

GET /api/v1/query
  Query: { q, filters, limit }
  Response: { results: [...], graph_connections: [...] }

POST /api/v1/mcp/tools/{tool_name}
  Body: { parameters }
  Response: { result }

GET /api/v1/dashboards/{dashboard_id}
  Response: { widgets: [...], data: [...] }
```

---

## 7. Dependencies & Integrations

### 7.1 External Services
| Service | Purpose | Integration Type | Required |
|---------|---------|-----------------|----------|
| Anthropic API | Claude Code, Claude Opus | API key | Yes |
| OpenAI API | Codex, GPT-4 | API key | Yes |
| Google API | Gemini CLI | API key | Optional |
| OpenRouter | Multi-model access | API key | Optional |
| Brave Search | Web search for agents | API key | Optional |
| Resend | Email for outreach | API key | Optional |

### 7.2 Internal Integrations
| Source | Target | Mechanism | Data |
|--------|--------|-----------|------|
| Paperclip | Gbrain | MCP tools | Tickets, decisions, budgets |
| HCOM | Gbrain | Auto-capture | Transcripts, messages, events |
| AEGIS | Gbrain | API | Audit reports, findings |
| Plannotator | Gbrain | API | Annotations, approvals |
| BMAD | Gbrain | API | PRDs, plans, assumptions |
| Agor | Gbrain | MCP | Canvas cards, zone changes |
| Paperclip | HCOM | Adapter | Agent task assignments |
| HCOM | Agor | MCP | Session status, previews |
| AEGIS | PAUL | Transform | Remediation plans |
| PAUL | Plannotator | API | Plan submission for review |

---

## 8. Open Questions

1. Should DenchClaw CRM be embedded in the Agor canvas or remain a separate web UI?
2. What is the optimal heartbeat schedule for different agent types (CEO vs. Engineer vs. QA)?
3. How do we handle agent API rate limiting when 15+ agents run simultaneously?
4. Should Gbrain auto-capture include full agent transcripts or only summaries?
5. What is the disaster recovery plan for the local SQLite brain if the machine fails?
6. How do we version-control CARL rules alongside code?
7. Should the domain expert have a mobile app for milestone approvals?

---

*End of PRD*
