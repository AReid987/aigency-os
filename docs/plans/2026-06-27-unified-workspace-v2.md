# Unified Workspace v2 — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Merge Hermes Workspace, Paperclip AI, and DenchClaw functionality into the existing Aigency OS unified web app, all styled with the project's atomic design system — one cohesive product, not three separate apps.

**Architecture:** The existing `apps/web` absorbs all functionality currently split across `paperclip-ui`, `hcom-dashboard`, `denchclaw-ui`, `gbrain-dashboard`, `plannotator-ui`, and `aegis-dashboard`. Services stay as-is (Fastify microservices). The UI gets new pages/tabs in the sidebar. The canvas remains the main view but the sidebar expands to cover all workspace surfaces.

**Tech Stack:** React 19, TypeScript, Tailwind CSS 4, Zustand 5, TanStack Query 5, Lucide React, @vscp/ui, wterm (embedded terminal), existing Fastify services on ports 3001-3015.

---

## What Exists Today

### Already Built (apps/web)
- `Canvas` — infinite canvas with zones, cards (BMC, Revenue, Gate, Spec), grid, minimap, multiplayer cursors, toolbar
- `VenturePage` — idea → questions → rearticulation → plan → canvas creation (client-side demo)
- `BrainPage` — demo knowledge graph + search (static data)
- `CRMPage` — demo pipeline board + contacts list (static data)
- `PlannerPage` — demo plan viewer with sections, role-based access, approve/reject
- `QualityPage` — (exists, not examined in detail)
- `AgentsPage` — demo agent table + message feed (static data)
- `LoginPage` / `SignupPage` — real JWT auth via authStore

### Already Built (services — Fastify, all have routes + stores)
- `paperclip-api` (:3001) — companies, agents, goals, tickets, budgets, heartbeats, board, dashboard
- `denchclaw` (:3015) — contacts, deals, sequences, leads, pipeline
- `hcom-api` — agents, messages, collision detection
- `gbrain` — knowledge pages, graph, search
- `aegis` — audits, findings, domains
- `bmad` — analysis, planning
- `paul` — plan generation
- `plannotator` — plan review
- `gstack` — build skills
- `skills` — skill marketplace

### Separate Apps to Absorb (currently thin placeholders)
- `apps/paperclip-ui` — OrgChart, AgentCard, TicketBoard, BudgetTracker, BoardActions + Atmosphere
- `apps/hcom-dashboard` — AgentList, MessageFeed, TerminalPreview, CollisionAlert + Atmosphere
- `apps/denchclaw-ui` — Atmosphere only (empty shell)
- `apps/gbrain-dashboard` — Atmosphere only (empty shell)
- `apps/plannotator-ui` — PlanViewer, AnnotationThread, DiffViewer, SectionToggle + Atmosphere
- `apps/aegis-dashboard` — Atmosphere only (empty shell)

### Shared UI Package (@vscp/ui)
- Button, Card, Avatar, Badge, ProgressBar

---

## New Sidebar Navigation Structure

```
Office (home/dashboard)    — overview of everything
Canvas                     — existing infinite canvas
Swarm                      — kanban board + worker agent cards
Conductor                  — mission dispatch + active missions
Orchestrator               — org chart, agent hiring, heartbeat, budgets
Brain                      — knowledge graph + search (enhanced)
CRM                        — pipeline + contacts + outreach (enhanced)
Planner                    — plan review + annotations (enhanced)
Chat                       — agent-to-agent + agent-to-human messaging
Files                      — file browser (Monaco editor)
Tasks                      — kanban task board for the company
Terminal                   — embedded wterm
Sessions                   — active/completed sessions
Cron Jobs                  — scheduled agent tasks
Settings                   — config, MCP, skills
```

---

## PHASE 1: Sidebar Restructure & Office Page

### Task 1.1: Restructure Sidebar Navigation

**Objective:** Replace the existing 6-item sidebar with the full 15-item navigation grouped into logical sections.

**File:** `apps/web/src/App.tsx`

Replace the `navItems` array in the `Sidebar` component:

