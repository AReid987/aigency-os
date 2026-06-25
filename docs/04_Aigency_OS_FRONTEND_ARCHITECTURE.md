# FRONTEND ARCHITECTURE DOCUMENT

**Project:** Venture Spec Collaboration Platform  
**Version:** 1.0  
**Date:** 2026-06-24  
**Template:** BMAD Method — Frontend Architecture  
**Status:** Draft — Ready for Implementation  

---

## 1. Frontend Architecture Overview

### 1.1 Architecture Pattern
**Micro-frontend Shell with Shared Canvas Runtime**

The frontend is composed of a central canvas runtime (Agor) that hosts embedded micro-frontends for each service layer. This allows:
- Independent deployment of each service UI
- Shared state and communication via the canvas runtime
- Role-based visibility (Domain Expert sees simplified views)
- Agent-embeddable artifacts (dashboards, calculators, previews)

### 1.2 Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Framework | React 19 | ^19.0 | UI components, state management |
| Language | TypeScript | ^5.5 | Type safety, IntelliSense |
| Bundler | Vite | ^6.0 | Fast dev, optimized builds |
| Styling | Tailwind CSS | ^4.0 | Utility-first CSS |
| State | Zustand | ^5.0 | Lightweight global state |
| Queries | TanStack Query | ^5.0 | Server state, caching |
| WebSocket | Socket.io-client | ^4.0 | Real-time canvas sync |
| Canvas | Fabric.js / PixiJS | ^6.0 | Infinite canvas rendering |
| Charts | Recharts | ^2.0 | Data visualization |
| Markdown | MDX | ^3.0 | Rich text, embeds |
| Icons | Lucide React | ^0.400 | Consistent iconography |
| Testing | Vitest + Playwright | ^2.0 / ^1.0 | Unit + E2E testing |

---

## 2. Application Structure

