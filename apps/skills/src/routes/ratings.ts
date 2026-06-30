import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { RateSkillSchema } from '../schemas.js';

export async function ratingRoutes(app: FastifyInstance) {
  // POST /api/v1/skills/:id/rate — rate a skill
  app.post('/api/v1/skills/:id/rate', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = RateSkillSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const rating = store.rateSkill(id, parsed.data);
    if (!rating) {
      return reply.code(404).send({ error: 'Skill not found' });
    }
    return reply.code(201).send(rating);
  });
}
