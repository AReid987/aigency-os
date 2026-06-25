import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });
await app.register(cors);

app.get('/health', async () => ({ status: 'ok', service: 'hcom-api' }));

// Agent registry
const agents = new Map<string, { id: string; name: string; adapter: string; status: string }>();
const messages: Array<{ id: string; senderId: string; recipientId: string | null; content: string; timestamp: string }> = [];

// Register agent
app.post('/hcom/agents', async (request, reply) => {
  const body = request.body as { name: string; adapter: string };
  const agent = { id: crypto.randomUUID(), name: body.name, adapter: body.adapter, status: 'active' };
  agents.set(agent.id, agent);
  reply.code(201).send({ ...agent, sessionId: `tmux:${agents.size - 1}` });
});

// Send message
app.post('/hcom/agents/:id/message', async (request, reply) => {
  const body = request.body as { recipientId: string | null; content: string; intent: string };
  const message = {
    id: crypto.randomUUID(),
    senderId: (request.params as { id: string }).id,
    recipientId: body.recipientId,
    content: body.content,
    timestamp: new Date().toISOString(),
  };
  messages.push(message);
  reply.code(201).send({ ...message, deliveryStatus: 'delivered' });
});

// Get agent status
app.get('/hcom/agents/:id/status', async (request) => {
  const { id } = request.params as { id: string };
  return agents.get(id) ?? { error: 'Agent not found' };
});

// Dashboard data
app.get('/hcom/dashboard', async () => {
  return {
    agents: Array.from(agents.values()),
    messages: messages.slice(-50),
    collisions: [],
  };
});

const port = Number(process.env.PORT) || 3004;
app.listen({ port, host: '0.0.0.0' }).then((address) => {
  app.log.info(`HCOM API listening at ${address}`);
});
