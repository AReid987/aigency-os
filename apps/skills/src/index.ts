import Fastify from 'fastify';
import cors from '@fastify/cors';
import { store } from './store.js';
import { skillRoutes } from './routes/skills.js';
import { ratingRoutes } from './routes/ratings.js';
import { registerMetrics } from '@aigency-os/shared-types/metrics-helper';

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────
await app.register(cors);

// ─── Health Check ───────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'skills',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
}));

// ─── Metrics ────────────────────────────────────────────────────────────
registerMetrics(app, 'skills');

// ─── Register Route Modules ─────────────────────────────────────────────
await app.register(skillRoutes);
await app.register(ratingRoutes);

// ─── Seed Demo Data ─────────────────────────────────────────────────────
store.seed();
app.log.info('Seeded 5 demo marketplace skills');

// ─── Start Server ───────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3017;

try {
  const address = await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`Skills Marketplace listening at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