```tsx
const navGroups = [
  {
    label: 'Workspace',
    items: [
      { path: '/', icon: Layout, label: 'Office', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/canvas', icon: Layers, label: 'Canvas', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/swarm', icon: Bug, label: 'Swarm', roles: ['admin', 'technical_founder'] },
      { path: '/conductor', icon: Radio, label: 'Conductor', roles: ['admin', 'technical_founder'] },
      { path: '/orchestrator', icon: Network, label: 'Orchestrator', roles: ['admin', 'technical_founder'] },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { path: '/brain', icon: Brain, label: 'Brain', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/crm', icon: Users, label: 'CRM', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/planner', icon: FileText, label: 'Planner', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/quality', icon: Shield, label: 'Quality', roles: ['admin', 'technical_founder'] },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/chat', icon: MessageSquare, label: 'Chat', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/files', icon: FolderOpen, label: 'Files', roles: ['admin', 'technical_founder'] },
      { path: '/tasks', icon: CheckSquare, label: 'Tasks', roles: ['admin', 'technical_founder', 'domain_expert'] },
      { path: '/terminal', icon: Terminal, label: 'Terminal', roles: ['admin'] },
      { path: '/sessions', icon: Monitor, label: 'Sessions', roles: ['admin', 'technical_founder'] },
      { path: '/cron', icon: Clock, label: 'Cron Jobs', roles: ['admin'] },
      { path: '/settings', icon: Settings, label: 'Settings', roles: ['admin'] },
    ],
  },
];
```

Render nav groups with section headers:

```tsx
{navGroups.map((group) => (
  <div key={group.label} className="mb-2">
    {!collapsed && (
      <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-fg-muted uppercase tracking-wider">
        {group.label}
      </p>
    )}
    {group.items.filter((item) => item.roles.includes(user?.role || '')).map((item) => {
      const Icon = item.icon;
      const isActive = location.pathname === item.path;
      return (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            isActive ? 'bg-elevated/70 text-fg' : 'text-fg-muted hover:bg-hover/60 hover:text-fg'
          } ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? item.label : undefined}
        >
          <Icon size={15} />
          {!collapsed && item.label}
        </button>
      );
    })}
  </div>
))}
```

New imports needed at top of `App.tsx`:
```tsx
import {
  Layout, Brain, Users, FileText, Shield, Terminal, Lightbulb,
  LogOut, ChevronLeft, ChevronRight, Plus, Layers, Bug, Radio,
  Network, MessageSquare, FolderOpen, CheckSquare, Monitor,
  Clock, Settings
} from 'lucide-react';
```

Add routes for all new pages in the `<Routes>` block:
```tsx
<Route path="/canvas" element={<AuthGuard><AppLayout><Canvas /></AppLayout></AuthGuard>} />
<Route path="/swarm" element={<AuthGuard roles={['admin','technical_founder']}><AppLayout><SwarmPage /></AppLayout></AuthGuard>} />
<Route path="/conductor" element={<AuthGuard roles={['admin','technical_founder']}><AppLayout><ConductorPage /></AppLayout></AuthGuard>} />
<Route path="/orchestrator" element={<AuthGuard roles={['admin','technical_founder']}><AppLayout><OrchestratorPage /></AppLayout></AuthGuard>} />
<Route path="/chat" element={<AuthGuard><AppLayout><ChatPage /></AppLayout></AuthGuard>} />
<Route path="/files" element={<AuthGuard roles={['admin','technical_founder']}><AppLayout><FilesPage /></AppLayout></AuthGuard>} />
<Route path="/tasks" element={<AuthGuard><AppLayout><TasksPage /></AppLayout></AuthGuard>} />
<Route path="/terminal" element={<AuthGuard roles={['admin']}><AppLayout><TerminalPage /></AppLayout></AuthGuard>} />
<Route path="/sessions" element={<AuthGuard roles={['admin','technical_founder']}><AppLayout><SessionsPage /></AppLayout></AuthGuard>} />
<Route path="/cron" element={<AuthGuard roles={['admin']}><AppLayout><CronPage /></AppLayout></AuthGuard>} />
<Route path="/settings" element={<AuthGuard roles={['admin']}><AppLayout><SettingsPage /></AppLayout></AuthGuard>} />
```

Change the default `/` route to `<OfficePage />` and move `<Canvas />` to `/canvas`.

---

### Task 1.2: Create Office Page (Dashboard)

