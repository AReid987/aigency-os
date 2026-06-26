# Unified Aigency App — Implementation Plan

**Goal:** Consolidate 7 separate apps into a single unified app with auth, routing, and a venture creation workflow.

## Architecture

Single React app at `apps/web` with:
- React Router v7 for navigation
- Zustand stores for auth + app state
- Role-based access (admin/technical_founder vs domain_expert)
- Unified sidebar navigation
- Venture creation flow

## Pages/Routes

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login page | public |
| `/signup` | Sign up (domain expert) | public |
| `/` | Canvas (main) | authenticated |
| `/brain` | Gbrain knowledge | authenticated |
| `/crm` | DenchClaw CRM | authenticated |
| `/planner` | Plannotator plan review | authenticated |
| `/quality` | AEGIS audit dashboard | authenticated |
| `/agents` | HCOM agent monitor | admin only |
| `/venture/new` | Create new venture | authenticated |
| `/venture/:id` | Venture detail + canvas | authenticated |

## Auth System

- Login with email + password
- Signup creates domain_expert account
- Admin account seeded (the user's account)
- JWT stored in localStorage
- Auth guard on routes

## Venture Creation Flow

1. User enters idea (text)
2. System sends to PAUL → generates plan
3. Plan goes to Plannotator → review/approve
4. Domain expert approves business sections
5. PAUL generates TECH-SPEC
6. Gstack runs autoplan
7. Canvas shows venture with BMC + cards

## Implementation Tasks

### Task 1: Auth system (store + pages + guards)
### Task 2: Router + layout with sidebar
### Task 3: Port all page components from other apps
### Task 4: Venture creation flow
### Task 5: Fix Header nav links
