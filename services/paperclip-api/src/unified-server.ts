import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from '@fastify/jwt';

// ─── Auth & Core (Paperclip) ─────────────────────────────────────────────────
import { authRoutes } from './routes/auth.js';
import { companyRoutes } from './routes/companies.js';
import { agentRoutes } from './routes/agents.js';
import { goalRoutes } from './routes/goals.js';
import { ticketRoutes } from './routes/tickets.js';
import { budgetRoutes } from './routes/budgets.js';
import { boardRoutes } from './routes/board.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { heartbeatRoutes } from './routes/heartbeat.js';

// ─── BMAD (Business Model / Revenue) ───────────────────────────────────────
import { canvasRoutes } from '../../bmad/src/routes/canvas.js';
import { revenueRoutes } from '../../bmad/src/routes/revenue.js';
import { milestoneRoutes } from '../../bmad/src/routes/milestones.js';
import { competitiveRoutes } from '../../bmad/src/routes/competitive.js';

// ─── PAUL (Plan / Apply / Unify) ────────────────────────────────────────────
import { planRoutes } from '../../paul/src/routes/plan.js';
import { applyRoutes } from '../../paul/src/routes/apply.js';
import { unifyRoutes } from '../../paul/src/routes/unify.js';
import { criteriaRoutes } from '../../paul/src/routes/criteria.js';

// ─── GStack (Build / Ship / QA) ────────────────────────────────────────────
import { autoplanRoutes } from '../../gstack/src/routes/autoplan.js';
import { shipRoutes } from '../../gstack/src/routes/ship.js';
import { qaRoutes } from '../../gstack/src/routes/qa.js';
import { designRoutes } from '../../gstack/src/routes/design.js';
import { jobRoutes } from '../../gstack/src/routes/jobs.js';

// ─── DenchClaw (CRM) ───────────────────────────────────────────────────────
import { contactRoutes } from '../../denchclaw/src/routes/contacts.js';
import { dealRoutes } from '../../denchclaw/src/routes/deals.js';
import { leadRoutes } from '../../denchclaw/src/routes/leads.js';
import { pipelineRoutes } from '../../denchclaw/src/routes/pipeline.js';
import { sequenceRoutes } from '../../denchclaw/src/routes/sequences.js';

// ─── HCOM (Agent Communication) ──────────────────────────────────────────────
import { agentRoutes as hcomAgentRoutes } from '../../hcom-api/src/routes/agents.js';
import { messageRoutes } from '../../hcom-api/src/routes/messages.js';
import { collisionRoutes } from '../../hcom-api/src/routes/collisions.js';
import { lifecycleRoutes } from '../../hcom-api/src/routes/lifecycle.js';
import { subscriptionRoutes } from '../../hcom-api/src/routes/subscriptions.js';
import { dashboardRoutes as hcomDashboardRoutes } from '../../hcom-api/src/routes/dashboard.js';

// ─── GBrain (Knowledge) ────────────────────────────────────────────────────
import { pageRoutes } from '../../gbrain/src/routes/pages.js';
import { queryRoutes } from '../../gbrain/src/routes/query.js';
import { graphRoutes } from '../../gbrain/src/routes/graph.js';
import { captureRoutes } from '../../gbrain/src/routes/capture.js';
import { synthesizeRoutes } from '../../gbrain/src/routes/synthesize.js';

// ─── AEGIS (Quality / Audit) ─────────────────────────────────────────────────
import { auditRoutes } from '../../aegis/src/routes/audit.js';
import { continuousRoutes } from '../../aegis/src/routes/continuous.js';
import { personaRoutes } from '../../aegis/src/routes/personas.js';
import { summaryRoutes } from '../../aegis/src/routes/summary.js';
import { transformRoutes } from '../../aegis/src/routes/transform.js';

// ─── Plannotator ────────────────────────────────────────────────────────────
import { planRoutes as plannotatorPlanRoutes } from '../../plannotator/src/routes/plans.js';
import { annotationRoutes } from '../../plannotator/src/routes/annotations.js';
import { diffRoutes } from '../../plannotator/src/routes/diffs.js';

// ─── Skills ──────────────────────────────────────────────────────────────────
import { skillRoutes } from '../../skills/src/routes/skills.js';
import { ratingRoutes } from '../../skills/src/routes/ratings.js';

// ─── Environment ─────────────────────────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const FRONTEND_PATH = process.env.FRONTEND_PATH || path.resolve(__dirname, '../../web/dist');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aigency.os';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Antonio Reid';
const LOG_LEVEL = process.env.LOG_LEVEL || 'warn';

// ─── Build App ───────────────────────────────────────────────────────────────
const app = Fastify({
  logger: {
    level: LOG_LEVEL,
  },
});

// CORS
await app.register(cors, { origin: CORS_ORIGIN });

// JWT
await app.register(jwt, { secret: JWT_SECRET });

// Health check
app.get('/health', async () => ({ status: 'ok', service: 'aigency-os', version: '0.3.0', timestamp: new Date().toISOString() }));

// ─── Auth (no prefix — keeps backward compatibility) ─────────────────────────
await app.register(authRoutes);

// ─── Paperclip API (core business logic) ────────────────────────────────────
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

// ─── DenchClaw (CRM) ─────────────────────────────────────────────────────────
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

// ─── Static Frontend (SPA fallback) ──────────────────────────────────────────
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
  app.log.info(`Aigency OS Unified Server listening at ${address}`);
  app.log.info(`Serving frontend from: ${path.resolve(FRONTEND_PATH)}`);
  app.log.info(`Memory limit: ${(require('v8').getHeapStatistics().heap_size_limit / 1024 / 1024).toFixed(0)}MB`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
