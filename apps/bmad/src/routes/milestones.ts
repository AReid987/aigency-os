import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreateMilestoneSchema, UpdateGateStatusSchema } from '../schemas.js';

export async function milestoneRoutes(app: FastifyInstance) {
  // POST /api/v1/milestones — create milestone
  app.post('/api/v1/milestones', async (request, reply) => {
    const parsed = CreateMilestoneSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const milestone = store.createMilestone(parsed.data);
    if (!milestone) {
      return reply.code(404).send({ error: 'Canvas not found' });
    }

    return reply.code(201).send(milestone);
  });

  // GET /api/v1/milestones — list all milestones
  app.get('/api/v1/milestones', async () => {
    return { milestones: Array.from(store.milestones.values()) };
  });

  // PATCH /api/v1/milestones/:id/gate — update gate status
  app.patch('/api/v1/milestones/:id/gate', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = UpdateGateStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const milestone = store.updateGateStatus(id, parsed.data.gateStatus);
    if (!milestone) {
      return reply.code(404).send({ error: 'Milestone not found' });
    }

    return milestone;
  });
}
