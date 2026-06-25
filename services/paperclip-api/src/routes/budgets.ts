import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { UpdateBudgetSchema } from '../schemas.js';

export async function budgetRoutes(app: FastifyInstance) {
  // GET /api/v1/companies/:companyId/budget — get budget overview
  app.get('/api/v1/companies/:companyId/budget', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const budget = store.getBudget(companyId);
    if (!budget) {
      return reply.code(404).send({ error: 'Company not found' });
    }
    return budget;
  });

  // POST /api/v1/companies/:companyId/budget/spend — record spend for an agent
  app.post('/api/v1/companies/:companyId/budget/spend', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const body = request.body as { agentId: string; amount: number };
    if (!body.agentId || typeof body.amount !== 'number') {
      return reply.code(400).send({ error: 'agentId and amount are required' });
    }

    const result = store.recordSpend(companyId, body.agentId, body.amount);
    if (!result.success) {
      return reply.code(result.warning === 'hard' ? 403 : 400).send(result);
    }

    return result;
  });
}
