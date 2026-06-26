import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { AddPersonaEvaluationSchema } from '../schemas.js';

export async function personaRoutes(app: FastifyInstance) {
  // POST /api/v1/audit/:id/personas — add persona evaluation
  app.post('/api/v1/audit/:id/personas', async (request, reply) => {
    const { id } = request.params as { id: string };

    const parsed = AddPersonaEvaluationSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const evaluation = store.addPersonaEvaluation(id, parsed.data);
    if (!evaluation) {
      return reply.code(404).send({ error: 'Audit not found' });
    }

    return reply.code(201).send(evaluation);
  });
}
