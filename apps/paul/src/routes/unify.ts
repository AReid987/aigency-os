import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';

export async function unifyRoutes(app: FastifyInstance) {
  // POST /api/v1/plan/:id/unify — generate TECH-SPEC from plan
  app.post('/api/v1/plan/:id/unify', async (request, reply) => {
    const { id } = request.params as { id: string };
    const techSpec = store.unifyPlan(id);
    if (!techSpec) {
      return reply.code(404).send({ error: 'Plan not found' });
    }
    return techSpec;
  });
}
