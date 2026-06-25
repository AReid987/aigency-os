# Aigency OS

A visual-first, agent-orchestrated workspace for collaborative venture building.

## Architecture

8-layer system built on a Turborepo monorepo:

| Layer | Package | Purpose |
|-------|---------|---------|
| Canvas | `apps/web` | Shared multiplayer visual workspace (Agor) |
| Orchestration | `services/paperclip-api` + `apps/paperclip-ui` | Venture org chart, agents, budgets |
| Agent Comms | `services/hcom-api` + `apps/hcom-dashboard` | Cross-agent messaging, lifecycle |
| Embeds | `apps/embed-shell` | Micro-frontend iframe sandbox |
| Shared Types | `packages/shared-types` | TypeScript interfaces |
| API Client | `packages/api-client` | Fetch wrappers, WebSocket client |
| UI | `packages/ui` | Shared React components |
| Config | `packages/config` | ESLint, Prettier, TSConfig presets |

## Quick Start

```bash
# Install dependencies
pnpm install

# Start all services in dev mode
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## Service Ports

| Service | Port |
|---------|------|
| Agor Canvas (web) | 3000 |
| Paperclip API | 3001 |
| Paperclip UI | 3001 |
| HCOM Dashboard | 3002 |
| HCOM API | 3004 |
| Embed Shell | 3003 |

## Tech Stack

- **Frontend:** React 19, TypeScript 5.5+, Vite 6, Tailwind CSS 4, Zustand 5, TanStack Query 5
- **Backend:** Fastify 5, better-sqlite3, Zod validation
- **Monorepo:** Turborepo, pnpm workspaces
- **Real-time:** Socket.io WebSocket

## Project Structure

```
aigency-os/
├── apps/                    # Frontend applications
│   ├── web/                 # Agor Canvas (main workspace)
│   ├── paperclip-ui/        # Paperclip dashboard
│   ├── hcom-dashboard/      # HCOM agent monitor
│   └── embed-shell/         # Micro-frontend embed sandbox
├── packages/                # Shared packages
│   ├── shared-types/        # TypeScript interfaces
│   ├── api-client/          # HTTP/WS client
│   ├── ui/                  # React components
│   └── config/              # Lint/format configs
├── services/                # Backend services
│   ├── paperclip-api/       # Paperclip REST API
│   └── hcom-api/            # HCOM message bus API
├── docs/                    # BMAD documentation
├── turbo.json               # Turborepo pipeline
└── pnpm-workspace.yaml      # Workspace config
```

## Documentation

See `docs/` for the full BMAD-method documentation:

- `00_Aigency_OS_PROJECT_BRIEF.md` — Vision, PRFAQ, competitive landscape
- `01_Aigency_OS_PRD.md` — Requirements, user stories, API specs
- `02_Aigency_OS_ARCHITECTURE.md` — System architecture, deployment
- `03_Aigency_OS_UI_UX.md` — Design philosophy, screen designs
- `04_Aigency_OS_FRONTEND_ARCHITECTURE.md` — React/Vite stack details
- `05_Aigency_OS_BACKLOG.md` — Epics, tasks, sprint plan