**Objective:** Build the "Office" landing page — the home dashboard showing an overview of all active work.

**File:** Create `apps/web/src/pages/OfficePage.tsx`

The Office page shows a grid of cards summarizing:
- Active agents (count + status dots from paperclip-api)
- Open tickets (count + urgency from paperclip-api)
- Active missions (from conductor)
- Recent brain captures (from gbrain)
- CRM pipeline summary (total deal value by stage)
- Upcoming cron jobs
- System health (service statuses)

Each card links to its full page. Uses `@vscp/ui` Card, Badge, ProgressBar components.

Pattern: uses TanStack Query to fetch from service endpoints, falls back to demo data when services are unreachable (capability gates — graceful placeholders).

```tsx
import { useQuery } from '@tanstack/react-query';
import { Card, Badge, ProgressBar } from '@vscp/ui';
import { Users, Ticket, Radio, Brain, DollarSign, Clock, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// API base URLs from env or defaults
const PAPERCLIP_URL = import.meta.env.VITE_PAPERCLIP_URL || 'http://localhost:3001';
const DENCHCLAW_URL = import.meta.env.VITE_DENCHCLAW_URL || 'http://localhost:3015';
const GBRAIN_URL = import.meta.env.VITE_GBRAIN_URL || 'http://localhost:3005';

async function fetchServiceHealth(url: string, name: string) {
  try {
    const res = await fetch(`${url}/health`);
    return res.ok ? { name, status: 'up' } : { name, status: 'down' };
  } catch {
    return { name, status: 'unreachable' };
  }
}

export function OfficePage() {
  const navigate = useNavigate();
  // ... query agents, tickets, deals, brain pages, health
  // Render grid of summary cards
}
```

Style: same glassmorphic panels (`bg-surface/70 backdrop-blur-md rounded-md border border-border`), same color tokens, same typography as existing pages.

---

### Task 1.3: Update Canvas Route

**Objective:** Move the canvas from `/` to `/canvas` and update all internal links.

**File:** `apps/web/src/App.tsx`
- Change `<Route path="/" element={...Canvas...}>` to `<Route path="/canvas" element={...}>`
- Add `<Route path="/" element={...OfficePage...}>`
- Update the sidebar `path: '/'` for Canvas to `path: '/canvas'`
- Update VenturePage's `navigate('/')` calls to `navigate('/canvas')`

---

## PHASE 2: Swarm Page (Kanban + Worker Agents)

### Task 2.1: Create Swarm Page with Kanban Board

**Objective:** Build the Swarm page showing a kanban board of tasks and worker agent cards with role-based dispatch.

**File:** Create `apps/web/src/pages/SwarmPage.tsx`

Layout:
- Top bar: "Swarm" title + agent count badge + "Dispatch Task" button
- Left section (60%): Kanban board with columns: Backlog → In Progress → Review → Done
- Right section (40%): Worker agent cards showing avatar, role, status, current task, CPU/token usage

Each kanban card shows: task title, assigned agent, priority badge, time in column.
Each agent card shows: name, adapter type, status dot, active task, budget progress bar.

Uses TanStack Query to fetch from `paperclip-api` agents + tasks endpoints.
Falls back to demo data when unreachable.

**Components to create:**
- `apps/web/src/components/swarm/KanbanBoard.tsx` — column layout with drag state
- `apps/web/src/components/swarm/KanbanColumn.tsx` — single column with header + count
- `apps/web/src/components/swarm/KanbanCard.tsx` — individual task card
- `apps/web/src/components/swarm/WorkerCard.tsx` — agent status card

All styled with the Aigency design system tokens: `bg-surface/70`, `border-border`, `text-fg-muted`, `bg-primary-muted`, etc.

---

### Task 2.2: Wire Kanban to paperclip-api Tasks

**Objective:** Connect the kanban board to real task data from paperclip-api.

**File:** `apps/web/src/api/paperclip.ts` (create)

