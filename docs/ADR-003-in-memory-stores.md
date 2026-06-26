# ADR-003: In-Memory Data Stores for v0.1.0

- **Status:** Accepted
- **Date:** 2026-04-29
- **Deciders:** Technical Founders
- **Tags:** database, storage, architecture

---

## Context

Aigency OS services need to store data: venture definitions, agent state, plans, audit reports, customer records, and knowledge graph entries. We need to choose a storage strategy for v0.1.0.

### Requirements

1. **Fast iteration** — v0.1.0 is a sprint-based prototype; storage must not slow development
2. **Zero operational overhead** — no database administration during early development
3. **Type-safe** — storage layer must work with our TypeScript types
4. **Migration path** — easy to swap for a real database in v0.2.0
5. **Sufficient for demo** — must handle ~100 entities per service without issues

### Alternatives Considered

| Approach | Description |
|----------|-------------|
| **In-memory (Map/Array)** | JavaScript Map objects in process memory |
| **SQLite (better-sqlite3)** | File-based relational database, embedded |
| **PostgreSQL** | Full relational database (via Docker) |
| **MongoDB** | Document database |
| **Redis** | In-memory key-value store |

---

## Decision

We use **in-memory stores** (JavaScript `Map` objects) as the primary data store for all v0.1.0 services, with **better-sqlite3** available for services that need query capabilities (Gbrain, DenchClaw).

---

## Rationale

### 1. Speed of Development
In-memory stores require no schema migrations, no ORM setup, no connection pooling, no Docker dependency. A service can be fully functional with:

```typescript
const store = new Map<string, Venture>();

function createVenture(v: Venture) { store.set(v.id, v); }
function getVenture(id: string) { return store.get(id); }
```

For a sprint-based prototype, this eliminates days of database configuration.

### 2. Zero Infrastructure Dependencies
Services run with just `node`. No PostgreSQL, no Redis, no Docker required for basic development. A new contributor can `pnpm install && pnpm dev` and everything works.

### 3. Type Safety Without ORM
Data is stored as plain TypeScript objects. No ORM mapping layer, no migration files, no generated types. Our `@aigency/shared-types` package defines the shapes directly.

### 4. SQLite for Query-Heavy Services
Services like Gbrain (knowledge graph search) and DenchClaw (CRM queries) use `better-sqlite3` for local file-based SQL when Map-based lookups are insufficient. SQLite is still embedded — no external process needed.

### 5. Clear Migration Path
Every service wraps its store behind a repository interface:

```typescript
interface VentureRepository {
  create(v: Venture): Promise<Venture>;
  findById(id: string): Promise<Venture | null>;
  findAll(): Promise<Venture[]>;
  update(id: string, data: Partial<Venture>): Promise<Venture>;
  delete(id: string): Promise<void>;
}
```

Swapping to PostgreSQL means implementing this interface with a SQL client. No business logic changes.

### Trade-offs

| Trade-off | Impact | Mitigation |
|-----------|--------|------------|
| Data lost on restart | All in-memory data is ephemeral | Acceptable for prototype; PostgreSQL in v0.2.0 |
| No concurrent access | Single-process, single-thread | Each service is a separate process; acceptable |
| Memory limits | Large datasets cause OOM | v0.1.0 targets <1000 entities per service |
| No transactions | No ACID guarantees | Simple domain models don't require them yet |
| No backups | Nothing to back up | Data is disposable; source of truth is BMAD docs |

---

## Migration Plan to PostgreSQL (v0.2.0)

### Phase 1: Add Database Layer (Week 1 of v0.2.0)
1. Add `pg` (node-postgres) or Prisma to each service
2. Define SQL schemas matching current TypeScript interfaces
3. Implement repository interfaces with SQL queries
4. Run both stores in parallel with feature flags

### Phase 2: Data Migration (Week 2)
1. Write seed scripts to populate PostgreSQL from current in-memory state
2. Add migration tooling (Prisma Migrate or Knex)
3. Test all services against PostgreSQL

### Phase 3: Cutover (Week 3)
1. Remove in-memory store implementations
2. Make PostgreSQL the default store
3. Add Redis caching layer for hot paths
4. Update Docker Compose with persistent volumes

### Schema Preview

```sql
-- Ventures table (from Paperclip)
CREATE TABLE ventures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Agent budgets (from Paperclip)
CREATE TABLE agent_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  venture_id UUID REFERENCES ventures(id),
  token_budget INTEGER NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  cost_budget DECIMAL(10,2) NOT NULL,
  cost_incurred DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Audit reports (from AEGIS)
CREATE TABLE audit_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venture_id UUID REFERENCES ventures(id),
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  findings JSONB DEFAULT '[]',
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Consequences

### Positive
- v0.1.0 was delivered on time with zero database configuration
- Developers can run the full stack without Docker
- TypeScript types are the single source of truth for data shapes
- Repository pattern makes future migration straightforward

### Negative
- Data is ephemeral — demo data must be re-created after restarts
- No ability to query across services (no joins)
- Must be careful not to store large objects in memory

### Risks
- Team might deprioritize PostgreSQL migration if in-memory "works fine." Mitigated by making database migration a v0.2.0 milestone gate.

---

## References

- [PostgreSQL Docker Compose](../../infra/docker/docker-compose.yml)
- [ADR-002: HCOM Protocol](./ADR-002-hcom.md)
- [CHANGELOG.md](../../CHANGELOG.md) — Known Limitations section
