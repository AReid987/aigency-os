import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });
await app.register(cors);

app.get('/health', async () => ({ status: 'ok', service: 'paperclip-api' }));

// Company CRUD
app.post('/api/v1/companies', async (request, reply) => {
  const body = request.body as { name: string; mission: string; goal: string };
  const company = {
    id: crypto.randomUUID(),
    name: body.name,
    mission: body.mission,
    goals: [{ id: crypto.randomUUID(), title: body.goal, status: 'backlog' as const }],
    agents: [],
    createdAt: new Date().toISOString(),
  };
  reply.code(201).send(company);
});

app.get('/api/v1/companies/:id', async (request, reply) => {
  const { id } = request.params as { id: string };
  reply.send({ id, name: 'Demo Company', mission: 'Demo mission', agents: [], goals: [] });
});

// Agent CRUD
app.post('/api/v1/companies/:id/agents', async (request, reply) => {
  const body = request.body as { name: string; role: string; budget: number };
  reply.code(201).send({ id: crypto.randomUUID(), ...body, status: 'active', budgetSpent: 0 });
});

// Tickets
app.post('/api/v1/companies/:id/tickets', async (request, reply) => {
  const body = request.body as { title: string; description: string; assigneeId: string };
  reply.code(201).send({ id: crypto.randomUUID(), ...body, status: 'backlog', comments: [] });
});

// Budget
app.get('/api/v1/companies/:id/budget', async () => {
  return { total: 240, spent: 0, perAgent: {} };
});

const port = Number(process.env.PORT) || 3001;
app.listen({ port, host: '0.0.0.0' }).then((address) => {
  app.log.info(`Paperclip API listening at ${address}`);
});
