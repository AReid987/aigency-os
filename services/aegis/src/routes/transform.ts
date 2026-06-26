import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { TransformSchema } from '../schemas.js';

export async function transformRoutes(app: FastifyInstance) {
  // POST /api/v1/transform — audit → PAUL remediation plan
  app.post('/api/v1/transform', async (request, reply) => {
    const parsed = TransformSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const plan = store.transformToRemediation(parsed.data.auditId);
    if (!plan) {
      return reply.code(404).send({ error: 'Audit not found' });
    }

    return reply.code(201).send(plan);
  });
}
