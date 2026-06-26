# Aigency OS — Technical Founder Runbook

> Operational guide for developers and technical founders managing the Aigency OS platform.

---

## Prerequisites

| Dependency | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 22.x LTS | JavaScript runtime |
| **pnpm** | 9.x | Package manager (monorepo workspaces) |
| **Docker** | 24.x+ | Infrastructure services (PostgreSQL, Redis) |
| **Docker Compose** | v2.x+ | Multi-container orchestration |
| **Git** | 2.x+ | Version control |

### Verify installation:

```bash
node --version    # Should output v22.x.x
pnpm --version    # Should output 9.x.x
docker --version  # Should output 24.x.x or higher
docker compose version  # Should output v2.x.x
```

### Install pnpm (if missing):

```bash
corepack enable
corepack prepare pnpm@9.15.0 --activate
```

---

## Project Structure

```
aigency-os/
├── apps/                    # Frontend applications (7)
│   ├── web/                 # Agor Canvas — main workspace
│   ├── paperclip-ui/        # Paperclip org chart dashboard
│   ├── hcom-dashboard/      # HCOM agent message monitor
│   ├── embed-shell/         # Micro-frontend iframe sandbox
│   ├── plannotator-ui/      # Plannotator plan viewer
│   ├── aegis-dashboard/     # AEGIS audit report viewer
│   ├── denchclaw-ui/        # DenchClaw CRM interface
│   └── gbrain-dashboard/    # Gbrain knowledge explorer
├── services/                # Backend services (9)
│   ├── paperclip-api/       # Paperclip REST + WS API
│   ├── hcom-api/            # HCOM agent message bus
│   ├── bmad/                # Business Model Analysis & Design
│   ├── paul/                # Plan generation agent
│   ├── gstack/              # Growth stack analysis
│   ├── plannotator/         # Plan orchestration service
│   ├── aegis/               # Audit & governance engine
│   ├── denchclaw/           # CRM data service
│   └── gbrain/              # Knowledge graph service
├── packages/                # Shared packages (4)
│   ├── shared-types/        # TypeScript interfaces
│   ├── api-client/          # HTTP/WS fetch wrappers
│   ├── ui/                  # Shared React components
│   └── config/              # ESLint, Prettier, TSConfig presets
├── infra/
│   └── docker/              # Docker Compose files
└── docs/                    # BMAD documentation
```

---

## Starting Infrastructure

Start PostgreSQL and Redis via Docker:

```bash
# From the repo root
docker compose -f infra/docker/docker-compose.yml up -d

# Verify containers are running
docker compose -f infra/docker/docker-compose.yml ps
```

**Infrastructure services:**

| Service | Port | Credentials |
|---------|------|-------------|
| PostgreSQL 16 | 5432 | user: `aigency`, password: `aigency_dev`, db: `aigency` |
| Redis 7 | 6379 | (no password) |

---

## Starting All Services (Development)

```bash
# Install all dependencies
pnpm install

# Start everything in dev mode (parallel via Turborepo)
pnpm dev
```

This starts all 9 backend services and 7 frontend apps simultaneously. Turborepo handles dependency ordering automatically.

---

## Starting Individual Services

For targeted development, start only what you need:

```bash
# Start a single service
pnpm --filter paperclip-api dev
pnpm --filter hcom-api dev

# Start a single app
pnpm --filter web dev
pnpm --filter plannotator-ui dev

# Start a service and its dependencies
pnpm --filter paperclip-api... dev
```

---

## Port Reference

### Backend Services

| Service | Default Port | Description |
|---------|-------------|-------------|
| `paperclip-api` | 3001 | Venture org chart, agents, budgets |
| `hcom-api` | 3007 | Cross-agent messaging bus |
| `bmad` | 3010 | Business Model Analysis & Design agent |
| `paul` | 3011 | Plan Underwriting & Layout agent |
| `gstack` | 3012 | Growth stack analysis agent |
| `plannotator` | 3013 | Plan orchestration service |
| `aegis` | 3014 | Audit & governance engine |
| `denchclaw` | 3015 | CRM data service |
| `gbrain` | 3016 | Knowledge graph service |

### Frontend Apps

| App | Default Port | Description |
|-----|-------------|-------------|
| `web` (Agor Canvas) | 3000 | Main visual workspace |
| `paperclip-ui` | 3002 | Paperclip dashboard |
| `plannotator-ui` | 3003 | Plan viewer |
| `embed-shell` | 3003 | Micro-frontend sandbox |
| `hcom-dashboard` | 3005 | Agent message monitor |
| `aegis-dashboard` | 3007 | Audit report viewer |
| `gbrain-dashboard` | 3008 | Knowledge explorer |
| `denchclaw-ui` | 3100 | CRM interface |

### Infrastructure

| Service | Port | Purpose |
|---------|------|---------|
| PostgreSQL | 5432 | Primary database |
| Redis | 6379 | Cache & pub/sub |

> **Note:** All ports are configurable via `PORT` environment variables. Override with `PORT=4001 pnpm --filter bmad dev`.

---

## Spawning Agents via HCOM

HCOM (Hermes Communication Protocol) is the message bus for inter-agent communication. Agents are spawned through the HCOM API.

### Via REST API:

```bash
# Spawn a new agent
curl -X POST http://localhost:3007/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "bmad-analyst-01",
    "type": "bmad",
    "config": {
      "ventureId": "venture-001",
      "task": "Analyze business model for SaaS product"
    }
  }'

# List active agents
curl http://localhost:3007/api/agents

# Send a message to an agent
curl -X POST http://localhost:3007/api/messages \
  -H "Content-Type: application/json" \
  -d '{
    "from": "orchestrator",
    "to": "bmad-analyst-01",
    "type": "task",
    "payload": { "action": "generate_bmc", "ventureId": "venture-001" }
  }'
```

