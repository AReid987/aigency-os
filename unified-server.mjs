#!/usr/bin/env node
// ─── Aigency OS Unified Server ───────────────────────────────────────────────
// One-process monolith serving all 11 microservices + static frontend.
// No TypeScript compilation needed — imports from pre-built service dist/.
// Run after: pnpm build:all
//
// Usage:
//   NODE_ENV=production JWT_SECRET=... ADMIN_PASSWORD=... node unified-server.mjs
//
// Memory: ~200-300MB at idle (suitable for 512MB VPS).
// ─────────────────────────────────────────────────────────────────────────────

import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from '@fastify/jwt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __root = path.resolve(__dirname);

// ─── Environment ───────────────────────────────────────────────────────────
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const FRONTEND_PATH = process.env.FRONTEND_PATH || path.resolve(__root, 'apps/web/dist');
const LOG_LEVEL = process.env.LOG_LEVEL || 'warn';

// ─── Load Compiled Service Modules ───────────────────────────────────────────
// All services must be built first (pnpm build:all).

const { authRoutes } = await import('./services/paperclip-api/dist/routes/auth.js');
const { companyRoutes } = await import('./services/paperclip-api/dist/routes/companies.js');
const { agentRoutes } = await import('./services/paperclip-api/dist/routes/agents.js');
const { goalRoutes } = await import('./services/paperclip-api/dist/routes/goals.js');
const { ticketRoutes } = await import('./services/paperclip-api/dist/routes/tickets.js');
const { budgetRoutes } = await import('./services/paperclip-api/dist/routes/budgets.js');
const { boardRoutes } = await import('./services/paperclip-api/dist/routes/board.js');
const { dashboardRoutes } = await import('./services/paperclip-api/dist/routes/dashboard.js');
const { heartbeatRoutes } = await import('./services/paperclip-api/dist/routes/heartbeat.js');

const { canvasRoutes } = await import('./services/bmad/dist/routes/canvas.js');
const { revenueRoutes } = await import('./services/bmad/dist/routes/revenue.js');
const { milestoneRoutes } = await import('./services/bmad/dist/routes/milestones.js');
const { competitiveRoutes } = await import('./services/bmad/dist/routes/competitive.js');

const { planRoutes } = await import('./services/paul/dist/routes/plan.js');
const { applyRoutes } = await import('./services/paul/dist/routes/apply.js');
const { unifyRoutes } = await import('./services/paul/dist/routes/unify.js');
const { criteriaRoutes } = await import('./services/paul/dist/routes/criteria.js');

const { autoplanRoutes } = await import('./services/gstack/dist/routes/autoplan.js');
const { shipRoutes } = await import('./services/gstack/dist/routes/ship.js');
const { qaRoutes } = await import('./services/gstack/dist/routes/qa.js');
const { designRoutes } = await import('./services/gstack/dist/routes/design.js');
const { jobRoutes } = await import('./services/gstack/dist/routes/jobs.js');

const { contactRoutes } = await import('./services/denchclaw/dist/routes/contacts.js');
const { dealRoutes } = await import('./services/denchclaw/dist/routes/deals.js');
const { leadRoutes } = await import('./services/denchclaw/dist/routes/leads.js');
const { pipelineRoutes } = await import('./services/denchclaw/dist/routes/pipeline.js');
const { sequenceRoutes } = await import('./services/denchclaw/dist/routes/sequences.js');

const { agentRoutes: hcomAgentRoutes } = await import('./services/hcom-api/dist/routes/agents.js');
const { messageRoutes } = await import('./services/hcom-api/dist/routes/messages.js');
const { collisionRoutes } = await import('./services/hcom-api/dist/routes/collisions.js');
const { lifecycleRoutes } = await import('./services/hcom-api/dist/routes/lifecycle.js');
const { subscriptionRoutes } = await import('./services/hcom-api/dist/routes/subscriptions.js');
const { dashboardRoutes: hcomDashboardRoutes } = await import('./services/hcom-api/dist/routes/dashboard.js');

const { pageRoutes } = await import('./services/gbrain/dist/routes/pages.js');
const { queryRoutes } = await import('./services/gbrain/dist/routes/query.js');
const { graphRoutes } = await import('./services/gbrain/dist/routes/graph.js');
const { captureRoutes } = await import('./services/gbrain/dist/routes/capture.js');
const { synthesizeRoutes } = await import('./services/gbrain/dist/routes/synthesize.js');

const { auditRoutes } = await import('./services/aegis/dist/routes/audit.js');
const { continuousRoutes } = await import('./services/aegis/dist/routes/continuous.js');
const { personaRoutes } = await import('./services/aegis/dist/routes/personas.js');
const { summaryRoutes } = await import('./services/aegis/dist/routes/summary.js');
const { transformRoutes } = await import('./services/aegis/dist/routes/transform.js');

const { planRoutes: plannotatorPlanRoutes } = await import('./services/plannotator/dist/routes/plans.js');
const { annotationRoutes } = await import('./services/plannotator/dist/routes/annotations.js');
const { diffRoutes } = await import('./services/plannotator/dist/routes/diffs.js');

const { skillRoutes } = await import('./services/skills/dist/routes/skills.js');
const { ratingRoutes } = await import('./services/skills/dist/routes/ratings.js');

// ─── Build App ───────────────────────────────────────────────────────────────
const app = Fastify({
  logger: { level: LOG_LEVEL },
  trustProxy: true,
});

await app.register(cors, { origin: CORS_ORIGIN });
await app.register(jwt, { secret: JWT_SECRET });