```
apps/
├── web/                          # Main web application (Agor shell)
│   ├── src/
│   │   ├── main.tsx              # Entry point
│   │   ├── App.tsx               # Root component with router
│   │   ├── providers/            # Context providers (WebSocket, State, Theme)
│   │   ├── layout/               # Shell layout (header, sidebar, canvas)
│   │   ├── canvas/               # Infinite canvas engine
│   │   │   ├── Canvas.tsx        # Main canvas component
│   │   │   ├── Zone.tsx          # Zone container (Business, Engineering)
│   │   │   ├── Card.tsx          # Draggable card component
│   │   │   ├── Grid.tsx          # Background grid
│   │   │   ├── Minimap.tsx       # Canvas minimap
│   │   │   ├── Toolbar.tsx       # Floating action toolbar
│   │   │   └── hooks/            # usePan, useZoom, useDrag, useSelection
│   │   ├── zones/                # Zone-specific UIs
│   │   │   ├── business/         # Business Zone components
│   │   │   │   ├── BMCCard.tsx   # Business Model Canvas card
│   │   │   │   ├── RevenueCalculator.tsx
│   │   │   │   ├── CompetitorMap.tsx
│   │   │   │   └── MilestoneTracker.tsx
│   │   │   └── engineering/      # Engineering Zone components
│   │   │       ├── ArchitectureDiagram.tsx
│   │   │       ├── APISchemaViewer.tsx
│   │   │       ├── LivePreview.tsx
│   │   │       └── AgentStatusDashboard.tsx
│   │   ├── embeds/               # Micro-frontend embeds
│   │   │   ├── PaperclipEmbed.tsx    # Org chart, tickets, budgets
│   │   │   ├── PlannotatorEmbed.tsx  # Plan review, annotation
│   │   │   ├── HCOMDashboard.tsx     # Agent monitor TUI
│   │   │   ├── AEGISReport.tsx       # Audit heatmap, findings
│   │   │   ├── GbrainDashboard.tsx   # Knowledge graph, query
│   │   │   └── DenchClawEmbed.tsx    # CRM pipeline
│   │   ├── components/           # Shared UI components
│   │   │   ├── atoms/            # Buttons, inputs, avatars, badges
│   │   │   ├── molecules/        # AgentCard, TicketCard, ZoneHeader
│   │   │   └── organisms/        # Canvas, OrgChart, TicketBoard
│   │   ├── hooks/                # Shared React hooks
│   │   │   ├── useWebSocket.ts
│   │   │   ├── useCanvas.ts
│   │   │   ├── useAgentStatus.ts
│   │   │   ├── usePermissions.ts
│   │   │   └── useBrainQuery.ts
│   │   ├── stores/               # Zustand stores
│   │   │   ├── canvasStore.ts    # Canvas state (zoom, pan, selection)
│   │   │   ├── userStore.ts      # User role, permissions
│   │   │   ├── agentStore.ts     # Agent statuses, messages
│   │   │   └── brainStore.ts     # Knowledge query results
│   │   ├── types/                # TypeScript types
│   │   │   ├── canvas.ts         # Card, Zone, Position types
│   │   │   ├── agent.ts          # Agent, Task, Ticket types
│   │   │   ├── user.ts           # User, Role, Permission types
│   │   │   └── brain.ts          # KnowledgePage, Query types
│   │   ├── utils/                # Utility functions
│   │   │   ├── canvasMath.ts     # Zoom, pan, snap calculations
│   │   │   ├── permissions.ts    # RBAC logic
│   │   │   └── formatters.ts   # Currency, date, status formatters
│   │   └── styles/               # Global styles, Tailwind config
│   ├── public/                   # Static assets
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── paperclip-ui/                 # Paperclip dashboard (separate deploy)
│   ├── src/
│   │   ├── components/
│   │   │   ├── OrgChart.tsx
│   │   │   ├── AgentCard.tsx
│   │   │   ├── TicketBoard.tsx
│   │   │   ├── BudgetTracker.tsx
│   │   │   └── BoardActions.tsx
│   │   ├── pages/
│   │   │   ├── CompanyDashboard.tsx
│   │   │   ├── AgentDetail.tsx
│   │   │   └── TicketDetail.tsx
│   │   └── api/
│   │       └── paperclipApi.ts
│   └── vite.config.ts
│
├── plannotator-ui/               # Plannotator review UI (separate deploy)
│   ├── src/
│   │   ├── components/
│   │   │   ├── PlanViewer.tsx
│   │   │   ├── AnnotationThread.tsx
│   │   │   ├── SectionToggle.tsx
│   │   │   └── DiffViewer.tsx
│   │   └── api/
│   │       └── plannotatorApi.ts
│   └── vite.config.ts
│
├── hcom-dashboard/               # HCOM TUI (separate deploy)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentList.tsx
│   │   │   ├── MessageFeed.tsx
│   │   │   ├── TerminalPreview.tsx
│   │   │   └── CollisionAlert.tsx
│   │   └── api/
│   │       └── hcomApi.ts
│   └── vite.config.ts
│
└── gbrain-dashboard/             # Gbrain visual UI (separate deploy)
    ├── src/
    │   ├── components/
    │   │   ├── KnowledgeGraph.tsx
    │   │   ├── QueryInterface.tsx
    │   │   ├── RecentCaptures.tsx
    │   │   └── ConfidenceBadge.tsx
    │   └── api/
    │       └── gbrainApi.ts
    └── vite.config.ts
```

---

## 3. State Management Architecture

### 3.1 Zustand Store Design

```typescript
// stores/canvasStore.ts
interface CanvasState {
  // Viewport
  zoom: number;
  pan: { x: number; y: number };

  // Selection
  selectedCards: string[];
  selectionBox: { start: Position; end: Position } | null;

  // Zones
  zones: Zone[];
  activeZone: string | null;

  // Cards
  cards: Card[];
  cardHistory: Card[][]; // For undo/redo

  // Actions
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  selectCard: (id: string, multi?: boolean) => void;
  moveCard: (id: string, position: Position) => void;
  createCard: (type: CardType, position: Position) => void;
  deleteCard: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

// stores/userStore.ts
interface UserState {
  user: User | null;
  role: 'domain_expert' | 'technical_founder' | 'agent';
  permissions: Permission[];

  // Zone visibility
  visibleZones: ZoneType[];
  collapsedSections: string[];

  // Preferences
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;

  actions: {
    setUser: (user: User) => void;
    setRole: (role: UserRole) => void;
    toggleZoneVisibility: (zone: ZoneType) => void;
    toggleSection: (section: string) => void;
  };
}

// stores/agentStore.ts
interface AgentState {
  agents: Agent[];
  messages: Message[];
  collisions: Collision[];

  actions: {
    addAgent: (agent: Agent) => void;
    updateAgentStatus: (id: string, status: AgentStatus) => void;
    addMessage: (message: Message) => void;
    addCollision: (collision: Collision) => void;
    resolveCollision: (id: string) => void;
  };
}

// stores/brainStore.ts
interface BrainState {
  query: string;
  results: KnowledgePage[];
  graphData: GraphData | null;
  recentCaptures: KnowledgePage[];
  isLoading: boolean;

  actions: {
    setQuery: (query: string) => void;
    search: () => Promise<void>;
    setGraphData: (data: GraphData) => void;
  };
}
```

