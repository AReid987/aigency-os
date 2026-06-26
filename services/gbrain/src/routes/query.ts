import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';

export async function queryRoutes(app: FastifyInstance) {
  // GET /api/v1/query?q=...&role=... — hybrid search with role-based scoping
  app.get('/api/v1/query', async (request, reply) => {
    const { q, role } = request.query as {
      q?: string;
      role?: 'domain_expert' | 'technical_founder';
    };

    if (!q || q.trim().length === 0) {
      return reply.code(400).send({ error: 'Query parameter "q" is required' });
    }

    const results = store.queryPages(q);
    const scoped = store.getScopedResults(results, role);

    return {
      query: q,
      role: role ?? 'all',
      count: scoped.length,
      results: scoped,
    };
  });
}
