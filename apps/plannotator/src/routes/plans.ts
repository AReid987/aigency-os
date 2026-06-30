import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreatePlanSchema } from '../schemas.js';

export async function planRoutes(app: FastifyInstance) {
  // GET /api/v1/plans — list plans, filter by source
  app.get('/api/v1/plans', async (request) => {
    const { source } = request.query as { source?: string };
    const plans = store.listPlans(source ? { source } : undefined);
    return { plans };
  });

  // GET /api/v1/plans/:id — get plan with RBAC section filtering
  app.get('/api/v1/plans/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { role } = request.query as { role?: string };

    const plan = store.getPlan(id, role);
    if (!plan) {
      return reply.code(404).send({ error: 'Plan not found' });
    }
    return plan;
  });

  // POST /api/v1/plans — create a new plan
  app.post('/api/v1/plans', async (request, reply) => {
    const parsed = CreatePlanSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const plan = store.createPlan(parsed.data);
    return reply.code(201).send(plan);
  });
}
