import Fastify from 'fastify';
import cors from '@fastify/cors';
import { planRoutes } from './routes/plan.js';
import { applyRoutes } from './routes/apply.js';
import { unifyRoutes } from './routes/unify.js';
import { criteriaRoutes } from './routes/criteria.js';
import { registerMetrics } from '@vscp/shared-types/metrics-helper';

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────
await app.register(cors);

// ─── Health Check ───────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'paul',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
}));

// ─── Metrics ────────────────────────────────────────────────────────────
registerMetrics(app, 'paul');

// ─── Register Route Modules ─────────────────────────────────────────────
await app.register(planRoutes);
await app.register(applyRoutes);
await app.register(unifyRoutes);
await app.register(criteriaRoutes);

// ─── Start Server ───────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3011;

try {
  const address = await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`PAUL listening at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
