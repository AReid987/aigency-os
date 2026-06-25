# PROJECT BRIEF — Venture Spec Collaboration Platform

**Document Type:** PRFAQ (Product Requirements & Frequently Asked Questions)  
**Version:** 1.0  
**Date:** 2026-06-24  
**Author:** Technical Founder + Domain Expert  
**Status:** Draft — Ready for Agent Review  
**Template:** BMAD Method — Product Brief  

---

## 1. Press Release (The Vision)

**FOR IMMEDIATE RELEASE**

Today, we announce the launch of the **Venture Spec Collaboration Platform** — a visual-first, agent-orchestrated workspace that enables a technical founder and a domain expert to collaboratively design, validate, and build new ventures from zero to MVP.

Unlike traditional project management tools that force humans into rigid workflows, our platform treats both humans and AI agents as first-class collaborators on a shared infinite canvas. A domain expert can shape business strategy, revenue models, and go-to-market plans without ever touching code. A technical founder can orchestrate 15+ CLI coding agents in parallel, with automatic quality gates, knowledge capture, and real-time visibility for the domain expert.

The platform integrates eight specialized layers: a shared multiplayer canvas (Agor), venture orchestration (Paperclip), business methodology (BMAD), agent communication (HCOM), implementation skills (Gstack), quality auditing (AEGIS), customer relationship management (DenchClaw), and an institutional knowledge brain (Gbrain) — all wired together with deterministic human approval gates at every milestone.

**Key capabilities:**
- Visual-first infinite canvas with role-based zones (Business vs. Engineering)
- AI CEO agent that hires and manages an org chart of specialized agents
- 15+ CLI coding agents communicating seamlessly via HCOM
- Automatic knowledge capture into a searchable, visualized company brain
- Quality gates at every milestone with 14-domain audit coverage
- Local-first CRM for customer and outreach management
- Read-only technical access for domain experts; full admin for technical founders

---

## 2. Frequently Asked Questions

### Q: Who is this for?
**A:** Technical founders who want to build ventures with a domain expert partner, using AI agents as the implementation workforce. The platform is designed for a 2-person team (1 technical + 1 domain expert) plus an orchestra of AI agents.

### Q: What problem does this solve?
**A:** Three problems:
1. **Coordination chaos:** Running 15+ CLI agents across multiple terminals with no shared context or communication layer.
2. **Domain expert exclusion:** Technical tools lock out non-technical stakeholders from meaningful contribution.
3. **Knowledge loss:** Every agent session, decision, and audit result is lost unless manually documented.

### Q: Why not just use existing tools?
**A:** No existing tool combines all eight layers. Paperclip orchestrates ventures but lacks a visual canvas. Agor provides multiplayer but lacks venture-level orchestration. HCOM connects agents but lacks a business methodology layer. This platform wires them all together with deterministic gates.

### Q: What does "deterministic human approval gates" mean?
**A:** Using Babysitter, the system enforces that certain milestones cannot proceed without explicit human approval. For example: a business model cannot advance to technical architecture until the domain expert signs off. A technical spec cannot advance to implementation until both humans annotate and approve in Plannotator.

### Q: What is the target architecture?
**A:** Self-hosted on a VPS or local machine. All core services run locally (Agor, Paperclip, Gbrain, DenchClaw). Agent communication happens via HCOM over local SQLite. Remote access via SSH + tmux/amux.

### Q: What is the success criteria?
**A:**
- A domain expert can create a business model canvas without writing code
- A technical founder can spawn 5+ CLI agents in parallel, all communicating via HCOM
- Every decision, plan, and audit result is automatically captured in Gbrain
- Quality gates catch missing pieces (e.g., unit economics gaps) before they become expensive
- The platform can take a venture from idea to shipped MVP in under 2 weeks

---

## 3. Customer & User Segments

| Segment | Role | Primary Needs | Technical Skill |
|---------|------|---------------|-----------------|
| Primary | Technical Founder | Orchestrate agents, control architecture, ship MVP | Expert |
| Primary | Domain Expert | Define business model, review plans, approve milestones | Non-technical |
| Secondary | AI Agents (15+) | Execute tasks, communicate, report status | N/A |
| Tertiary | Investors/Advisors | View venture dashboard, inspect unit economics | Varies |

---

## 4. Key Metrics (North Star)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to MVP | < 14 days | From idea to deployed production code |
| Agent Utilization | > 80% | % of agent sessions producing shippable output |
| Knowledge Capture | 100% | All plans, decisions, audits stored in Gbrain |
| Gate Pass Rate | > 90% | Milestones passing quality gates on first attempt |
| Domain Expert Engagement | > 5 hrs/week | Active time in Business Zone |

---

## 5. Assumptions & Risks

### Assumptions
- Users have access to multiple AI model API keys (Claude, OpenAI, Gemini, etc.)
- Users have a VPS or dedicated machine with 16GB+ RAM for running parallel agents
- Domain experts are willing to learn a visual canvas interface (no code required)
- BMAD, Paperclip, and other tools remain actively maintained

### Risks
| Risk | Mitigation |
|------|------------|
| Agent API costs spiral | Paperclip budget controls + per-agent limits |
| Merge conflicts between parallel agents | Single-assignment in Paperclip + git worktrees in amux |
| Domain expert feels overwhelmed | Visual-first design, read-only technical zones, Babysitter gates |
| Knowledge brain becomes unsearchable | Gbrain hybrid search + LLM-wiki-v2 patterns |
| Tool dependency breaks | All tools are open-source and self-hostable |

---

## 6. Competitive Landscape

| Competitor | What They Do | What We Do Better |
|------------|--------------|-------------------|
| Paperclip (standalone) | Venture orchestration | + Visual canvas + BMAD methodology + Quality gates |
| Agor (standalone) | Multiplayer canvas | + Venture orchestration + Agent communication + Brain |
| Cursor / Windsurf | IDE with AI | + Multi-agent orchestra + Business collaboration + Knowledge capture |
| Replit Agent | Cloud coding agent | + Self-hosted + Multi-agent + Domain expert access |
| Devin | Autonomous cloud agent | + Self-hosted + Human-in-the-loop + Business methodology |

---

## 7. Go-to-Market (Internal Use)

**Phase 1 (Weeks 1-2):** Build the core platform for personal use — Agor + Paperclip + HCOM + Gbrain
**Phase 2 (Weeks 3-4):** Add BMAD methodology integration, Babysitter gates, Plannotator
**Phase 3 (Weeks 5-6):** Add AEGIS quality gates, DenchClaw CRM, Gstack skills
**Phase 4 (Weeks 7-8):** Polish UI/UX, stress-test with a real venture idea, iterate

---

*End of Project Brief*
