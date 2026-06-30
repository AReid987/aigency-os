import Fastify from 'fastify';
import cors from '@fastify/cors';
import { auditRoutes } from './routes/audit.js';
import { transformRoutes } from './routes/transform.js';
import { summaryRoutes } from './routes/summary.js';
import { personaRoutes } from './routes/personas.js';
import { continuousRoutes } from './routes/continuous.js';
import { registerMetrics } from '@aigency-os/shared-types/metrics-helper';

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────
await app.register(cors);

// ─── Health Check ───────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'aegis',
  version: '0.1.0',
  description: 'Quality Gates Engine',
  timestamp: new Date().toISOString(),
}));

// ─── Metrics ────────────────────────────────────────────────────────────
registerMetrics(app, 'aegis');

// ─── Register Route Modules ─────────────────────────────────────────────
await app.register(auditRoutes);
await app.register(transformRoutes);
await app.register(summaryRoutes);
await app.register(personaRoutes);
await app.register(continuousRoutes);

// ─── Start Server ───────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3014;

try {
  const address = await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`AEGIS listening at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
