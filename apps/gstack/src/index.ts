import Fastify from 'fastify';
import cors from '@fastify/cors';
import { autoplanRoutes } from './routes/autoplan.js';
import { shipRoutes } from './routes/ship.js';
import { qaRoutes } from './routes/qa.js';
import { designRoutes } from './routes/design.js';
import { jobRoutes } from './routes/jobs.js';
import { registerMetrics } from '@vscp/shared-types/metrics-helper';

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────
await app.register(cors);

// ─── Health Check ───────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'gstack',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
}));

// ─── Metrics ────────────────────────────────────────────────────────────
registerMetrics(app, 'gstack');

// ─── Register Route Modules ─────────────────────────────────────────────
await app.register(autoplanRoutes);
await app.register(shipRoutes);
await app.register(qaRoutes);
await app.register(designRoutes);
await app.register(jobRoutes);

// ─── Start Server ───────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3012;

try {
  const address = await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`Gstack (Build Skill Orchestrator) listening at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}

export { app };
