import Fastify from 'fastify';
import cors from '@fastify/cors';
import { store } from './store.js';
import { contactRoutes } from './routes/contacts.js';
import { dealRoutes } from './routes/deals.js';
import { sequenceRoutes } from './routes/sequences.js';
import { leadRoutes } from './routes/leads.js';
import { pipelineRoutes } from './routes/pipeline.js';

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────
await app.register(cors);

// ─── Health Check ───────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'denchclaw',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
}));

// ─── Register Route Modules ─────────────────────────────────────────────
await app.register(contactRoutes);
await app.register(dealRoutes);
await app.register(sequenceRoutes);
await app.register(leadRoutes);
await app.register(pipelineRoutes);

// ─── Seed Demo Data ─────────────────────────────────────────────────────
store.seed();
app.log.info('Seeded 5 demo contacts and 3 demo deals');

// ─── Start Server ───────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3015;

try {
  const address = await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`DenchClaw CRM listening at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
