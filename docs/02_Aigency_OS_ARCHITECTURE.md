# SYSTEM ARCHITECTURE DOCUMENT

**Project:** Venture Spec Collaboration Platform  
**Version:** 1.0  
**Date:** 2026-06-24  
**Template:** BMAD Method — Architecture Document  
**Status:** Draft — Ready for Implementation  

---

## 1. Architecture Overview

### 1.1 Design Philosophy
The platform follows a **Dual-Helix Architecture**: two parallel strands (Business and Technical) that converge at controlled handoff points. This ensures the domain expert remains in control of the *what* and *why*, while the technical founder controls the *how*, with agents productive in the gap between them.

### 1.2 Architectural Principles
1. **Self-hosted by default:** All core services run locally. No cloud dependency for sensitive data.
2. **Agent-first:** Every interface, API, and data model is designed for both human and agent consumption.
3. **Deterministic gates:** Human approval is enforced at milestone boundaries, not optional.
4. **Knowledge is infrastructure:** Every decision, plan, and audit is automatically captured and made searchable.
5. **Communication over coordination:** Agents communicate directly (HCOM) rather than through a central bottleneck.

### 1.3 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Canvas | Agor (Node.js + React + WebSocket) | Shared multiplayer workspace |
| Orchestration | Paperclip (Node.js + React + PostgreSQL) | Venture org chart, agents, budgets |
| Business Logic | BMAD (Node.js CLI) | Methodology, PRD generation |
| Gates | Babysitter (Claude plugin) | Workflow enforcement |
| Plans | Plannotator (Node.js + React) | Plan review and annotation |
| Technical Spec | PAUL + SEED + CARL (Node.js CLI) | Plan-Apply-Unify loop |
| Agent Comms | HCOM (Rust + SQLite) | Cross-agent messaging |
| Terminal | tmux / amux (C/Rust) | Session persistence |
| Implementation | Gstack + GSD Pi (Node.js CLI) | Build, QA, ship |
| Quality | AEGIS (Node.js CLI) | 14-domain audit |
| CRM | DenchClaw (Node.js + DuckDB) | Contact, deal, outreach |
| Brain | Gbrain (Bun + PGLite) | Knowledge capture, search |
| Design | Google Stitch, Huashu, Open Design (MCP) | Branding, UI components |

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              LAYER 1: AGOR                                  │
│                    Shared Multiplayer Visual Canvas                           │
│  ┌─────────────────────┐              ┌─────────────────────┐                │
│  │   Business Zone     │              │   Engineering Zone  │                │
│  │  (Domain Expert: RW) │              │  (Domain Expert: RO)│                │
│  │  - BMC cards        │              │  - Worktrees        │                │
│  │  - Revenue calc     │              │  - Agent sessions   │                │
│  │  - Competitive map  │              │  - Architecture     │                │
│  │  - User personas    │              │  - Live previews    │                │
│  └─────────────────────┘              └─────────────────────┘                │
│                              MCP Server                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LAYER 2: PAPERCLIP                                │
│                     Venture Orchestration (CEO Agent)                       │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │  CEO    │  │  CTO    │  │  CMO    │  │  Sales  │  │ Budgets │          │
│  │ (Zeus)  │  │ (Tech)  │  │(Market) │  │  (CRM)  │  │(Limits) │          │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘          │
│       │            │            │            │            │                 │
│       └────────────┴────────────┴────────────┴────────────┘                 │
│                              Heartbeat Loop                                 │
│                         Goal Ancestry + Tickets                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  LAYER 3A: BUSINESS │  │   PLANNOTATOR GATE  │  │ LAYER 3B: TECHNICAL │
│      BMAD           │  │  Business→Technical │  │   PAUL + SEED + CARL│
│  - Analysis         │  │  - DE annotates biz │  │   - Plan            │
│  - Planning         │  │  - TF annotates tech│  │   - Apply           │
│  - Babysitter gates │  │  - Structured export│  │   - Unify           │
│  - PRD generation   │  │  - Approval required│  │   - Dynamic rules   │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
                    │                 │                 │
                    └─────────────────┼─────────────────┘
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         LAYER 4: HCOM + MULTIPLEXER                         │
│                  Agent Communication + Terminal Orchestration                 │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │  HCOM   │  │  tmux   │  │  amux   │  │  SSH    │  │  TUI    │          │
│  │ (Rust)  │  │(session)│  │(watchdog│  │(remote) │  │(dashboard│          │
│  │ SQLite  │  │persist) │  │ + mobile)│  │ access  │  │         │          │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘          │
│       │            │            │            │            │                 │
│       └────────────┴────────────┴────────────┴────────────┘                 │
│                         15+ CLI Agents Connected                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LAYER 5: IMPLEMENTATION ORCHESTRA                     │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ Gstack  │  │ GSD Pi  │  │ Hermes  │  │ Claude  │  │ Design  │          │
│  │ (Build) │  │(Web UI) │  │(Architect│  │ (Code)  │  │ (Skills)│          │
│  │ /ship   │  │ auto    │  │ lead    │  │ backend │  │ Stitch  │          │
│  │ /qa     │  │ mode    │  │ design  │  │ frontend│  │ Huashu  │          │
│  │ /cso    │  │ multi-tab│  │ decisions│  │ tests   │  │ Open    │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LAYER 6: QUALITY GATES                                │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ AEGIS   │  │ AEGIS   │  │ grill-  │  │ grill-  │  │ Milestone│          │
│  │ Core    │  │ Transform│  │ me      │  │ w/docs  │  │ Gates   │          │
│  │ 14 dom  │  │ Remediate│  │ stress  │  │ domain  │  │ Babysit │          │
│  │ 12 pers │  │ Execute  │  │ test    │  │ model   │  │ approve │          │
│  │ Devil's │  │ PAUL hand│  │ plans   │  │ CONTEXT │  │ unit econ│         │
│  │ Advocate│  │ off      │  │         │  │ .md     │  │         │          │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    ▼                 ▼                 ▼
┌─────────────────────┐  ┌─────────────────────┐  ┌─────────────────────┐
│  LAYER 7: CRM       │  │   LAYER 8: BRAIN    │  │   VISUAL DASHBOARDS │
│    DenchClaw        │  │     Gbrain          │  │   (Agor Artifacts)  │
│  - DuckDB local     │  │  - PGLite/Postgres  │  │  - Decisions graph  │
│  - Web UI 3100      │  │  - Hybrid search    │  │  - Risk heatmap     │
│  - Contacts         │  │  - Self-wiring graph│  │  - Agent status     │
│  - Deals            │  │  - 74 MCP tools     │  │  - Budget tracker   │
│  - Outreach         │  │  - Auto-capture     │  │  - Milestone board  │
│  - Skills store     │  │  - LLM-wiki-v2      │  │  - Knowledge query  │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 3. Component Architecture

### 3.1 Agor Canvas Service

**Responsibility:** Shared multiplayer workspace for humans and agents.

**Components:**
- **WebSocket Server:** Real-time sync for cursors, cards, and presence
- **Zone Manager:** RBAC enforcement (Business Zone RW for DE, Engineering Zone RO for DE)
- **Card System:** Typed cards (text, image, link, embed, calculator, preview)
- **Worktree Manager:** Git worktree integration for agent session tracking
- **MCP Server:** Exposes canvas operations to agents
- **Artifact Renderer:** Renders live dashboards, calculators, and previews

**Data Flow:**
1. User drags card → WebSocket broadcasts to all collaborators
2. Agent spawns session → MCP creates worktree card in Engineering Zone
3. Card updated → Auto-save to Gbrain via MCP

**Tech:** Node.js, React, WebSocket, PostgreSQL (for persistence)

### 3.2 Paperclip Orchestration Service

**Responsibility:** Venture-level agent management with org charts and budgets.

**Components:**
- **Company Manager:** Creates companies, defines missions and goals
- **Agent Factory:** Spawns agents with roles, adapters, and budgets
- **Heartbeat Scheduler:** Wakes agents on schedule or event triggers
- **Task Router:** Delegates tasks through org chart hierarchy
- **Budget Controller:** Tracks per-agent spend, enforces limits
- **Ticket System:** Structured threads with full tool-call tracing
- **Board Portal:** Human approval workflow for major decisions

**Data Flow:**
1. CEO agent analyzes goal → drafts hiring plan
2. Board (you) approves hires → Agent Factory spawns agents
3. Heartbeat fires → Agent checks queue, injects context, executes
4. Task completed → Ticket updated, budget incremented, memory stored

**Tech:** Node.js, React, PostgreSQL, embedded Postgres for local

### 3.3 HCOM Communication Service

**Responsibility:** Cross-agent messaging and lifecycle management.

**Components:**
- **Message Bus:** SQLite-based pub/sub with real-time delivery
- **Agent Registry:** Tracks agent identities, statuses, and inboxes
- **Hook System:** Injects into agent config dirs for automatic capture
- **Observer:** Monitors transcripts, file edits, terminal screens
- **Collision Detector:** Detects simultaneous file edits within 30s window
- **Lifecycle Manager:** Spawn, fork, resume, kill agents
- **TUI Dashboard:** Visual monitoring of all agents

**Data Flow:**
1. Agent A sends message → SQLite insert → Hook delivers to Agent B
2. Agent B edits file → Hook records → Collision Detector checks
3. Agent C subscribes to Agent A → Receives all status changes

**Tech:** Rust, SQLite, Unix sockets, MQTT relay (optional)

### 3.4 Terminal Multiplexer Service

**Responsibility:** Persistent, remote-accessible terminal sessions.

**Components:**
- **Session Manager:** Creates, persists, and reattaches sessions
- **Worktree Isolator:** Git worktree per agent session
- **Remote Access:** SSH tunneling for remote connections
- **Web Dashboard:** Browser-based session monitoring (amux)
- **Self-Healing Watchdog:** Auto-restarts crashed agents (amux)
- **Mobile PWA:** iOS/Android monitoring (amux)

**Data Flow:**
1. User SSHs to VPS → Session Manager attaches to existing tmux session
2. Agent crashes → Watchdog detects → Restarts with preserved context
3. User opens mobile app → Fetches session status via REST API

**Tech:** tmux (C), amux (Rust), SSH, WebSocket

### 3.5 Implementation Orchestra

**Responsibility:** Parallel code execution by multiple agents.

**Components:**
- **Gstack Engine:** 23-skilled build pipeline (plan → design → code → QA → ship)
- **GSD Pi Runner:** Standalone CLI with `gsd --web` multi-tab UI
- **Hermes Supervisor:** Lead architect agent delegating to workers
- **Worker Pool:** Claude, Kimi, Qwen, Gemini, Blackbox, etc. in parallel
- **Design Skills:** Google Stitch, Huashu, Open Design as MCP servers
- **Git Orchestrator:** Worktree merging, PR creation, conflict resolution

**Data Flow:**
1. Hermes receives TECH-SPEC → Delegates to Claude (backend) and Kimi (frontend)
2. Claude and Kimi communicate via HCOM while working
3. Gstack QA runs parallel security and regression tests
4. GSD Pi handles experimental features in isolated branch
5. All changes merged via Git Orchestrator

**Tech:** Node.js CLI, Git, MCP servers

### 3.6 Quality Gate Service

**Responsibility:** Milestone validation with multi-domain audit.

**Components:**
- **AEGIS Auditor:** 14-domain evaluation with 12 personas
- **Epistemic Engine:** Confidence scoring and reality gap detection
- **Transform Layer:** Converts findings into PAUL-compatible plans
- **grill-me Engine:** Stress-tests plans via decision tree walk
- **grill-with-docs Engine:** Domain modeling and CONTEXT.md building
- **Unit Economics Validator:** CAC, LTV, payback period checks
- **Executive Summarizer:** Generates DE-friendly summary from full audit

**Data Flow:**
1. Milestone reached → AEGIS Auditor triggered
2. 12 personas evaluate across 14 domains → Findings ranked by severity
3. Transform Layer creates remediation plan → PAUL executes
4. Executive summary rendered in Agor → DE approves/rejects

**Tech:** Node.js CLI, LLM APIs, structured output schemas

### 3.7 CRM Service (DenchClaw)

**Responsibility:** Customer relationship and outreach management.

**Components:**
- **Contact Manager:** DuckDB-backed contact storage and search
- **Deal Pipeline:** Kanban-style deal tracking with stages
- **Outreach Engine:** LinkedIn, email, and cold campaign automation
- **Skills Store:** 58,237+ skills for extending capabilities
- **Sync Manager:** GitHub/iCloud sync for team collaboration
- **Web UI:** localhost:3100 dashboard

**Data Flow:**
1. Sales agent identifies lead → Contact Manager stores in DuckDB
2. Outreach Engine sequences LinkedIn connection + follow-up email
3. Deal moves pipeline stage → Sync Manager pushes to GitHub
4. Domain expert reviews pipeline via Web UI

**Tech:** Node.js, DuckDB, React, OpenClaw

### 3.8 Knowledge Brain Service (Gbrain)

**Responsibility:** Automatic knowledge capture and retrieval.

**Components:**
- **Page Store:** Markdown pages with YAML frontmatter
- **Embedding Engine:** Vector embeddings for semantic search
- **BM25 Index:** Keyword search for exact matches
- **Graph Engine:** Self-wiring connections between related pages
- **MCP Server:** 74 tools for agent integration
- **Auto-Capture Pipeline:** Listens to all layers, stores events
- **Dashboard Renderer:** Visualizes knowledge as Agor artifacts
- **LLM-wiki-v2 Processor:** Applies confidence, recency, contradiction patterns

**Data Flow:**
1. Paperclip ticket closed → Auto-Capture stores as KnowledgePage
2. HCOM message sent → Transcript appended to agent's memory page
3. AEGIS audit completes → Findings stored with confidence scores
4. User queries brain → Hybrid search returns ranked results + graph

**Tech:** Bun, PGLite/PostgreSQL, vector DB, React

---

## 4. Data Architecture

### 4.1 Data Flow Diagram

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Domain    │────▶│    Agor     │────▶│   BMAD      │────▶│ Plannotator │
│   Expert    │     │   Canvas    │     │  Analysis   │     │    Gate     │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
┌─────────────┐     ┌─────────────┐     ┌─────────────┐            │
│   Gbrain    │◀────│    AEGIS    │◀────│    PAUL     │◀───────────┘
│   Brain     │     │   Quality   │     │   Spec      │
└──────┬──────┘     └─────────────┘     └──────┬──────┘
       │                                       │
       │    ┌─────────────┐     ┌─────────────┐│
       └───▶│    HCOM     │◀────│   Gstack    │◀┘
            │   Comms     │     │  Orchestra  │
            └──────┬──────┘     └─────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
  ┌─────────┐ ┌─────────┐ ┌─────────┐
  │ Claude  │ │  Kimi   │ │  GSD Pi │
  │ (Code)  │ │ (Code)  │ │ (Web UI)│
  └─────────┘ └─────────┘ └─────────┘
```

### 4.2 Data Stores

| Store | Technology | Data | Retention | Backup |
|-------|------------|------|-----------|--------|
| Canvas State | PostgreSQL | Cards, zones, positions | Persistent | Daily dump |
| Company Data | PostgreSQL | Agents, goals, tasks, budgets | Persistent | Daily dump |
| Messages | SQLite | HCOM transcripts, events | 90 days | Auto-sync to Gbrain |
| Knowledge | PGLite/Postgres | Pages, embeddings, graph | Persistent | Git sync |
| CRM | DuckDB | Contacts, deals, outreach | Persistent | GitHub sync |
| Sessions | tmux/amux | Terminal state, scrollback | Ephemeral | None |
| Audit Log | Append-only files | All human approvals, agent decisions | Forever | Immutable |

### 4.3 Data Security

- **Encryption at rest:** PostgreSQL and DuckDB use filesystem encryption
- **Encryption in transit:** WebSocket over TLS, SSH for remote access
- **Plan sharing:** Plannotator uses AES-256-GCM with URL-fragment keys
- **Agent secrets:** API keys stored in agent-level environment variables, never in logs
- **Access control:** RBAC at zone level (Agor), role level (Paperclip), page level (Gbrain)

---

## 5. Integration Architecture

### 5.1 Integration Patterns

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **MCP (Model Context Protocol)** | Agent ↔ Tool communication | Gbrain MCP server, Agor MCP server |
| **Event Streaming** | Real-time updates | WebSocket for canvas, SQLite triggers for HCOM |
| **Polling** | Heartbeat checks | Paperclip scheduler polls agent queues |
| **Webhook** | External notifications | Resend email, Slack notifications |
| **Git Sync** | Code and config versioning | Worktrees, branches, PRs |
| **File System** | Local-first data | DuckDB, SQLite, markdown files |

### 5.2 Integration Matrix

| Source → Target | Mechanism | Frequency | Data |
|-----------------|-----------|-----------|------|
| Paperclip → Gbrain | MCP tools | Real-time | Tickets, decisions, budgets |
| HCOM → Gbrain | Auto-capture | Real-time | Transcripts, messages, events |
| AEGIS → Gbrain | API push | Per milestone | Audit reports, findings |
| Plannotator → Gbrain | API push | Per review | Annotations, approvals |
| BMAD → Gbrain | API push | Per phase | PRDs, plans, assumptions |
| Agor → Gbrain | MCP tools | Real-time | Canvas cards, zone changes |
| Paperclip → HCOM | Adapter | Per task | Task assignments, context |
| HCOM → Agor | MCP tools | Real-time | Session status, previews |
| AEGIS → PAUL | Transform | Per audit | Remediation plans |
| PAUL → Plannotator | API | Per plan | Plan submission for review |
| Gstack → HCOM | Hooks | Real-time | Build status, QA results |
| DenchClaw → Paperclip | API | Per deal | Sales pipeline updates |

---

## 6. Deployment Architecture

### 6.1 Single-Machine Deployment

```
┌─────────────────────────────────────────────────────────┐
│                      VPS / Local Machine                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Agor       │  │  Paperclip  │  │  Gbrain     │     │
│  │  :3000      │  │  :3001      │  │  :3002      │     │
│  │  (Node.js)  │  │  (Node.js)  │  │  (Bun)      │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  DenchClaw  │  │  Plannotator│  │  AEGIS      │     │
│  │  :3100      │  │  :3003      │  │  (CLI)      │     │
│  │  (Node.js)  │  │  (Node.js)  │  │             │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  HCOM       │  │  tmux/amux  │  │  PostgreSQL │     │
│  │  (SQLite)   │  │  (C/Rust)   │  │  + PGLite   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  Reverse Proxy (nginx/Caddy) :443 → routes to services │
│  Tailscale (optional) : for remote access without VPS   │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Docker Compose (Recommended)

```yaml
version: '3.8'
services:
  agor:
    image: agor-live:latest
    ports: ["3000:3000"]
    volumes: ["./agor-data:/data"]

  paperclip:
    image: paperclipai/paperclip:latest
    ports: ["3001:3001"]
    environment:
      - DATABASE_URL=postgres://paperclip:pass@postgres/paperclip
    volumes: ["./paperclip-data:/data"]

  gbrain:
    image: garrytan/gbrain:latest
    ports: ["3002:3002"]
    volumes: ["./gbrain-data:/data"]

  denchclaw:
    image: denchhq/denchclaw:latest
    ports: ["3100:3100"]
    volumes: ["./denchclaw-data:/data"]

  postgres:
    image: postgres:16
    environment:
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=changeme
    volumes: ["./postgres-data:/var/lib/postgresql/data"]

  nginx:
    image: nginx:alpine
    ports: ["443:443", "80:80"]
    volumes: ["./nginx.conf:/etc/nginx/nginx.conf"]
```

### 6.3 Scaling Considerations

| Bottleneck | Limit | Mitigation |
|------------|-------|------------|
| RAM (16GB) | ~20 agents | Add swap, or upgrade to 32GB |
| API rate limits | Provider-dependent | Rotate keys, use OpenRouter, add delays |
| Disk I/O | SQLite contention | Use PostgreSQL for high-write services |
| Network | Single VPS bandwidth | Use Tailscale for LAN, CDN for static assets |
| Brain size | PGLite limits | Migrate to full PostgreSQL when >100K pages |

---

## 7. Security Architecture

### 7.1 Threat Model

| Threat | Impact | Mitigation |
|--------|--------|------------|
| Agent runs malicious skill | Code execution | Audit skills before install, sandbox (future) |
| API key leak | Financial loss | Agent-level env vars, no logging of keys |
| Unauthorized canvas access | Data exposure | RBAC, zone permissions, TLS |
| Runaway token spend | Budget overrun | Per-agent limits, soft/hard caps, auto-pause |
| Brain data loss | Knowledge loss | Git sync, daily backups, immutable audit log |
| Plan data leak | Competitive risk | AES-256-GCM encryption, auto-delete links |

### 7.2 Security Layers

1. **Network:** TLS 1.3 for all connections, SSH key auth for remote access
2. **Application:** RBAC at zone, role, and page levels
3. **Data:** Encryption at rest, encrypted sharing for plans
4. **Agent:** Budget limits, skill auditing, sandboxed execution (future)
5. **Audit:** Immutable append-only logs of all decisions and approvals

---

## 8. Performance Architecture

### 8.1 SLIs & SLOs

| Service | SLI | SLO | Measurement |
|---------|-----|-----|-------------|
| Agor Canvas | Sync latency | <100ms p99 | WebSocket round-trip |
| Paperclip | Heartbeat latency | <5s | Time from trigger to agent wake |
| HCOM | Message delivery | <50ms | SQLite insert to hook delivery |
| Gbrain | Query latency | <500ms | Hybrid search response time |
| DenchClaw | Page load | <1s | Web UI initial render |

### 8.2 Caching Strategy

| Layer | Cache | TTL | Invalidation |
|-------|-------|-----|--------------|
| Canvas | Redis (optional) | 5s | WebSocket broadcast |
| Brain | In-memory vector index | 1h | Page update triggers rebuild |
| Plans | Browser localStorage | Session | Plan version change |
| Agent Status | HCOM in-memory | 30s | Status change event |

---

## 9. Disaster Recovery

| Scenario | Recovery Time | Recovery Point | Procedure |
|----------|---------------|----------------|-----------|
| Machine failure | <1 hour | Last backup | Restore from daily PostgreSQL dump + Git sync |
| Database corruption | <30 min | Last transaction | Replay WAL logs from PostgreSQL |
| Agent session crash | <2 min | Last heartbeat | amux watchdog auto-restarts with context |
| API key compromise | <5 min | Immediate | Rotate keys, pause affected agents |
| Accidental deletion | <10 min | Last Git commit | Restore from Git sync |

---

*End of System Architecture Document*