### 3.2 State Flow

```
User Action → Zustand Store → WebSocket Emit → Server → Broadcast → Other Clients
                                                    ↓
                                             TanStack Query Cache → UI Update
```

### 3.3 Caching Strategy

| Data Type | Cache | TTL | Invalidation |
|-----------|-------|-----|--------------|
| Canvas cards | Zustand + WebSocket | Real-time | WebSocket event |
| Agent status | Zustand + HCOM | 30s | HCOM event |
| Brain query | TanStack Query | 5min | Manual refetch |
| User profile | TanStack Query | 1h | Login/logout |
| Plan content | TanStack Query | 10min | Plan version change |
| Org chart | TanStack Query | 1min | Heartbeat event |

---

## 4. Component Architecture

### 4.1 Canvas Engine (Fabric.js / PixiJS)

**Responsibility:** Render infinite canvas with zones, cards, and agent presence.

**Key Components:**

```typescript
// Canvas.tsx — Main canvas component
function Canvas() {
  const { zoom, pan, zones, cards } = useCanvasStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas>(null);

  useEffect(() => {
    fabricRef.current = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Initialize zones
    zones.forEach(zone => renderZone(fabricRef.current, zone));

    // Initialize cards
    cards.forEach(card => renderCard(fabricRef.current, card));

    return () => fabricRef.current?.dispose();
  }, []);

  return (
    <canvas ref={canvasRef} className="canvas-infinite" />
  );
}

// Zone.tsx — Zone container with RBAC
function Zone({ zone }: { zone: Zone }) {
  const { role } = useUserStore();
  const canEdit = role === 'technical_founder' || 
                  (role === 'domain_expert' && zone.type === 'business');

  return (
    <div 
      className={`zone zone-${zone.type}`}
      style={{
        backgroundColor: zone.type === 'business' ? '#fef3c7' : '#dbeafe',
        pointerEvents: canEdit ? 'auto' : 'none',
      }}
    >
      <ZoneHeader zone={zone} />
      {zone.cards.map(card => (
        <Card key={card.id} card={card} readonly={!canEdit} />
      ))}
    </div>
  );
}

// Card.tsx — Draggable card with type-specific rendering
function Card({ card, readonly }: { card: Card; readonly?: boolean }) {
  const { moveCard, selectCard } = useCanvasStore();

  const renderContent = () => {
    switch (card.type) {
      case 'text': return <TextCard content={card.content} />;
      case 'image': return <ImageCard src={card.content.src} />;
      case 'calculator': return <RevenueCalculator data={card.content} />;
      case 'preview': return <LivePreview url={card.content.url} />;
      case 'embed': return <EmbedCard src={card.content.src} />;
      default: return <TextCard content={card.content} />;
    }
  };

  return (
    <Draggable 
      position={card.position}
      onDragEnd={(pos) => moveCard(card.id, pos)}
      disabled={readonly}
    >
      <div className="card" onClick={() => selectCard(card.id)}>
        {renderContent()}
      </div>
    </Draggable>
  );
}
```

### 4.2 Embed System (Micro-frontends)

**Responsibility:** Render external service UIs as embeddable artifacts within the canvas.

