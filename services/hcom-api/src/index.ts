import Fastify from 'fastify';
import cors from '@fastify/cors';
import { agentRoutes } from './routes/agents.js';
import { messageRoutes } from './routes/messages.js';
import { collisionRoutes } from './routes/collisions.js';
import { lifecycleRoutes } from './routes/lifecycle.js';
import { subscriptionRoutes } from './routes/subscriptions.js';
import { dashboardRoutes } from './routes/dashboard.js';

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL ?? 'info',
  },
});

await app.register(cors);

// Health check
app.get('/health', async () => ({
  status: 'ok',
  service: 'hcom-api',
  timestamp: new Date().toISOString(),
}));

// Register all route modules
await app.register(agentRoutes);
await app.register(messageRoutes);
await app.register(collisionRoutes);
await app.register(lifecycleRoutes);
await app.register(subscriptionRoutes);
await app.register(dashboardRoutes);

// Graceful shutdown
const shutdown = async () => {
  app.log.info('Shutting down HCOM API...');
  await app.close();
  process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

const port = Number(process.env.PORT) || 3004;
app.listen({ port, host: '0.0.0.0' }).then((address) => {
  app.log.info(`HCOM API listening at ${address}`);
});
