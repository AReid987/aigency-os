// ─── Production Server ──────────────────────────────────────────────────────
// Serves both the API (Fastify) and the built frontend (static files).
// Single process, single port — easy to deploy anywhere.

import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import cors from '@fastify/cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { companyRoutes } from './routes/companies.js';
import { agentRoutes } from './routes/agents.js';
import { goalRoutes } from './routes/goals.js';
import { ticketRoutes } from './routes/tickets.js';
import { budgetRoutes } from './routes/budgets.js';
import { heartbeatRoutes } from './routes/heartbeat.js';
import { boardRoutes } from './routes/board.js';
import { dashboardRoutes } from './routes/dashboard.js';
import { authRoutes, authMiddleware } from './routes/auth.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const FRONTEND_PATH = process.env.FRONTEND_PATH || path.join(__dirname, '..', '..', '..', 'apps', 'web', 'dist');

const app = Fastify({ logger: true });

// ─── CORS ───────────────────────────────────────────────────────────────────
await app.register(cors, {
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
});

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/health', async () => ({
  status: 'ok',
  service: 'aigency-os',
  version: '0.2.0',
  timestamp: new Date().toISOString(),
}));

// ─── API Routes ─────────────────────────────────────────────────────────────
await app.register(authRoutes);

// Protected routes
await app.register(async (protectedApp) => {
  protectedApp.addHook('preHandler', authMiddleware);
  await protectedApp.register(companyRoutes);
  await protectedApp.register(agentRoutes);
  await protectedApp.register(goalRoutes);
  await protectedApp.register(ticketRoutes);
  await protectedApp.register(budgetRoutes);
  await protectedApp.register(heartbeatRoutes);
  await protectedApp.register(boardRoutes);
  await protectedApp.register(dashboardRoutes);
});

// ─── Static Frontend ────────────────────────────────────────────────────────
try {
  await app.register(fastifyStatic, {
    root: path.resolve(FRONTEND_PATH),
    prefix: '/',
    wildcard: false,
  });

  // SPA fallback — serve index.html for all non-API routes
  app.setNotFoundHandler(async (request, reply) => {
    if (request.url.startsWith('/api/') || request.url.startsWith('/auth/') || request.url.startsWith('/health')) {
      return reply.code(404).send({ error: 'Not found' });
    }
    return reply.sendFile('index.html');
  });

  app.log.info(`Serving frontend from: ${FRONTEND_PATH}`);
} catch (err) {
  app.log.warn(`Frontend not found at ${FRONTEND_PATH} — API-only mode`);
}

// ─── Start ──────────────────────────────────────────────────────────────────
try {
  const address = await app.listen({ port: PORT, host: HOST });
  app.log.info(`Aigency OS listening at ${address}`);
  app.log.info(`Admin login: ${process.env.ADMIN_EMAIL || 'admin@aigency.os'}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
