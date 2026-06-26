# Sprint 4 Implementation Plan — Deploy, Harden, Ship v0.1.0

**Goal:** Production-ready deployment, cross-sprint integration, security hardening, documentation, and v0.1.0 release.

**No new apps or packages.** Only infrastructure, scripts, docs, and polish.

---

## Phase 1: Infrastructure (parallel)

### Task 1: Production Docker Compose
Update infra/docker/docker-compose.yml with all 9 services, health checks, restart policies, resource limits, network isolation.

### Task 2: nginx Reverse Proxy
Create infra/nginx/nginx.conf with reverse proxy for all services, rate limiting, security headers.

### Task 3: Scripts (health-check, backup, restore)
Create infra/scripts/health-check.sh, backup.sh, restore.sh.

### Task 4: CI/CD GitHub Actions
Create .github/workflows/ci.yml with lint → typecheck → test → build pipeline.

## Phase 2: Documentation (parallel)

### Task 5: Onboarding Guide
Create docs/ONBOARDING.md — domain expert guide for using the platform.

### Task 6: Technical Founder Runbook
Create docs/RUNBOOK.md — how to start, monitor, deploy, troubleshoot.

### Task 7: CHANGELOG.md
Create CHANGELOG.md with v0.1.0 release notes covering all 4 sprints.

## Phase 3: Integration & Polish

### Task 8: E2E Workflow Test
Create tests/e2e/full-workflow.sh — validates the full idea-to-ship pipeline.

### Task 9: Security Hardening
Create .env.example, update .gitignore, add input validation headers to services.

### Task 10: Tag v0.1.0
Final verification, tag, celebrate.
