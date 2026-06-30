import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { AutoplanSchema } from '../schemas.js';

export async function autoplanRoutes(app: FastifyInstance) {
  // POST /api/v1/autoplan — create build job from spec
  app.post('/api/v1/autoplan', async (request, reply) => {
    const parsed = AutoplanSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const job = store.createJob({
      type: 'autoplan',
      spec: parsed.data.spec,
      skills: parsed.data.skills,
    });

    // Simulate planning phase
    store.updateJobStatus(job.id, 'planning');

    return reply.code(201).send({
      jobId: job.id,
      status: job.status,
      spec: job.spec,
      skills: job.skills,
      createdAt: job.createdAt,
    });
  });
}
