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
const FRONTEND_PATH = process.env.FRONTEND_PATH || path.resolve(__root, '../web/dist');
const LOG_LEVEL = process.env.LOG_LEVEL || 'warn';

// ─── Load Compiled Service Modules ───────────────────────────────────────────
// All services must be built first (pnpm build:all).

const { authRoutes } = await import('../paperclip-api/dist/routes/auth.js');
const { companyRoutes } = await import('../paperclip-api/dist/routes/companies.js');
const { agentRoutes } = await import('../paperclip-api/dist/routes/agents.js');
const { goalRoutes } = await import('../paperclip-api/dist/routes/goals.js');
const { ticketRoutes } = await import('../paperclip-api/dist/routes/tickets.js');
const { budgetRoutes } = await import('../paperclip-api/dist/routes/budgets.js');
const { boardRoutes } = await import('../paperclip-api/dist/routes/board.js');
const { dashboardRoutes } = await import('../paperclip-api/dist/routes/dashboard.js');
const { heartbeatRoutes } = await import('../paperclip-api/dist/routes/heartbeat.js');

const { canvasRoutes } = await import('../bmad/dist/routes/canvas.js');
const { revenueRoutes } = await import('../bmad/dist/routes/revenue.js');
const { milestoneRoutes } = await import('../bmad/dist/routes/milestones.js');
const { competitiveRoutes } = await import('../bmad/dist/routes/competitive.js');

const { planRoutes } = await import('../paul/dist/routes/plan.js');
const { applyRoutes } = await import('../paul/dist/routes/apply.js');
const { unifyRoutes } = await import('../paul/dist/routes/unify.js');
const { criteriaRoutes } = await import('../paul/dist/routes/criteria.js');

const { autoplanRoutes } = await import('../gstack/dist/routes/autoplan.js');
const { shipRoutes } = await import('../gstack/dist/routes/ship.js');
const { qaRoutes } = await import('../gstack/dist/routes/qa.js');
const { designRoutes } = await import('../gstack/dist/routes/design.js');
const { jobRoutes } = await import('../gstack/dist/routes/jobs.js');

const { contactRoutes } = await import('../denchclaw/dist/routes/contacts.js');
const { dealRoutes } = await import('../denchclaw/dist/routes/deals.js');
const { leadRoutes } = await import('../denchclaw/dist/routes/leads.js');
const { pipelineRoutes } = await import('../denchclaw/dist/routes/pipeline.js');
const { sequenceRoutes } = await import('../denchclaw/dist/routes/sequences.js');

const { agentRoutes: hcomAgentRoutes } = await import('../hcom-api/dist/routes/agents.js');
const { messageRoutes } = await import('../hcom-api/dist/routes/messages.js');
const { collisionRoutes } = await import('../hcom-api/dist/routes/collisions.js');
const { lifecycleRoutes } = await import('../hcom-api/dist/routes/lifecycle.js');
const { subscriptionRoutes } = await import('../hcom-api/dist/routes/subscriptions.js');
const { dashboardRoutes: hcomDashboardRoutes } = await import('../hcom-api/dist/routes/dashboard.js');

const { pageRoutes } = await import('../gbrain/dist/routes/pages.js');
const { queryRoutes } = await import('../gbrain/dist/routes/query.js');
const { graphRoutes } = await import('../gbrain/dist/routes/graph.js');
const { captureRoutes } = await import('../gbrain/dist/routes/capture.js');
const { synthesizeRoutes } = await import('../gbrain/dist/routes/synthesize.js');

const { auditRoutes } = await import('../aegis/dist/routes/audit.js');
const { continuousRoutes } = await import('../aegis/dist/routes/continuous.js');
const { personaRoutes } = await import('../aegis/dist/routes/personas.js');
const { summaryRoutes } = await import('../aegis/dist/routes/summary.js');
const { transformRoutes } = await import('../aegis/dist/routes/transform.js');

