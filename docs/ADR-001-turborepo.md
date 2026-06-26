# ADR-001: Turborepo as Monorepo Build System

- **Status:** Accepted
- **Date:** 2026-04-15
- **Deciders:** Technical Founders
- **Tags:** infrastructure, build, monorepo

---

## Context

Aigency OS is a platform composed of 9 backend services, 7 frontend applications, and 4 shared packages — all written in TypeScript. We need a monorepo build system that can:

1. Manage inter-package dependencies (e.g., services depend on `@aigency/shared-types`)
2. Run builds in parallel where possible
3. Cache build artifacts to avoid redundant work
4. Support incremental development (only rebuild what changed)
5. Work with pnpm workspaces
6. Have a low configuration overhead

### Alternatives Considered

| System | Description |
|--------|-------------|
| **Turborepo** | Vercel's monorepo build orchestrator. Rust-based, remote caching, pipeline-aware. |
| **Nx** | Nrwl's monorepo toolkit. Plugin-based, affected commands, computation caching. |
| **Lerna** | Classic JS monorepo tool. Package publishing focused, lightweight. |
| **Bazel** | Google's build system. Hermetic builds, language-agnostic, steep learning curve. |
| **Rush** | Microsoft's monorepo manager. Strict, enterprise-focused, complex setup. |

---

## Decision

We chose **Turborepo** as the monorepo build system.

---

## Rationale

### 1. Minimal Configuration
Turborepo requires only a `turbo.json` pipeline definition. No plugins, no generators, no IDE extensions. For a team of 2–3 technical founders, low overhead is critical.

### 2. Native pnpm Workspace Integration
Turborepo works directly with pnpm workspaces — no adapter layer needed. Our `pnpm-workspace.yaml` defines the workspace layout; Turborepo reads it automatically.

### 3. Pipeline-Aware Parallel Execution
Turborepo's `turbo.json` defines task dependencies (e.g., `build` depends on `^build` for upstream packages). It automatically topologically sorts and parallelizes execution. With 20 packages, this saves significant time.

### 4. Content-Aware Caching
Turborepo caches task outputs based on input file hashes. If `@aigency/shared-types` hasn't changed, downstream services skip its build entirely. This makes `turbo run build` near-instant on repeat runs.

### 5. Simple Mental Model
The pipeline concept (`build`, `dev`, `test`, `lint`, `typecheck`) maps directly to our `package.json` scripts. No new abstractions to learn.

### 6. Remote Caching (Future)
Turborepo supports remote caching via Vercel or self-hosted. When CI/CD is added, build artifacts can be shared across machines — a significant future benefit.

### Trade-offs

| Trade-off | Impact | Mitigation |
|-----------|--------|------------|
| Less powerful than Nx's affected analysis | May need to run more tasks than strictly necessary | Acceptable at 20-package scale; revisit at 50+ |
| No built-in code generation | Must use separate tools for scaffolding | Use `pnpm init` + manual setup; templates in `packages/config` |
| Plugin ecosystem is smaller than Nx | Fewer pre-built integrations | We use standard tools (Vite, Fastify) that don't need plugins |

---

## Consequences

### Positive
- Fast parallel builds across 20 packages
- Zero-config caching reduces developer wait times
- Simple `turbo.json` is easy to understand and modify
- Works seamlessly with existing pnpm + TypeScript setup

### Negative
- Team must follow the convention of defining scripts in each package's `package.json`
- Remote caching requires Vercel account or self-hosted Turborepo cache server
- If we outgrow Turborepo, migration to Nx is possible but non-trivial

### Risks
- Turborepo is maintained by Vercel — if Vercel deprecates it, we'd need to migrate. Mitigated by Turborepo's open-source license and active community.

---

## References

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [Turborepo vs Nx Comparison](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
