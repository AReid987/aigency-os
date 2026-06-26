import Fastify from 'fastify';
import cors from '@fastify/cors';
import { store } from './store.js';
import { planRoutes } from './routes/plans.js';
import { annotationRoutes } from './routes/annotations.js';
import { diffRoutes } from './routes/diffs.js';

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────
await app.register(cors);

// ─── Health Check ───────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'plannotator',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
}));

// ─── Register Route Modules ─────────────────────────────────────────────
await app.register(planRoutes);
await app.register(annotationRoutes);
await app.register(diffRoutes);

// ─── Seed Demo Data ─────────────────────────────────────────────────────
store.seed();
app.log.info('Seeded 2 demo plans');

// ─── Start Server ───────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3013;

try {
  const address = await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`Plannotator listening at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
