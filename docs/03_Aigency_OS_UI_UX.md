# UI/UX DESIGN DOCUMENT

**Project:** Venture Spec Collaboration Platform  
**Version:** 1.0  
**Date:** 2026-06-24  
**Template:** BMAD Method — Design Document  
**Status:** Draft — Ready for Implementation  

---

## 1. Design Philosophy

### 1.1 Core Principles
1. **Visual-first:** Every concept starts on a canvas, not in a document.
2. **Progressive disclosure:** Domain experts see business logic; technical details are hidden until needed.
3. **Agent transparency:** Humans can see what agents are doing without needing to understand the internals.
4. **Contextual actions:** Every UI element offers actions relevant to the user's role and current context.
5. **Infinite scalability:** The canvas grows with the project; no arbitrary limits on cards, zones, or connections.

### 1.2 Design Language
- **Minimal chrome:** Maximum canvas real estate. Toolbars float and auto-hide.
- **High contrast zones:** Business Zone (warm amber), Engineering Zone (cool blue), Shared Zone (neutral purple).
- **Agent presence:** Agents appear as avatars with status rings (green=active, yellow=thinking, red=blocked).
- **Motion:** Subtle animations for card movements, agent heartbeats, and gate transitions.
- **Typography:** Inter for UI, JetBrains Mono for code, Playfair Display for venture branding.

---

## 2. User Personas & Journeys

### 2.1 Persona: Domain Expert (DE)

**Name:** Sarah  
**Role:** Business strategist, non-technical  
**Goals:** Define business model, review plans, approve milestones, manage customer relationships  
**Frustrations:** Technical tools overwhelm her; she loses track of decisions; she can't see progress  
**Tech Comfort:** Uses Notion, Figma, Google Docs. Never uses terminal or code.

**Journey: Day 1 — Venture Discovery**
1. Opens Agor in browser → sees empty Business Zone with BMC template
2. Drags cards to fill in Value Proposition, Revenue Streams, Customer Segments
3. Revenue calculator widget auto-validates unit economics
4. Sarah adds competitive analysis cards with screenshots and links
5. BMAD analyst agent suggests market research → Sarah approves
6. End of day: Business Model Canvas is complete, auto-saved to Gbrain

**Journey: Day 3 — Plan Review**
1. Receives notification: "Technical plan ready for review"
2. Opens Plannotator from Agor card → sees annotated PRD
3. Business sections highlighted; technical sections collapsed
4. Sarah adds comment on pricing strategy → suggests freemium tier
5. Clicks "Approve with changes" → plan routed back to CTO agent
6. Audit trail stored in Gbrain

**Journey: Day 7 — Milestone Gate**
1. Receives visual milestone card on Agor canvas
2. Sees risk heatmap: green (architecture), yellow (security), red (unit economics)
3. Clicks red cell → sees executive summary: "CAC exceeds LTV by 30%"
4. Discusses with technical founder → approves with note: "Revise pricing before ship"
5. Babysitter enforces: no ship until pricing revision is approved

### 2.2 Persona: Technical Founder (TF)

**Name:** Alex  
**Role:** Technical founder, expert CLI user  
**Goals:** Orchestrate agents, control architecture, ship MVP, capture knowledge  
**Frustrations:** Managing 15+ terminal tabs, losing context, no visibility for domain expert  
**Tech Comfort:** Lives in terminal, uses 10+ CLI tools daily, builds with AI agents.

**Journey: Day 1 — Setup**
1. SSHs to VPS, runs `docker compose up` → all services start
2. Opens Agor in browser → invites Sarah via share link
3. Opens Paperclip dashboard → creates company, defines goal
4. Hires CEO agent (Zeus/Hermes) → approves hiring plan
5. Spawns HCOM sessions: `hcom hermes`, `hcom claude`, `hcom kimi`
6. Monitors all agents in TUI dashboard

**Journey: Day 3 — Technical Spec**
1. Receives approved PRD from BMAD + Plannotator
2. Runs `paul init` with PRD context → generates TECH-SPEC
3. CARL loads architecture rules dynamically
4. Reviews plan in Engineering Zone → adds ASCII architecture diagram
5. Submits to AEGIS lightweight audit → passes
6. Plan auto-captured to Gbrain

