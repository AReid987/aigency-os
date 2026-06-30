import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';

export async function dashboardRoutes(app: FastifyInstance) {
  // GET /api/v1/companies/:companyId/dashboard — full dashboard
  app.get('/api/v1/companies/:companyId/dashboard', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const dashboard = store.getDashboard(companyId);
    if (!dashboard) {
      return reply.code(404).send({ error: 'Company not found' });
    }
    return dashboard;
  });
}