```tsx
const BASE = import.meta.env.VITE_PAPERCLIP_URL || 'http://localhost:3001';

export const paperclipApi = {
  getAgents: (companyId: string) => fetch(`${BASE}/companies/${companyId}/agents`).then(r => r.json()),
  getTasks: (companyId: string) => fetch(`${BASE}/companies/${companyId}/tasks`).then(r => r.json()),
  updateTaskStatus: (taskId: string, status: string) =>
    fetch(`${BASE}/tasks/${taskId}/status`, { method: 'PATCH', body: JSON.stringify({ status }), headers: { 'Content-Type': 'application/json' } }),
  getTickets: (companyId: string) => fetch(`${BASE}/companies/${companyId}/tickets`).then(r => r.json()),
  getDashboard: (companyId: string) => fetch(`${BASE}/companies/${companyId}/dashboard`).then(r => r.json()),
};
```

Similar files for other services: `apps/web/src/api/denchclaw.ts`, `apps/web/src/api/hcom.ts`, `apps/web/src/api/gbrain.ts`.

---

## PHASE 3: Conductor Page (Mission Dispatch)

### Task 3.1: Create Conductor Page

**Objective:** Build the Conductor page for mission dispatch and monitoring — the command center for launching and tracking agent missions.

**File:** Create `apps/web/src/pages/ConductorPage.tsx`

Layout:
- "Conductor" title + "New Mission" button
- Active Missions section: cards showing mission name, assigned agents, progress, status
- Mission History: completed/failed missions with timestamps
- "New Mission" dialog: text area for mission description, agent selection, priority

Each mission card shows: mission title, assigned agents (avatars), progress bar, status badge (running/complete/failed), elapsed time, cost.

Connects to paperclip-api goals + tasks endpoints, or hcom-api for direct agent dispatch.

**Components:**
- `apps/web/src/components/conductor/MissionCard.tsx`
- `apps/web/src/components/conductor/MissionDialog.tsx`
- `apps/web/src/components/conductor/MissionTimeline.tsx`

---

## PHASE 4: Orchestrator Page (Org Chart + Agent Management)

### Task 4.1: Create Orchestrator Page

**Objective:** Build the full Orchestrator page combining org chart, agent hiring, heartbeat config, and budget tracking from Paperclip.

**File:** Create `apps/web/src/pages/OrchestratorPage.tsx`

Tabs within the page:
1. **Org Chart** — hierarchical tree of agents with reporting lines (from `apps/paperclip-ui/src/components/OrgChart.tsx`)
2. **Agent List** — table of all agents with status, budget, adapter, heartbeat schedule
3. **Budgets** — per-agent budget bars with soft/hard limits, total spend
4. **Hire Agent** — form: name, role, adapter (hermes/claude/codex/kimi/qwen...), budget limit, reporting to, heartbeat schedule

### Task 4.2: Migrate OrgChart Component

**Objective:** Move the existing OrgChart from `paperclip-ui` into `apps/web` and connect to real API.

**Source:** `apps/paperclip-ui/src/components/OrgChart.tsx`
**Target:** `apps/web/src/components/orchestrator/OrgChart.tsx`

Also migrate: AgentCard, TicketBoard, BudgetTracker, BoardActions into `apps/web/src/components/orchestrator/`.

All components must be restyled to match the Aigency design system if they don't already.

---

## PHASE 5: Enhanced Brain Page

### Task 5.1: Connect Brain to gbrain Service

**Objective:** Replace the static demo data in BrainPage with real data from the gbrain service.

**File:** `apps/web/src/pages/BrainPage.tsx`

Changes:
- Replace `DEMO_PAGES` with TanStack Query fetch from gbrain API
- Replace `DEMO_GRAPH_NODES` / `DEMO_EDGES` with real graph data from gbrain
- Add "Capture" button for manual knowledge entry
- Add source filter (paperclip, hcom, aegis, plannotator, bmad)
- Keep role-based scoping (domain expert sees business only)

---

### Task 5.2: Enhance Knowledge Graph Visualization

**Objective:** Replace the SVG graph with a proper interactive graph using a lightweight library.

Add dependency: `@react-sigma/core` or use plain SVG with d3-force for layout.

**File:** `apps/web/src/components/brain/KnowledgeGraph.tsx` (create)

Interactive: click node to view page, hover to show connections, zoom/pan.

---

## PHASE 6: Enhanced CRM Page

### Task 6.1: Connect CRM to denchclaw Service

**Objective:** Replace demo data in CRMPage with real data from denchclaw service, add full CRUD.

**File:** `apps/web/src/pages/CRMPage.tsx`

