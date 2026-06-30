import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { BoardApprovalSchema } from '../schemas.js';

export async function boardRoutes(app: FastifyInstance) {
  // POST /api/v1/companies/:companyId/board/approve — submit/reject/approve decision
  app.post('/api/v1/companies/:companyId/board/approve', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const parsed = BoardApprovalSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const decision = store.submitDecision(companyId, parsed.data);
    if (!decision) {
      return reply.code(404).send({ error: 'Company not found' });
    }

    const nextSteps = decision.status === 'approved'
      ? `Decision ${decision.decisionType} approved. Proceed with implementation.`
      : `Decision ${decision.decisionType} rejected. Review notes and resubmit.`;

    return reply.code(201).send({
      status: decision.status,
      next_steps: nextSteps,
      decision,
    });
  });

  // GET /api/v1/companies/:companyId/board — list board decisions
  app.get('/api/v1/companies/:companyId/board', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const company = store.getCompany(companyId);
    if (!company) {
      return reply.code(404).send({ error: 'Company not found' });
    }
    return { decisions: store.listDecisions(companyId) };
  });
}
