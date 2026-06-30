import Fastify from 'fastify';
import cors from '@fastify/cors';
import { companyRoutes } from './routes/companies.js';
import { agentRoutes } from './routes/agents.js';
import { goalRoutes } from './routes/goals.js';
import { ticketRoutes } from './routes/tickets.js';
import { budgetRoutes } from './routes/budgets.js';
import { heartbeatRoutes } from './routes/heartbeat.js';
import { boardRoutes } from './routes/board.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { authRoutes } from './routes/auth.js';
import { registerMetrics } from '@vscp/shared-types/metrics-helper';

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────
await app.register(cors);

// ─── Health Check ───────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'paperclip-api',
  version: '0.1.0',
  timestamp: new Date().toISOString(),
}));

// ─── Metrics ────────────────────────────────────────────────────────────
registerMetrics(app, 'paperclip-api');

// ─── Register Route Modules ─────────────────────────────────────────────
await app.register(companyRoutes);
await app.register(agentRoutes);
await app.register(goalRoutes);
await app.register(ticketRoutes);
await app.register(budgetRoutes);
await app.register(heartbeatRoutes);
await app.register(boardRoutes);
await app.register(dashboardRoutes);
await app.register(authRoutes);

// ─── Start Server ───────────────────────────────────────────────────────
const port = Number(process.env.PORT) || 3001;

try {
  const address = await app.listen({ port, host: '0.0.0.0' });
  app.log.info(`Paperclip API listening at ${address}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