Changes:
- Replace `DEMO_CONTACTS` and `DEMO_DEALS` with TanStack Query from denchclaw API
- Add contact creation/edit modal
- Add deal creation/edit modal
- Add drag-and-drop between pipeline stages (real API calls)
- Add contact detail view with activity timeline
- Add deal detail view with notes

### Task 6.2: Add Outreach Automation Panel

**Objective:** Add outreach tab showing automated sequences (email, LinkedIn) and their status.

**File:** Create `apps/web/src/components/crm/OutreachPanel.tsx`

Shows: active sequences, open/reply rates, next scheduled outreach.
Connects to denchclaw sequences endpoint.

### Task 6.3: Agent-Managed CRM Indicator

**Objective:** Show which AI agent is managing each CRM contact/deal, with agent activity feed.

Add a small badge on each deal card showing the assigned agent (e.g., "Managed by: sales-agent").
Add an "Agent Activity" tab in the CRM page showing recent autonomous actions taken by agents on CRM data.

---

## PHASE 7: Enhanced Planner Page (Plannotator Integration)

### Task 7.1: Connect Planner to plannotator Service

**Objective:** Replace demo data with real plan data from plannotator service.

**File:** `apps/web/src/pages/PlannerPage.tsx`

Changes:
- Fetch plans from plannotator API
- Wire approve/reject buttons to real API calls
- Add annotation creation (from `plannotator-ui/src/components/AnnotationThread.tsx`)
- Add diff view (from `plannotator-ui/src/components/DiffViewer.tsx`)

### Task 7.2: Migrate Plannotator Components

**Objective:** Move AnnotationThread, DiffViewer, SectionToggle into apps/web.

**Source files:**
- `apps/plannotator-ui/src/components/AnnotationThread.tsx`
- `apps/plannotator-ui/src/components/DiffViewer.tsx`
- `apps/plannotator-ui/src/components/SectionToggle.tsx`

**Target:** `apps/web/src/components/planner/`

---

## PHASE 8: Chat Page (Agent Communication)

### Task 8.1: Create Chat Page

**Objective:** Build a real-time chat interface for agent-to-agent and human-to-agent communication.

**File:** Create `apps/web/src/pages/ChatPage.tsx`

Layout:
- Left: conversation list (agent DMs, group channels)
- Center: message thread with sender avatars, timestamps, markdown rendering
- Right: context panel (active task, linked brain pages)

Messages fetched from hcom-api. Supports: @mentions, intent badges (task/status/request), context bundles.

**Components:**
- `apps/web/src/components/chat/ConversationList.tsx`
- `apps/web/src/components/chat/MessageThread.tsx`
- `apps/web/src/components/chat/MessageInput.tsx`
- `apps/web/src/components/chat/ContextPanel.tsx`

---

## PHASE 9: Operations Pages

### Task 9.1: Tasks Page (Kanban)