```typescript
// embeds/PaperclipEmbed.tsx
function PaperclipEmbed({ companyId }: { companyId: string }) {
  const { data: orgChart } = useQuery({
    queryKey: ['paperclip', 'orgChart', companyId],
    queryFn: () => paperclipApi.getOrgChart(companyId),
  });

  return (
    <div className="embed paperclip-embed">
      <OrgChart data={orgChart} />
      <TicketBoard companyId={companyId} />
      <BudgetTracker companyId={companyId} />
    </div>
  );
}

// embeds/PlannotatorEmbed.tsx
function PlannotatorEmbed({ planId, userRole }: { planId: string; userRole: UserRole }) {
  const { data: plan } = useQuery({
    queryKey: ['plannotator', 'plan', planId],
    queryFn: () => plannotatorApi.getPlan(planId),
  });

  const visibleSections = plan.sections.filter(section => {
    if (userRole === 'domain_expert') return section.type === 'business';
    return true; // Technical founder sees all
  });

  return (
    <div className="embed plannotator-embed">
      {visibleSections.map(section => (
        <PlanSection 
          key={section.id} 
          section={section}
          readonly={userRole === 'domain_expert' && section.type === 'technical'}
        />
      ))}
      <ApprovalActions planId={planId} />
    </div>
  );
}

// embeds/AEGISReport.tsx
function AEGISReport({ auditId }: { auditId: string }) {
  const { data: report } = useQuery({
    queryKey: ['aegis', 'audit', auditId],
    queryFn: () => aegisApi.getAuditReport(auditId),
  });

  const { role } = useUserStore();

  return (
    <div className="embed aegis-report">
      <RiskHeatmap domains={report.domains} />
      {role === 'technical_founder' && <FullFindings findings={report.findings} />}
      {role === 'domain_expert' && <ExecutiveSummary summary={report.executiveSummary} />}
      <ApprovalActions auditId={auditId} />
    </div>
  );
}
```

### 4.3 Real-Time Sync

```typescript
// hooks/useWebSocket.ts
function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { updateCard, moveCard, addAgent, updateAgentStatus } = useCanvasStore();

  useEffect(() => {
    socketRef.current = io(WS_URL, {
      auth: { token: getAuthToken() },
    });

    socketRef.current.on('card:update', (card: Card) => updateCard(card));
    socketRef.current.on('card:move', ({ id, position }) => moveCard(id, position));
    socketRef.current.on('agent:status', ({ id, status }) => updateAgentStatus(id, status));
    socketRef.current.on('agent:spawn', (agent: Agent) => addAgent(agent));

    return () => socketRef.current?.disconnect();
  }, []);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { emit };
}

// hooks/useCanvasSync.ts
function useCanvasSync() {
  const { emit } = useWebSocket();
  const { cards, selectedCards } = useCanvasStore();

  // Debounced sync for card movements
  const debouncedMove = useDebouncedCallback((id: string, position: Position) => {
    emit('card:move', { id, position });
  }, 100);

  // Immediate sync for selections
  const syncSelection = (ids: string[]) => {
    emit('selection:change', { ids });
  };

  return { debouncedMove, syncSelection };
}
```

---

## 5. Routing Architecture

### 5.1 Route Structure

```typescript
// App.tsx — Main router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main canvas shell */}
        <Route path="/" element={<CanvasLayout />}>
          <Route index element={<CanvasPage />} />
          <Route path="brain" element={<BrainDashboard />} />
          <Route path="crm" element={<DenchClawEmbed />} />
        </Route>

        {/* Standalone service UIs */}
        <Route path="/paperclip" element={<PaperclipDashboard />} />
        <Route path="/paperclip/company/:id" element={<CompanyDetail />} />
        <Route path="/paperclip/agent/:id" element={<AgentDetail />} />

        <Route path="/plannotator/:planId" element={<PlannotatorReview />} />

        <Route path="/hcom" element={<HCOMDashboard />} />

        <Route path="/gbrain" element={<GbrainQuery />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/invite/:token" element={<InvitePage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 5.2 Route Guards

```typescript
// components/RouteGuard.tsx
function RouteGuard({ requiredRole, children }: { requiredRole: UserRole; children: ReactNode }) {
  const { role, isLoading } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && role !== requiredRole) {
      navigate('/');
    }
  }, [role, isLoading]);

  if (isLoading) return <LoadingSpinner />;
  return <>{children}</>;
}

