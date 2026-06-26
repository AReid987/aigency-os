import Fastify from 'fastify';
import cors from '@fastify/cors';
import { canvasRoutes } from './routes/canvas.js';
import { revenueRoutes } from './routes/revenue.js';
import { milestoneRoutes } from './routes/milestones.js';
import { competitiveRoutes } from './routes/competitive.js';

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────
await app.register(cors);

// ─── Health Check ───────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'bmad',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
}));

// ─── Register Route Modules ─────────────────────────────────────────────
await app.register(canvasRoutes);
await app.register(revenueRoutes);
await app.register(milestoneRoutes);
await app.register(competitiveRoutes);

// ─── Start Server ───────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3010;

try {
  const address = await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`BMAD API listening at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
