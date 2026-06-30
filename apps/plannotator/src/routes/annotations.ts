import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreateAnnotationSchema } from '../schemas.js';

export async function annotationRoutes(app: FastifyInstance) {
  // POST /api/v1/plans/:id/annotations — add annotation to a plan
  app.post('/api/v1/plans/:id/annotations', async (request, reply) => {
    const { id } = request.params as { id: string };

    const parsed = CreateAnnotationSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const annotation = store.addAnnotation(id, parsed.data);
    if (!annotation) {
      return reply.code(404).send({ error: 'Plan not found' });
    }

    return reply.code(201).send(annotation);
  });

  // GET /api/v1/plans/:id/annotations — get annotations for a plan
  app.get('/api/v1/plans/:id/annotations', async (request, reply) => {
    const { id } = request.params as { id: string };

    const plan = store.getPlan(id);
    if (!plan) {
      return reply.code(404).send({ error: 'Plan not found' });
    }

    const annotations = store.getAnnotations(id);
    return { annotations };
  });
}
