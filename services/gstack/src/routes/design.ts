import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { DesignSchema } from '../schemas.js';

export async function designRoutes(app: FastifyInstance) {
  // POST /api/v1/design — create a design job
  app.post('/api/v1/design', async (request, reply) => {
    const parsed = DesignSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const job = store.createJob({
      type: 'design',
      spec: parsed.data.spec,
      skills: parsed.data.skills,
    });

    store.updateJobStatus(job.id, 'in_progress');

    return reply.code(201).send({
      jobId: job.id,
      status: job.status,
      spec: parsed.data.spec,
      style: parsed.data.style ?? null,
      createdAt: job.createdAt,
    });
  });
}
