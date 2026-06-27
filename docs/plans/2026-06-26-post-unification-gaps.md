# Post-Unification Implementation Plan

## Gap 1: Real Auth (JWT + Backend)

- Add auth routes to Paperclip API (or new auth service)
- POST /auth/register — hash password with bcrypt, store user
- POST /auth/login — validate credentials, return JWT
- GET /auth/me — validate JWT, return user profile
- Auth middleware for protected API routes
- Frontend: store JWT in memory (not localStorage), attach to API calls
- Admin account seeded on startup

## Gap 2: Plannotator Venture Flow

- Venture creation sends idea to PAUL service (real HTTP call)
- PAUL generates clarifying questions based on the idea
- User answers questions → PAUL rearticulates into structured PRD
- PRD goes to Plannotator for section-based review
- Domain expert approves business sections
- PAUL generates TECH-SPEC from approved PRD
- All via real API calls to services

## Gap 3: Venture → Canvas Pipeline

- After approval, POST to create venture in Paperclip
- Canvas loads ventures from API (not just demo data)
- New venture creates a zone with BMC, revenue, gate cards
- Canvas state persists via API calls