// Health check
app.get('/health', async () => ({
  status: 'ok',
  service: 'aigency-os-unified',
  version: '0.3.0',
  timestamp: new Date().toISOString(),
}));

// ─── Auth (backward compatible paths) ──────────────────────────────────────
await app.register(authRoutes);

// ─── Paperclip (Core) ────────────────────────────────────────────────────────
await app.register(companyRoutes, { prefix: '/api/v1/companies' });
await app.register(agentRoutes, { prefix: '/api/v1/companies/:companyId/agents' });
await app.register(goalRoutes, { prefix: '/api/v1/companies/:companyId/goals' });
await app.register(ticketRoutes, { prefix: '/api/v1/companies/:companyId/tickets' });
await app.register(budgetRoutes, { prefix: '/api/v1/companies/:companyId/budgets' });
await app.register(boardRoutes, { prefix: '/api/v1/companies/:companyId/board' });
await app.register(dashboardRoutes, { prefix: '/api/v1/companies/:companyId/dashboard' });
await app.register(heartbeatRoutes, { prefix: '/api/v1/companies/:companyId/heartbeat' });

// ─── BMAD ────────────────────────────────────────────────────────────────────
await app.register(canvasRoutes, { prefix: '/api/bmad' });
await app.register(revenueRoutes, { prefix: '/api/bmad' });
await app.register(milestoneRoutes, { prefix: '/api/bmad' });
await app.register(competitiveRoutes, { prefix: '/api/bmad' });

// ─── PAUL ────────────────────────────────────────────────────────────────────
await app.register(planRoutes, { prefix: '/api/paul' });
await app.register(applyRoutes, { prefix: '/api/paul' });
await app.register(unifyRoutes, { prefix: '/api/paul' });
await app.register(criteriaRoutes, { prefix: '/api/paul' });

// ─── GStack ──────────────────────────────────────────────────────────────────
await app.register(autoplanRoutes, { prefix: '/api/gstack' });
await app.register(shipRoutes, { prefix: '/api/gstack' });
await app.register(qaRoutes, { prefix: '/api/gstack' });
await app.register(designRoutes, { prefix: '/api/gstack' });
await app.register(jobRoutes, { prefix: '/api/gstack' });

// ─── DenchClaw ───────────────────────────────────────────────────────────────
await app.register(contactRoutes, { prefix: '/api/denchclaw' });
await app.register(dealRoutes, { prefix: '/api/denchclaw' });
await app.register(leadRoutes, { prefix: '/api/denchclaw' });
await app.register(pipelineRoutes, { prefix: '/api/denchclaw' });
await app.register(sequenceRoutes, { prefix: '/api/denchclaw' });

// ─── HCOM ────────────────────────────────────────────────────────────────────
await app.register(hcomAgentRoutes, { prefix: '/api/hcom' });
await app.register(messageRoutes, { prefix: '/api/hcom' });
await app.register(collisionRoutes, { prefix: '/api/hcom' });
await app.register(lifecycleRoutes, { prefix: '/api/hcom' });
await app.register(subscriptionRoutes, { prefix: '/api/hcom' });
await app.register(hcomDashboardRoutes, { prefix: '/api/hcom' });

// ─── GBrain ──────────────────────────────────────────────────────────────────
await app.register(pageRoutes, { prefix: '/api/gbrain' });
await app.register(queryRoutes, { prefix: '/api/gbrain' });
await app.register(graphRoutes, { prefix: '/api/gbrain' });
await app.register(captureRoutes, { prefix: '/api/gbrain' });
await app.register(synthesizeRoutes, { prefix: '/api/gbrain' });

// ─── AEGIS ───────────────────────────────────────────────────────────────────
await app.register(auditRoutes, { prefix: '/api/aegis' });
await app.register(continuousRoutes, { prefix: '/api/aegis' });
await app.register(personaRoutes, { prefix: '/api/aegis' });
await app.register(summaryRoutes, { prefix: '/api/aegis' });
await app.register(transformRoutes, { prefix: '/api/aegis' });

// ─── Plannotator ─────────────────────────────────────────────────────────────
await app.register(plannotatorPlanRoutes, { prefix: '/api/plannotator' });
await app.register(annotationRoutes, { prefix: '/api/plannotator' });
await app.register(diffRoutes, { prefix: '/api/plannotator' });

// ─── Skills ──────────────────────────────────────────────────────────────────
await app.register(skillRoutes, { prefix: '/api/skills' });
await app.register(ratingRoutes, { prefix: '/api/skills' });

// ─── Static Frontend ─────────────────────────────────────────────────────────
await app.register(fastifyStatic, {
  root: path.resolve(FRONTEND_PATH),
  prefix: '/',
  wildcard: false,
});

app.setNotFoundHandler(async (request, reply) => {
  if (request.url.startsWith('/api')) {
    return reply.status(404).send({ error: 'Not Found' });
  }
  return reply.sendFile('index.html', path.resolve(FRONTEND_PATH));
});

// ─── Start ───────────────────────────────────────────────────────────────────
try {
  const address = await app.listen({ port: PORT, host: HOST });
  console.log(`✅ Aigency OS Unified Server listening at ${address}`);
  console.log(`📁 Frontend: ${path.resolve(FRONTEND_PATH)}`);
  console.log(`🔐 Auth: ${JWT_SECRET === 'dev-secret-change-me' ? 'WARNING using default JWT secret' : 'JWT configured'}`);
  const heapMB = (require('v8').getHeapStatistics().heap_size_limit / 1024 / 1024).toFixed(0);
  console.log(`💾 V8 heap limit: ${heapMB}MB`);
} catch (err) {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
}
