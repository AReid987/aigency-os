import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreateSequenceSchema } from '../schemas.js';

export async function sequenceRoutes(app: FastifyInstance) {
  // POST /api/v1/sequences — create sequence
  app.post('/api/v1/sequences', async (request, reply) => {
    const parsed = CreateSequenceSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const sequence = store.createSequence(parsed.data);
    return reply.code(201).send(sequence);
  });

  // GET /api/v1/sequences — list all sequences
  app.get('/api/v1/sequences', async () => {
    return { sequences: store.listSequences() };
  });

  // GET /api/v1/sequences/:id — get sequence by id
  app.get('/api/v1/sequences/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const sequence = store.getSequence(id);
    if (!sequence) {
      return reply.code(404).send({ error: 'Sequence not found' });
    }
    return sequence;
  });

  // DELETE /api/v1/sequences/:id — delete sequence
  app.delete('/api/v1/sequences/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = store.deleteSequence(id);
    if (!deleted) {
      return reply.code(404).send({ error: 'Sequence not found' });
    }
    return reply.code(204).send();
  });
}