**Objective:** Build a company-wide task kanban board (separate from Swarm's agent-focused kanban).

**File:** Create `apps/web/src/pages/TasksPage.tsx`

Columns: Backlog, Todo, In Progress, Review, Done.
Each card: title, assignee (agent or human), goal ancestry chain, priority, created date.
Drag to reorder/change status. Connected to paperclip-api tasks.

### Task 9.2: Terminal Page (wterm)

**Objective:** Embed wterm terminal in the app.

**File:** Create `apps/web/src/pages/TerminalPage.tsx`

```tsx
// Embed wterm via iframe or web component
export function TerminalPage() {
  return (
    <div className="h-full w-full">
      <iframe
        src={import.meta.env.VITE_WTERM_URL || 'http://localhost:3000/terminal'}
        className="w-full h-full border-0"
        title="Terminal"
      />
    </div>
  );
}
```

If wterm is not yet available, show a placeholder with a "Connect Terminal" action that opens a PTY session via the gateway API.

### Task 9.3: Sessions Page

**Objective:** Show active and completed agent sessions with history.

**File:** Create `apps/web/src/pages/SessionsPage.tsx`

List of sessions: agent name, start time, duration, task, status, token usage.
Click to view session transcript. Connected to hcom-api or paperclip-api.

### Task 9.4: Cron Jobs Page

**Objective:** Show and manage scheduled agent tasks (heartbeats, routines).

**File:** Create `apps/web/src/pages/CronPage.tsx`

Table: job name, schedule (cron expression), last run, next run, status, agent.
Actions: pause, resume, run now, edit, delete.
Connected to paperclip-api heartbeat endpoints.

### Task 9.5: Settings Page

**Objective:** App-wide settings for MCP servers, skills, themes, API keys.

**File:** Create `apps/web/src/pages/SettingsPage.tsx`

Tabs: General (theme, language), MCP (server list + CRUD), Skills (installed + marketplace), API Keys (masked), Services (health check grid).

---

## PHASE 10: Venture Launch → Autonomous Company

### Task 10.1: Enhance VenturePage with CEO Hiring Flow

**Objective:** After plan approval, the CEO agent iteratively "hires" workers to execute the plan.

**File:** `apps/web/src/pages/VenturePage.tsx`

After the existing "Approve & Create Venture" step, add a new phase:

```
Step 5 (existing): Approved → creates zone + cards on canvas
Step 6 (NEW): "CEO Hiring" → shows CEO agent analyzing the plan
Step 7 (NEW): "Team Assembly" → shows agents being hired one by one
Step 8 (NEW): "Execution Started" → shows agents working, links to Swarm/Conductor
```

In Step 6, call `paperclip-api` to:
1. Create a company from the venture plan
2. Create a CEO agent
3. CEO agent analyzes plan and determines which roles to hire

In Step 7, show a hiring animation where agents appear one by one:
- CTO agent (technical implementation)
- CMO agent (marketing/market research)
- Sales agent (CRM/outreach)
- Engineer agents (actual building)

Each "hire" calls `POST /companies/:id/agents` on paperclip-api.

In Step 8, show a summary with links to Swarm, Conductor, and Orchestrator pages.

---

### Task 10.2: Autonomous CRM Agent Integration

**Objective:** When a venture is launched, if the venture has CRM needs, auto-assign a Sales agent to manage the CRM.

**File:** Modify `apps/web/src/pages/VenturePage.tsx` (Step 7)

When the CEO hires the Sales agent:
1. Call denchclaw to create initial pipeline stages if none exist
2. Assign the Sales agent to the CRM
3. Show "CRM Agent Active" badge in the CRM page
4. The Sales agent's heartbeat includes CRM tasks: enrich leads, run sequences, update deals

---

### Task 10.3: Agent-Managed CRM Automation

**Objective:** Show autonomous CRM activity in the CRM page — agents enriching leads, sending outreach, updating deal stages.

**File:** `apps/web/src/pages/CRMPage.tsx`

Add an "Agent Activity" tab showing a feed of autonomous actions:
- "sales-agent enriched lead: Sarah Chen — added LinkedIn profile"
- "sales-agent sent cold email to marcus@enterprise.com"
- "sales-agent moved deal 'Enterprise Corp' from Qualified → Proposal"

Each entry shows: agent avatar, action, timestamp, result.

---

## PHASE 11: Quality Page Enhancement

### Task 11.1: Connect Quality Page to aegis Service

**Objective:** Wire the existing QualityPage to real AEGIS audit data.

**File:** `apps/web/src/pages/QualityPage.tsx`

Connect to aegis service for:
- 14-domain audit results
- Risk heatmap
- Finding details with severity and confidence
- Devil's Advocate persona findings

---

## PHASE 12: API Client Layer

### Task 12.1: Create Unified API Client

**Objective:** Build a typed API client for all services with error handling, health checks, and fallbacks.

**File:** Create `apps/web/src/api/client.ts`

```tsx
class ServiceClient {
  constructor(private baseUrl: string, private name: string) {}

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`);
    if (!res.ok) throw new Error(`${this.name}: ${res.status}`);
    return res.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`${this.name}: ${res.status}`);
    return res.json();
  }

  async health(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }
}