const { planRoutes: plannotatorPlanRoutes } = await import('../plannotator/dist/routes/plans.js');
const { annotationRoutes } = await import('../plannotator/dist/routes/annotations.js');
const { diffRoutes } = await import('../plannotator/dist/routes/diffs.js');

const { skillRoutes } = await import('../skills/dist/routes/skills.js');
const { ratingRoutes } = await import('../skills/dist/routes/ratings.js');

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

// ─── Presence (in-memory) ───────────────────────────────────────────────────
const presenceMap = new Map(); // userId -> { id, name, lastSeen }

// Heartbeat — called by clients every 15s
app.post('/presence/heartbeat', async (request, reply) => {
  try {
    const decoded = await request.jwtVerify();
    const userId = decoded.sub || decoded.id;
    const userName = decoded.name || decoded.email || 'Unknown';
    presenceMap.set(userId, { id: userId, name: userName, lastSeen: Date.now() });
    return { ok: true };
  } catch {
    return reply.code(401).send({ error: 'Unauthorized' });
  }
});

// Get online users — returns users who heartbeat in last 60s
app.get('/presence/online', async () => {
  const cutoff = Date.now() - 60_000;
  const online = [];
  for (const [id, data] of presenceMap) {
    if (data.lastSeen > cutoff) {
      online.push({ id, name: data.name });
    } else {
      presenceMap.delete(id);
    }
  }
  return online;
});

// ─── Auth (backward compatible paths) ──────────────────────────────────────
await app.register(authRoutes);

// ─── Paperclip (Core) ────────────────────────────────────────────────────────
await app.register(companyRoutes);
await app.register(agentRoutes);
await app.register(goalRoutes);
await app.register(ticketRoutes);
await app.register(budgetRoutes);
await app.register(boardRoutes);
await app.register(dashboardRoutes);
await app.register(heartbeatRoutes);

// ─── BMAD ────────────────────────────────────────────────────────────────────
await app.register(canvasRoutes);
await app.register(revenueRoutes);
await app.register(milestoneRoutes);
await app.register(competitiveRoutes);

// ─── PAUL ────────────────────────────────────────────────────────────────────
await app.register(planRoutes);
await app.register(applyRoutes);
await app.register(unifyRoutes);
await app.register(criteriaRoutes);

// ─── GStack ──────────────────────────────────────────────────────────────────
await app.register(autoplanRoutes);
await app.register(shipRoutes);
await app.register(qaRoutes);
await app.register(designRoutes);
await app.register(jobRoutes);

// ─── DenchClaw ───────────────────────────────────────────────────────────────
await app.register(contactRoutes);
await app.register(dealRoutes);
await app.register(leadRoutes);
await app.register(pipelineRoutes);
await app.register(sequenceRoutes);

// ─── HCOM ────────────────────────────────────────────────────────────────────
await app.register(hcomAgentRoutes);
await app.register(messageRoutes);
await app.register(collisionRoutes);
await app.register(lifecycleRoutes);
await app.register(subscriptionRoutes);
await app.register(hcomDashboardRoutes);

// ─── GBrain ──────────────────────────────────────────────────────────────────
await app.register(pageRoutes);
await app.register(queryRoutes);
await app.register(graphRoutes);
await app.register(captureRoutes);
await app.register(synthesizeRoutes);

// ─── AEGIS ───────────────────────────────────────────────────────────────────
await app.register(auditRoutes);
await app.register(continuousRoutes);
await app.register(personaRoutes);
await app.register(summaryRoutes);
await app.register(transformRoutes);

// ─── Plannotator ─────────────────────────────────────────────────────────────
await app.register(plannotatorPlanRoutes);
await app.register(annotationRoutes);
await app.register(diffRoutes);

// ─── Skills ──────────────────────────────────────────────────────────────────
await app.register(skillRoutes);
await app.register(ratingRoutes);

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
  const v8 = await import('node:v8');
  const heapMB = (v8.getHeapStatistics().heap_size_limit / 1024 / 1024).toFixed(0);
  console.log(`💾 V8 heap limit: ${heapMB}MB`);
} catch (err) {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
}