### Via WebSocket:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3007');

// Listen for agent messages
socket.on('agent:message', (msg) => {
  console.log(`[${msg.from}] ${msg.type}:`, msg.payload);
});

// Send a task to an agent
socket.emit('agent:task', {
  to: 'bmad-analyst-01',
  type: 'generate_bmc',
  payload: { ventureId: 'venture-001' }
});
```

### Agent Lifecycle:

```
SPAWNED → ACTIVE → BUSY → IDLE → SHUTDOWN
                    ↓
                  ERROR → RETRY → ACTIVE
```

---

## Monitoring Agent Budgets

Each agent has a token and cost budget tracked by Paperclip.

```bash
# View all agent budgets
curl http://localhost:3001/api/agents/budgets

# View a specific agent's budget
curl http://localhost:3001/api/agents/{agentId}/budget
```

Budget alerts trigger automatically when:
- Token usage exceeds 80% of budget
- Cost exceeds 80% of budget
- Agent attempts to exceed 100% (request is blocked)

---

## Reading AEGIS Audit Reports

AEGIS generates quality audit reports for all agent outputs.

### Via API:

```bash
# List all audit reports
curl http://localhost:3014/api/audits

# Get a specific report
curl http://localhost:3014/api/audits/{auditId}

# Get audits for a specific venture
curl http://localhost:3014/api/audits?ventureId=venture-001
```

### Report structure:

```json
{
  "id": "audit-001",
  "ventureId": "venture-001",
  "targetType": "bmc",
  "targetId": "bmc-001",
  "score": 85,
  "findings": [
    { "type": "pass", "message": "Revenue model is well-defined" },
    { "type": "warn", "message": "Cost structure missing labor estimates" }
  ],
  "recommendations": [
    "Add FTE cost projections to the cost structure"
  ],
  "timestamp": "2026-06-26T10:30:00Z"
}
```

---

## Querying Gbrain

Gbrain is the knowledge graph service. Query it for accumulated venture knowledge.

### Via API:

```bash
# Search the knowledge base
curl "http://localhost:3016/api/search?q=pricing+strategy&ventureId=venture-001"

# Get knowledge graph for a venture
curl http://localhost:3016/api/graph?ventureId=venture-001

# Add a document to the knowledge base
curl -X POST http://localhost:3016/api/documents \
  -H "Content-Type: application/json" \
  -d '{
    "ventureId": "venture-001",
    "title": "Market Research Q2 2026",
    "content": "...",
    "tags": ["market-research", "pricing"]
  }'

# Ask a natural language question
curl -X POST http://localhost:3016/api/ask \
  -H "Content-Type: application/json" \
  -d '{
    "ventureId": "venture-001",
    "question": "What pricing model did we decide on?"
  }'
```

---

## Building & Testing

```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Type-check all packages
pnpm typecheck

# Lint all packages
pnpm lint

# Clean build artifacts
pnpm clean
```

### Turborepo-specific commands:

```bash
# Run a task for a specific package and its dependencies
pnpm turbo run build --filter=bmad...

# Run a task for a specific package only
pnpm turbo run build --filter=bmad

# Generate a dependency graph
pnpm turbo run build --graph

# View the Turborepo pipeline definition
cat turbo.json
```

---

## Deploying Updates

### Development:

```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
pnpm install

# Rebuild shared packages
pnpm build

# Restart services
pnpm dev
```

### Production:

```bash
# Build all packages for production
NODE_ENV=production pnpm build

# Start with Docker Compose (if using containerized deployment)
docker compose -f infra/docker/docker-compose.yml up -d --build
```

---

## Troubleshooting

### Port already in use

```bash
# Find what's using the port
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3099 pnpm --filter paperclip-api dev
```

### pnpm install fails

```bash
# Clear pnpm store
pnpm store prune

# Delete node_modules and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules services/*/node_modules packages/*/node_modules
pnpm install
```

### TypeScript build errors after pulling changes

```bash
# Clean and rebuild everything
pnpm clean
pnpm install
pnpm build
```

### Docker containers won't start

```bash
# Check container logs
docker compose -f infra/docker/docker-compose.yml logs postgres
docker compose -f infra/docker/docker-compose.yml logs redis

# Restart containers
docker compose -f infra/docker/docker-compose.yml down
docker compose -f infra/docker/docker-compose.yml up -d

# Remove volumes (WARNING: deletes data)
docker compose -f infra/docker/docker-compose.yml down -v
```

### WebSocket connection refused

- Ensure the backend service is running: `curl http://localhost:3007/api/health`
- Check for CORS issues in browser console (F12 → Console)
- Verify no proxy is blocking WebSocket upgrades

### Agent not responding

```bash
# Check agent status
curl http://localhost:3007/api/agents/{agentId}

# Check agent logs in HCOM dashboard
open http://localhost:3005

# Restart the agent
curl -X POST http://localhost:3007/api/agents/{agentId}/restart
```

### Database connection errors

```bash
# Verify PostgreSQL is running
docker exec aigency-postgres pg_isready -U aigency -d aigency

# Connect manually to inspect
docker exec -it aigency-postgres psql -U aigency -d aigency
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | (per service) | Override service port |
| `NODE_ENV` | `development` | `development` or `production` |
| `DATABASE_URL` | `postgresql://aigency:PASSWORD@localhost:5432/aigency` | PostgreSQL connection string |
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |

---

*v0.1.0 — Aigency OS*