// Usage
<Route path="/engineering" element={
  <RouteGuard requiredRole="technical_founder">
    <EngineeringZone />
  </RouteGuard>
} />
```

---

## 6. API Integration Architecture

### 6.1 API Client Pattern

```typescript
// api/client.ts
class APIClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('token');
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': this.token ? `Bearer ${this.token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }

    return response.json();
  }

  get<T>(endpoint: string) { return this.request<T>(endpoint); }
  post<T>(endpoint: string, body: unknown) { 
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }); 
  }
  put<T>(endpoint: string, body: unknown) { 
    return this.request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }); 
  }
  delete<T>(endpoint: string) { 
    return this.request<T>(endpoint, { method: 'DELETE' }); 
  }
}

// Service-specific APIs
export const agorApi = new APIClient('http://localhost:3000/api/v1');
export const paperclipApi = new APIClient('http://localhost:3001/api/v1');
export const gbrainApi = new APIClient('http://localhost:3002/api/v1');
export const plannotatorApi = new APIClient('http://localhost:3003/api/v1');
export const hcomApi = new APIClient('http://localhost:3004/api/v1');
```

### 6.2 TanStack Query Integration

```typescript
// hooks/useAgents.ts
function useAgents(companyId: string) {
  return useQuery({
    queryKey: ['agents', companyId],
    queryFn: () => paperclipApi.get(`/companies/${companyId}/agents`),
    refetchInterval: 30000, // Every 30s
    staleTime: 10000,
  });
}

// hooks/useBrainQuery.ts
function useBrainQuery(query: string) {
  return useQuery({
    queryKey: ['brain', 'query', query],
    queryFn: () => gbrainApi.post('/query', { q: query }),
    enabled: query.length > 2,
  });
}

// hooks/usePlanReview.ts
function usePlanReview(planId: string) {
  return useMutation({
    mutationFn: (annotation: Annotation) => 
      plannotatorApi.post(`/plans/${planId}/annotations`, annotation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plannotator', 'plan', planId] });
    },
  });
}
```

---

## 7. Performance Architecture

### 7.1 Rendering Optimization

| Technique | Application | Implementation |
|-----------|-------------|----------------|
| Virtualization | Large card lists | `react-window` for card lists > 100 items |
| Memoization | Expensive components | `React.memo` for Card, Zone, AgentCard |
| Lazy loading | Embeds | `React.lazy` + `Suspense` for micro-frontends |
| Code splitting | Routes | Vite dynamic imports per route |
| Image optimization | Card images | WebP format, lazy loading, blur placeholder |
| Canvas optimization | Infinite canvas | `requestAnimationFrame` for pan/zoom, offscreen canvas for minimap |

### 7.2 Bundle Strategy

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'state-vendor': ['zustand', '@tanstack/react-query'],
          'canvas-vendor': ['fabric', 'pixi.js'],
          'ui-vendor': ['tailwindcss', 'lucide-react', 'recharts'],

          // Feature chunks
          'paperclip': ['./src/embeds/PaperclipEmbed.tsx'],
          'plannotator': ['./src/embeds/PlannotatorEmbed.tsx'],
          'hcom': ['./src/embeds/HCOMDashboard.tsx'],
          'gbrain': ['./src/embeds/GbrainDashboard.tsx'],
          'aegis': ['./src/embeds/AEGISReport.tsx'],
        },
      },
    },
  },
});
```

### 7.3 Performance Budgets

| Metric | Budget | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Bundle size (initial) | < 200KB | `vite-bundle-visualizer` |
| Bundle size (total) | < 1MB | `vite-bundle-visualizer` |
| Canvas frame rate | > 30fps | Chrome DevTools |
| WebSocket latency | < 100ms | Custom timing |

---

## 8. Testing Architecture

### 8.1 Testing Pyramid

```
        ┌─────────────┐
        │   E2E       │  Playwright — Full user journeys
        │   10%       │  Canvas drag, gate approval, agent spawn
        ├─────────────┤
        │  Integration │  Vitest + MSW — API integration, WebSocket
        │   30%       │  Component renders, data fetching, state
        ├─────────────┤
        │   Unit      │  Vitest — Utilities, hooks, stores
        │   60%       │  Canvas math, permissions, formatters
        └─────────────┘
```

