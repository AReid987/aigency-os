import Fastify from 'fastify';
import cors from '@fastify/cors';
import { store } from './store.js';
import { pageRoutes } from './routes/pages.js';
import { queryRoutes } from './routes/query.js';
import { graphRoutes } from './routes/graph.js';
import { captureRoutes } from './routes/capture.js';
import { synthesizeRoutes } from './routes/synthesize.js';
import { registerMetrics } from '@vscp/shared-types/metrics-helper';

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────
await app.register(cors);

// ─── Health Check ───────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'gbrain',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
}));

// ─── Metrics ────────────────────────────────────────────────────────────
registerMetrics(app, 'gbrain');

// ─── Register Route Modules ─────────────────────────────────────────────
await app.register(pageRoutes);
await app.register(queryRoutes);
await app.register(graphRoutes);
await app.register(captureRoutes);
await app.register(synthesizeRoutes);

// ─── Seed Demo Data ─────────────────────────────────────────────────────
store.seed();
app.log.info('Seeded 5 demo knowledge pages');

// ─── Start Server ───────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3016;

try {
  const address = await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`Gbrain service listening at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
