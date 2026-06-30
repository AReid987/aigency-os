import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { QASchema } from '../schemas.js';

export async function qaRoutes(app: FastifyInstance) {
  // POST /api/v1/qa — run QA on a build
  app.post('/api/v1/qa', async (request, reply) => {
    const parsed = QASchema.safeParse(request.body);
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
      store.updateJobStatus(job.id, 'qa');
    } else {
      job = store.createJob({
        type: 'qa',
        spec: parsed.data.spec,
        skills: parsed.data.skills,
      });
      store.updateJobStatus(job.id, 'qa');
    }

    return reply.code(201).send({
      jobId: job.id,
      status: 'qa',
      spec: parsed.data.spec,
      criteria: parsed.data.criteria,
      updatedAt: job.updatedAt,
    });
  });
}