### 8.2 Test Examples

```typescript
// __tests__/canvasMath.test.ts
import { describe, it, expect } from 'vitest';
import { snapToGrid, calculateZoom } from '../utils/canvasMath';

describe('canvasMath', () => {
  it('snaps position to grid', () => {
    expect(snapToGrid({ x: 47, y: 93 }, 20)).toEqual({ x: 40, y: 100 });
  });

  it('calculates zoom with min/max bounds', () => {
    expect(calculateZoom(1.5, 0.1, 3.0)).toBe(1.5);
    expect(calculateZoom(5.0, 0.1, 3.0)).toBe(3.0);
    expect(calculateZoom(0.05, 0.1, 3.0)).toBe(0.1);
  });
});

// __tests__/permissions.test.ts
import { describe, it, expect } from 'vitest';
import { canEditZone, canViewSection } from '../utils/permissions';

describe('permissions', () => {
  it('allows DE to edit business zone', () => {
    expect(canEditZone('domain_expert', 'business')).toBe(true);
  });

  it('prevents DE from editing engineering zone', () => {
    expect(canEditZone('domain_expert', 'engineering')).toBe(false);
  });

  it('allows TF to view all sections', () => {
    expect(canViewSection('technical_founder', 'technical')).toBe(true);
    expect(canViewSection('technical_founder', 'business')).toBe(true);
  });

  it('hides technical sections from DE', () => {
    expect(canViewSection('domain_expert', 'technical')).toBe(false);
  });
});

// __tests__/Canvas.e2e.test.ts
import { test, expect } from '@playwright/test';

test('domain expert can create business model canvas', async ({ page }) => {
  await page.goto('/');
  await page.fill('[data-testid="login-email"]', 'sarah@example.com');
  await page.fill('[data-testid="login-password"]', 'password');
  await page.click('[data-testid="login-submit"]');

  // Create BMC card
  await page.dblclick('[data-testid="business-zone"]');
  await page.selectOption('[data-testid="card-type"]', 'bmc');
  await page.fill('[data-testid="card-title"]', 'Value Proposition');
  await page.fill('[data-testid="card-content"]', 'AI-powered note-taking');
  await page.click('[data-testid="card-save"]');

  // Verify card appears
  const card = page.locator('[data-testid="card"]:has-text("Value Proposition")');
  await expect(card).toBeVisible();

  // Verify engineering zone is read-only
  const engZone = page.locator('[data-testid="engineering-zone"]');
  await expect(engZone).toHaveAttribute('data-readonly', 'true');
});
```

---

## 9. Build & Deployment

### 9.1 Build Pipeline

```bash
# Development
pnpm dev              # Start all micro-frontends in parallel
pnpm dev:web          # Start main web app only
pnpm dev:paperclip    # Start Paperclip UI only

# Build
pnpm build            # Build all apps for production
pnpm build:web        # Build main web app
pnpm build:paperclip  # Build Paperclip UI

# Test
pnpm test             # Run all tests
pnpm test:unit        # Run Vitest unit tests
pnpm test:e2e         # Run Playwright E2E tests

# Lint
pnpm lint             # ESLint + TypeScript
pnpm format           # Prettier
```

### 9.2 Environment Configuration

```typescript
// .env.development
VITE_AGOR_API_URL=http://localhost:3000/api/v1
VITE_PAPERCLIP_API_URL=http://localhost:3001/api/v1
VITE_GBRAIN_API_URL=http://localhost:3002/api/v1
VITE_PLANNOTATOR_API_URL=http://localhost:3003/api/v1
VITE_HCOM_API_URL=http://localhost:3004/api/v1
VITE_WS_URL=ws://localhost:3000

// .env.production
VITE_AGOR_API_URL=/api/agor
VITE_PAPERCLIP_API_URL=/api/paperclip
VITE_GBRAIN_API_URL=/api/gbrain
VITE_PLANNOTATOR_API_URL=/api/plannotator
VITE_HCOM_API_URL=/api/hcom
VITE_WS_URL=wss://venturespec.app/ws
```

---

*End of Frontend Architecture Document*