**Journey: Day 7 — Parallel Implementation**
1. Hermes delegates via HCOM: Claude builds API, Kimi builds frontend
2. Gstack runs `/autoplan` → CEO review → design shotgun → eng review
3. GSD Pi runs `gsd --web` for experimental feature branch
4. amux dashboard shows all sessions green, budgets within limits
5. AEGIS full audit triggered at milestone → finds 3 issues
6. AEGIS Transform creates remediation plan → PAUL executes fixes
7. Gstack `/ship` → `/land-and-deploy` → MVP live

---

## 3. Screen Designs

### 3.1 Agor Canvas — Main Workspace

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Logo]  [File] [Edit] [View] [Agents] [Brain] [CRM]          [Sarah] [Alex]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         BUSINESS ZONE                               │    │
│  │  [Warm amber background, subtle grid]                               │    │
│  │                                                                       │    │
│  │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │    │ Value Prop  │    │ Revenue     │    │ Customers   │             │    │
│  │    │ [Text]      │    │ [Calculator]│    │ [Persona]   │             │    │
│  │    │             │    │ $10/mo      │    │             │             │    │
│  │    │ AI-powered  │    │ Freemium    │    │ Startups    │             │    │
│  │    │ note-taking │    │ 100 users   │    │ 5-50 emp    │             │    │
│  │    └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  │                                                                       │    │
│  │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │    │ Competitors │    │ Channels    │    │  Milestone  │             │    │
│  │    │ [Image]     │    │ [Links]     │    │  [Card]     │             │    │
│  │    │ Notion, Obs │    │ SEO, Social │    │  ✅ Phase 1  │             │    │
│  │    │             │    │             │    │  ⏳ Phase 2  │             │    │
│  │    └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  │                                                                       │    │
│  │  [Sarah's cursor]  [Alex's cursor]  [Hermes avatar: 🟢 active]        │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                       ENGINEERING ZONE                              │    │
│  │  [Cool blue background, subtle grid]  [DE: Read-Only]               │    │
│  │                                                                       │    │
│  │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │    │ Architecture│    │ API Schema  │    │ Live Preview│             │    │
│  │    │ [Diagram]   │    │ [Markdown]  │    │ [iframe]    │             │    │
│  │    │             │    │             │    │             │             │    │
│  │    │  ┌─────┐    │    │ GET /users  │    │ [App UI]    │             │    │
│  │    │  │API  │    │    │ POST /notes │    │             │             │    │
│  │    │  └─────┘    │    │             │    │             │             │    │
│  │    └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  │                                                                       │    │
│  │    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │    │
│  │    │ Agent Status│    │ Git Branches│    │  Test Results│             │    │
│  │    │ [Dashboard] │    │ [List]      │    │  [Pass/Fail]│             │    │
│  │    │ Claude: 🟢   │    │ main        │    │  45/45 ✅   │             │    │
│  │    │ Kimi: 🟡     │    │ feature/auth│    │             │             │    │
│  │    │ Hermes: 🟢   │    │             │    │             │             │    │
│  │    └─────────────┘    └─────────────┘    └─────────────┘             │    │
│  │                                                                       │    │
│  │  [Claude avatar: 🟢] [Kimi avatar: 🟡] [GSD Pi avatar: 🟢]            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  [Floating toolbar: +Card | +Zone | +Agent | +Preview | Brain Query]       │
│  [Zoom: 100%]  [Minimap]  [Search]  [Notifications: 3]                     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Paperclip Dashboard — Venture Orchestration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [Paperclip]  [Companies] [Agents] [Goals] [Tickets] [Board]    [Settings]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Acme Ventures  ────────────────────────────────────────────────────────    │
│  Mission: Build the #1 AI note-taking app to $1M ARR                        │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                         ORG CHART                                   │    │
│  │                                                                     │    │
│  │                              ┌─────────────┐                        │    │
│  │                              │   CEO       │                        │    │
│  │                              │   Zeus      │                        │    │
│  │                              │   🟢 Active │                        │    │
│  │                              │   $12/$60   │                        │    │
│  │                              └──────┬──────┘                        │    │
│  │                   ┌─────────────────┼─────────────────┐             │    │
│  │                   │                 │                 │             │    │
│  │            ┌──────┴──────┐   ┌──────┴──────┐   ┌──────┴──────┐      │    │
│  │            │    CTO      │   │    CMO      │   │   Sales     │      │    │
│  │            │   Hermes    │   │  OpenCode   │   │  Claude     │      │    │
│  │            │   🟢 Active │   │  🟢 Active  │   │  🟡 Waiting │      │    │
│  │            │   $8/$50    │   │   $5/$40    │   │   $0/$30    │      │    │
│  │            └──────┬──────┘   └─────────────┘   └─────────────┘      │    │
│  │                   │                                                 │    │
│  │            ┌──────┴──────┐                                          │    │
│  │            │  Engineer   │                                          │    │
│  │            │   Claude    │                                          │    │
│  │            │   🟢 Active │                                          │    │
│  │            │   $15/$30   │                                          │    │
│  │            └─────────────┘                                          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ACTIVE TICKETS ────────────────────────────────────────────────────────    │
│  ┌──────────┬──────────────┬──────────┬──────────┬──────────┐               │
│  │ Ticket   │ Description  │ Assignee │ Status   │ Budget   │               │
│  ├──────────┼──────────────┼──────────┼──────────┼──────────┤               │
│  │ #42      │ Auth system  │ Claude   │ 🟡 In Prog│ $3.20   │               │
│  │ #43      │ Landing page │ Kimi     │ 🟢 Done   │ $1.50   │               │
│  │ #44      │ API schema   │ Hermes   │ 🟢 Done   │ $0.80   │               │
│  └──────────┴──────────────┴──────────┴──────────┴──────────┘               │
│                                                                             │
│  BUDGET OVERVIEW ───────────────────────────────────────────────────────    │
│  Total: $40 / $240 (16.7%)  [████████████████░░░░░░░░░░░░░░░░░░]          │
│                                                                             │
│  BOARD ACTIONS ────────────────────────────────────────────────────────    │
│  [Approve CEO Strategy] [Approve New Hire] [Adjust Budget] [Pause All]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 HCOM TUI Dashboard — Agent Monitor

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  HCOM Agent Monitor                                    [Refresh] [Settings] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  AGENTS ────────────────────────────────────────────────────────────────    │
│  ┌────────┬──────────┬─────────────┬──────────┬──────────┬──────────┐       │
│  │ Name   │ Adapter  │ Status      │ Task     │ Budget   │ Session  │       │
│  ├────────┼──────────┼─────────────┼──────────┼──────────┼──────────┤       │
│  │ hermes │ hermes   │ 🟢 Active   │ Arch     │ N/A      │ tmux:0   │       │
│  │ claude │ claude   │ 🟢 Active   │ API dev  │ $12.40   │ tmux:1   │       │
│  │ kimi   │ kimi     │ 🟡 Thinking │ UI dev   │ $8.20    │ tmux:2   │       │
│  │ gsd-pi │ gsd      │ 🟢 Active   │ Exp feat │ $2.10    │ tmux:3   │       │
│  │ qwen   │ qwen     │ 🔴 Blocked  │ Waiting  │ $0.00    │ tmux:4   │       │
│  │ gemini │ gemini   │ 🟢 Active   │ Tests    │ $1.50    │ tmux:5   │       │
│  └────────┴──────────┴─────────────┴──────────┴──────────┴──────────┘       │
│                                                                             │
│  MESSAGES ───────────────────────────────────────────────────────────────   │
│  [hermes → claude] "Design the auth middleware, then ask kimi for the UI"   │
│  [claude → hermes] "Auth middleware done. JWT-based, 15min expiry."         │
│  [kimi → claude] "UI components ready. Need API endpoint for /login"          │
│  [Collision Alert] claude and kimi both editing src/auth.ts within 30s!     │
│                                                                             │
│  TERMINAL PREVIEW ──────────────────────────────────────────────────────    │
│  ┌─────────────────────────┐  ┌─────────────────────────┐                   │
│  │ claude: tmux:1          │  │ kimi: tmux:2            │                   │
│  │ $ npm test              │  │ $ npm run dev           │                   │
│  │ ✓ 45 tests passed       │  │ [vite] ready on :3000   │                   │
│  │                         │  │                         │                   │
│  │                         │  │                         │                   │
│  └─────────────────────────┘  └─────────────────────────┘                   │
│                                                                             │
│  [Attach] [Kill] [Fork] [Message] [Subscribe] [View Transcript]           │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.4 Plannotator — Plan Review Gate

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Plannotator — Review Plan: "Acme MVP v1.0"                    [Share] [X]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  BUSINESS SECTIONS (Visible to Domain Expert)                        │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │                                                                     │    │
│  │  [Pricing Strategy]                                                  │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ Free tier: 100 notes/month                                    │   │    │
│  │  │ Pro tier: $10/month unlimited                                 │   │    │
│  │  │ [Sarah's comment: "Consider $8 to undercut Notion"]          │   │    │
│  │  │ [Alex's reply: "Margin too thin. Sticking with $10."]        │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  │  [Go-to-Market]                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │ SEO content marketing, Product Hunt launch, Twitter/X       │   │    │
│  │  │ [Sarah's comment: "Add LinkedIn for B2B"]                    │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  TECHNICAL SECTIONS (Hidden from Domain Expert — Admin Only)        │    │
│  │  ─────────────────────────────────────────────────────────────────  │    │
│  │  [Click to expand]                                                   │    │
│  │  ▶ Architecture: Next.js 14, PostgreSQL, Redis, Vercel                │    │
│  │  ▶ API: REST + WebSocket, OpenAPI 3.0 spec                        │    │
│  │  ▶ Auth: JWT + bcrypt, 15min expiry, refresh tokens                │    │
│  │  ▶ Database: 12 tables, 3 indexes, 2 materialized views            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  APPROVAL ──────────────────────────────────────────────────────────────    │
│  [✅ Approve as-is]  [✏️ Approve with changes]  [❌ Reject]  [💬 Request]   │
│                                                                             │
│  Version: 1.2 | Last updated: 2 hours ago | Diff from v1.1 [View]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.5 Gbrain Dashboard — Knowledge Visualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Gbrain — Company Knowledge                                    [Query] [+]  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  KNOWLEDGE GRAPH ─────────────────────────────────────────────────────    │
│                                                                             │
│        ┌─────────────┐                                                    │
│        │  Business   │                                                    │
│        │  Model      │                                                    │
│        │  [Decision] │                                                    │
│        └──────┬──────┘                                                    │
│               │                                                           │
│    ┌──────────┼──────────┐                                                │
│    ▼          ▼          ▼                                                │
│ ┌────────┐ ┌────────┐ ┌────────┐                                        │
│ │Revenue │ │Customer│ │Compet- │                                        │
│ │Model   │ │Segments│ │itors   │                                        │
│ └────────┘ └────────┘ └────────┘                                        │
│    │          │          │                                                │
│    └──────────┼──────────┘                                                │
│               ▼                                                           │
│        ┌─────────────┐                                                    │
│        │  PRD v1.2  │                                                    │
│        │  [Plan]     │                                                    │
│        └──────┬──────┘                                                    │
│               │                                                           │
│    ┌──────────┼──────────┐                                                │
│    ▼          ▼          ▼                                                │
│ ┌────────┐ ┌────────┐ ┌────────┐                                        │
│ │Tech    │ │AEGIS   │ │Milestone│                                        │
│ │Spec    │ │Audit   │ │Gate    │                                        │
│ └────────┘ └────────┘ └────────┘                                        │
│                                                                             │
│  RECENT CAPTURES ──────────────────────────────────────────────────────    │
│  ┌──────────┬─────────────────────┬──────────┬──────────┐                   │
│  │ Source   │ Title               │ Type     │ Confidence│                   │
│  ├──────────┼─────────────────────┼──────────┼──────────┤                   │
│  │ AEGIS    │ Security audit #3   │ Audit    │ 0.92     │                   │
│  │ Paperclip│ CEO strategy v2     │ Decision │ 0.85     │                   │
│  │ Plannotator│ Pricing approval  │ Decision │ 0.88     │                   │
│  │ HCOM     │ Auth middleware done│ Fact     │ 0.95     │                   │
│  │ BMAD     │ Market research     │ Assumption│ 0.72    │                   │
│  └──────────┴─────────────────────┴──────────┴──────────┘                   │
│                                                                             │
│  QUERY ────────────────────────────────────────────────────────────────    │
│  [What was our decision on pricing?]  [Search]                              │
│  Result: "Pro tier $10/month (confidence: 0.88, sources: Plannotator,      │
│  BMAD). Sarah suggested $8, Alex maintained $10 for margin. Approved."       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.6 Milestone Gate Card (Agor Artifact)

```
┌─────────────────────────────────────────────────────────┐
│  🛡️ MILESTONE GATE: Phase 2 — Technical Architecture    │
│  Status: ⏳ Awaiting Approval                            │
│  Due: 2026-06-28                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  RISK HEATMAP                                           │
│  ┌─────────────┬──────────┬──────────┐                  │
│  │ Architecture│ 🟢 Pass  │ 0 issues │                  │
│  │ Security    │ 🟢 Pass  │ 0 issues │                  │
│  │ Performance │ 🟡 Warn  │ 1 issue  │                  │
│  │ Testing     │ 🟢 Pass  │ 0 issues │                  │
│  │ Scalability │ 🟢 Pass  │ 0 issues │                  │
│  │ Unit Econ   │ 🔴 Fail  │ 1 issue  │                  │
│  │ Compliance  │ 🟢 Pass  │ 0 issues │                  │
│  └─────────────┴──────────┴──────────┘                  │
│                                                         │
│  🔴 Unit Economics: CAC ($45) exceeds LTV ($35) by 30%  │
│     → Revise pricing or reduce acquisition cost           │
│                                                         │
│  [View Full Report]  [View Executive Summary]           │
│                                                         │
│  [✅ Approve & Proceed]  [❌ Reject & Revise]            │
│  [💬 Comment]  [⏸️ Pause for Discussion]               │
│                                                         │
│  Audit trail: 3 reviews, 2 comments, 1 revision         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Component Library

### 4.1 Atoms

| Component | Description | States | Variants |
|-----------|-------------|--------|----------|
| **Card** | Draggable canvas element | Default, hover, selected, locked | Text, image, link, embed, calculator, preview |
| **Avatar** | User or agent identity | Online, away, busy, offline | Human (photo), Agent (icon + status ring) |
| **Status Ring** | Activity indicator | Green (active), yellow (thinking), red (blocked), gray (idle) | Solid, pulsing, spinning |
| **Button** | Action trigger | Default, hover, active, disabled | Primary, secondary, danger, ghost |
| **Input** | Text entry | Default, focus, error, disabled | Single-line, multi-line, number, password |
| **Badge** | Metadata tag | Default | Priority (P0/P1/P2), Status (done/in progress), Risk (low/medium/high) |
| **Tooltip** | Contextual help | Visible, hidden | Light, dark |
| **Progress Bar** | Completion indicator | Determinate, indeterminate | Budget, milestone, task |

### 4.2 Molecules

| Component | Description | Composition |
|-----------|-------------|-------------|
| **Agent Card** | Agent status summary | Avatar + Name + Status + Budget + Actions |
| **Ticket Card** | Task representation | Title + Description + Assignee + Status + Priority |
| **Zone Header** | Canvas zone label | Name + Type + Permissions + Collaborator avatars |
| **Annotation Thread** | Discussion on plan | Comment + Author + Timestamp + Reply chain |
| **Risk Cell** | Audit domain status | Domain name + Color + Issue count + Expand button |
| **Budget Meter** | Spend visualization | Progress bar + Amount + Limit + Percentage |
| **Knowledge Node** | Graph element | Title + Type + Confidence + Connections |

### 4.3 Organisms

| Component | Description | Composition |
|-----------|-------------|-------------|
| **Canvas** | Infinite workspace | Zones + Cards + Grid + Zoom + Minimap + Toolbar |
| **Org Chart** | Company hierarchy | Agent cards + Reporting lines + Budget meters |
| **Ticket Board** | Task management | Ticket cards + Columns (backlog, in progress, done) + Filters |
| **Audit Report** | Quality gate results | Risk heatmap + Findings list + Executive summary + Actions |
| **Brain Graph** | Knowledge visualization | Knowledge nodes + Connections + Query bar + Recent captures |
| **Agent Dashboard** | Terminal monitor | Agent list + Messages + Terminal previews + Actions |

---

## 5. Interaction Patterns

### 5.1 Canvas Interactions

| Action | Trigger | Feedback | Animation |
|--------|---------|----------|-----------|
| Pan canvas | Drag empty space | Canvas moves | Smooth inertia |
| Zoom | Pinch / scroll wheel | Scale changes | 300ms ease-out |
| Create card | Double-click / toolbar | Card appears | Scale-in from center |
| Move card | Drag card | Card follows cursor | Snap to grid on release |
| Resize card | Drag handle | Card resizes | Real-time preview |
| Select card | Click | Border highlight | 100ms fade-in |
| Multi-select | Shift+click / lasso | All selected | Staggered highlight |
| Connect cards | Drag from port to port | Line appears | Draw animation |
| Agent spawns | MCP trigger | Agent avatar appears | Drop-in bounce |

### 5.2 Gate Interactions

| Action | Trigger | Feedback | Consequence |
|--------|---------|----------|-------------|
| Approve milestone | Click "Approve" | Green check, confetti | Babysitter releases next phase |
| Reject milestone | Click "Reject" | Red X, shake | Plan routed back to agent |
| Request changes | Click "Comment" | Yellow highlight | Notification to relevant agent |
| Annotate plan | Click section + type | Inline comment box | Structured feedback sent |
| View diff | Click "View Diff" | Side-by-side comparison | Version history displayed |

### 5.3 Agent Interactions

| Action | Trigger | Feedback | Consequence |
|--------|---------|----------|-------------|
| Spawn agent | Command / dashboard | Agent card appears in HCOM | New terminal session created |
| Message agent | @mention / command | Message appears in inbox | Recipient agent notified |
| Kill agent | Click "Kill" | Avatar turns gray | Session terminated, budget frozen |
| Fork agent | Click "Fork" | New avatar appears | Cloned session with shared context |
| Subscribe to agent | Click "Subscribe" | Bell icon active | Real-time updates on status |

---

## 6. Responsive & Adaptive Design

### 6.1 Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 768px | Single column, floating toolbar, swipe gestures |
| Tablet | 768-1024px | Two-column canvas, sidebar collapsible |
| Desktop | 1024-1440px | Full canvas, persistent sidebars |
| Wide | > 1440px | Multi-pane canvas, simultaneous zone view |

### 6.2 Domain Expert Simplification

| Feature | Full View | DE Simplified View |
|---------|-----------|-------------------|
| Canvas | All zones | Business Zone only, Engineering hidden |
| Agent Status | Full terminal output | Avatar + status text only |
| Plan Review | All sections | Business sections only, technical collapsed |
| Audit Report | 14-domain detail | Executive summary + red flags only |
| Brain Query | Full graph + raw results | Natural language answers only |

### 6.3 Dark Mode

All screens support dark mode with:
- Business Zone: warm amber → deep orange (#7c2d12)
- Engineering Zone: cool blue → deep blue (#1e3a8a)
- Cards: elevated with subtle shadow
- Text: high contrast (WCAG AAA)
- Agent status rings: brighter for visibility

---

## 7. Accessibility

| Requirement | Implementation |
|-------------|----------------|
| WCAG 2.1 AA | All text 4.5:1 contrast, interactive elements 3:1 |
| Keyboard navigation | Tab order logical, arrow keys for canvas pan |
| Screen reader | ARIA labels on all cards, zones, and agent status |
| Color independence | Status conveyed by icon + text, not color alone |
| Motion reduction | Respect `prefers-reduced-motion`, disable animations |
| Focus indicators | 2px outline on all interactive elements |

---

*End of UI/UX Design Document*