export const paperclip = new ServiceClient(
  import.meta.env.VITE_PAPERCLIP_URL || 'http://localhost:3001', 'paperclip'
);
export const denchclaw = new ServiceClient(
  import.meta.env.VITE_DENCHCLAW_URL || 'http://localhost:3015', 'denchclaw'
);
export const gbrain = new ServiceClient(
  import.meta.env.VITE_GBRAIN_URL || 'http://localhost:3005', 'gbrain'
);
export const hcom = new ServiceClient(
  import.meta.env.VITE_HCOM_URL || 'http://localhost:3006', 'hcom'
);
export const aegis = new ServiceClient(
  import.meta.env.VITE_AEGIS_URL || 'http://localhost:3007', 'aegis'
);
export const plannotator = new ServiceClient(
  import.meta.env.VITE_PLANNOTATOR_URL || 'http://localhost:3008', 'plannotator'
);
```

### Task 12.2: Add TanStack Query Provider

**Objective:** Add QueryClientProvider to the app root if not already present.

**File:** `apps/web/src/main.tsx`

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});
// Wrap <App /> in <QueryClientProvider client={queryClient}>
```

---

## PHASE 13: Cleanup & Consolidation

### Task 13.1: Remove Separate App Packages

**Objective:** After all functionality is migrated, remove the now-empty separate app packages.

**Directories to remove (after migration is complete):**
- `apps/paperclip-ui/`
- `apps/denchclaw-ui/`
- `apps/hcom-dashboard/`
- `apps/gbrain-dashboard/`
- `apps/plannotator-ui/`
- `apps/aegis-dashboard/`
- `apps/embed-shell/`

Update `pnpm-workspace.yaml` and root `package.json` if needed.

### Task 13.2: Update Turbo Config

**Objective:** Remove references to deleted apps from turbo.json pipelines.

---

## PHASE 14: SMS/Text CRM (Backlog)

### Task 14.1: Research Free SMS Options for CRM

**Objective:** Find a way to send/receive SMS for CRM contacts at zero cost.

**Options to research:**
- Twilio free tier (limited)
- TextBelt (free tier: 1/day)
- Email-to-SMS gateways (carrier-specific: number@tmomail.net, number@vtext.com)
- Google Voice API (unofficial)
- Self-hosted: Gammu + USB modem

**Decision:** If no free option is viable, create a backlog item and implement after launch.

---

## Implementation Order

| Phase | Description | Est. Effort | Dependencies |
|-------|------------|-------------|--------------|
| 1 | Sidebar + Office Page | 1 day | None |
| 12 | API Client + TanStack Query | 0.5 day | None |
| 2 | Swarm Page | 1 day | Phase 1, 12 |
| 3 | Conductor Page | 0.5 day | Phase 1, 12 |
| 4 | Orchestrator Page | 1 day | Phase 1, 12 |
| 5 | Enhanced Brain | 0.5 day | Phase 12 |
| 6 | Enhanced CRM | 1 day | Phase 12 |
| 7 | Enhanced Planner | 0.5 day | Phase 12 |
| 8 | Chat Page | 1 day | Phase 1, 12 |
| 9 | Operations Pages | 1.5 days | Phase 1, 12 |
| 10 | Venture Launch + Autonomous CRM | 1.5 days | Phase 2-4, 6 |
| 11 | Quality Enhancement | 0.5 day | Phase 12 |
| 13 | Cleanup | 0.5 day | All above |
| 14 | SMS CRM Research | Research only | None |

**Total estimated: ~11 days of focused implementation**

---

## Design System Consistency Rules

Every new component must use these tokens:

```
Backgrounds:  bg-surface/70, bg-elevated/70, bg-hover/40, bg-primary-muted
Borders:      border-border, border-border-hover, border-primary/30
Text:         text-fg, text-fg-muted, text-fg-secondary, text-fg-inverse
Accents:      text-primary, text-accent, text-success, text-warning, text-error
Glassmorphic: backdrop-blur-md + bg-surface/70 + shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]
Typography:   font-display for headings, font-body for text, font-mono for code/numbers
Spacing:      p-4/p-6 for panels, p-2/p-3 for cards, gap-2/gap-3 for layout
Radius:       rounded-md for panels, rounded-sm for inline elements
Transitions:  transition-colors, transition-all duration-200
```

Reusable component pattern:
```tsx
<div className="bg-surface/70 backdrop-blur-md rounded-md border border-border">
  <div className="px-4 py-3 border-b border-border bg-elevated/60">
    <h2 className="font-semibold text-sm">Title</h2>
  </div>
  <div className="p-4">
    {/* content */}
  </div>
</div>
```
