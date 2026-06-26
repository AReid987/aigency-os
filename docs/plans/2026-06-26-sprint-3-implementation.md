# Sprint 3 Implementation Plan — AEGIS + DenchClaw + Gbrain

**Goal:** Build quality gates (AEGIS), CRM (DenchClaw), and company brain (Gbrain) layers.

**Architecture:** Three new Fastify services (aegis:3014, denchclaw:3015, gbrain:3016), three new React apps (aegis-dashboard:3007, denchclaw-ui:3100, gbrain-dashboard:3008), extended shared-types and api-client.

---

## Phase 1: Shared Types (No deps)

### Task 1: Add AEGIS, DenchClaw, Gbrain types to shared-types
- Create: `packages/shared-types/src/aegis.ts` — AuditDomain, Finding, Persona, ConfidenceScore, RemediationPlan, AuditReport
- Create: `packages/shared-types/src/denchclaw.ts` — Contact, Deal, PipelineStage, OutreachSequence, Lead
- Create: `packages/shared-types/src/gbrain.ts` — KnowledgePage, PageType, QueryResult, GraphData, GraphNode, GraphEdge, Frontmatter
- Update: `packages/shared-types/src/index.ts`

## Phase 2: Backend Services (parallel)

### Task 2: AEGIS Service (port 3014)
14-domain audit engine with findings, personas, confidence scoring, transform to PAUL plans.

### Task 3: DenchClaw Service (port 3015)
CRM API with contacts, deals, pipeline stages, outreach sequences.

### Task 4: Gbrain Service (port 3016)
Knowledge brain with pages, auto-capture stubs, hybrid search, graph, per-user scoping.

## Phase 3: Frontend Apps (parallel)

### Task 5: AEGIS Dashboard (port 3007)
Risk heatmap (14 domains), findings list, executive summary, persona evaluation view.

### Task 6: DenchClaw UI (port 3100)
Contact list, deal pipeline kanban, outreach dashboard.

### Task 7: Gbrain Dashboard (port 3008)
Knowledge graph (force-directed), query bar, page viewer, per-user scoping toggle.

## Phase 4: Integration & Tests

### Task 8: Docker compose + tests + canvas widgets
Update docker-compose, add tests for all services, add AEGIS milestone card type to canvas.

## Success Criteria Mapping
| Criteria | Task |
|---|---|
| turbo run lint typecheck test build | All |
| AEGIS dashboard at :3007 | Task 5 |
| AEGIS audit produces findings | Task 2 |
| AEGIS Transform → PAUL plan | Task 2 |
| DenchClaw at :3100 | Task 6 |
| DenchClaw API at :3101 | Task 3 |
| Gbrain dashboard at :3008 | Task 7 |
| Gbrain query returns results | Task 4 |
| Gbrain per-user scoping | Task 4 |
