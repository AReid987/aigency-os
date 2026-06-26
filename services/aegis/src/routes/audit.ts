import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreateAuditSchema } from '../schemas.js';

export async function auditRoutes(app: FastifyInstance) {
  // POST /api/v1/audit — create audit
  app.post('/api/v1/audit', async (request, reply) => {
    const parsed = CreateAuditSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const audit = store.createAudit(parsed.data);
    return reply.code(201).send(audit);
  });

  // GET /api/v1/audit — list audits
  app.get('/api/v1/audit', async () => {
    return { audits: store.listAudits() };
  });

  // GET /api/v1/audit/:id — get audit by id
  app.get('/api/v1/audit/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const audit = store.getAudit(id);
    if (!audit) {
      return reply.code(404).send({ error: 'Audit not found' });
    }
    return audit;
  });
}
