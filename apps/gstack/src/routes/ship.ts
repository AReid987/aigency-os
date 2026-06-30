import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { ShipSchema } from '../schemas.js';

export async function shipRoutes(app: FastifyInstance) {
  // POST /api/v1/ship — ship a build
  app.post('/api/v1/ship', async (request, reply) => {
    const parsed = ShipSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    // If a jobId is provided, update it; otherwise create a new job
    let job;
    if (parsed.data.jobId) {
      job = store.getJob(parsed.data.jobId);
      if (!job) {
        return reply.code(404).send({ error: 'Job not found' });
      }
      store.updateJobStatus(job.id, 'shipping');
    } else {
      job = store.createJob({
        type: 'ship',
        spec: parsed.data.spec,
        skills: parsed.data.skills,
      });
      store.updateJobStatus(job.id, 'shipping');
    }

    return reply.code(201).send({
      jobId: job.id,
      status: 'shipping',
      target: parsed.data.target,
      spec: parsed.data.spec,
      updatedAt: job.updatedAt,
    });
  });
}
