import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { HeartbeatSchema } from '../schemas.js';

export async function heartbeatRoutes(app: FastifyInstance) {
  // POST /api/v1/companies/:companyId/heartbeat — agent check-in
  app.post('/api/v1/companies/:companyId/heartbeat', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const parsed = HeartbeatSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const result = store.heartbeat(companyId, parsed.data.agentId);
    if (!result) {
      return reply.code(404).send({ error: 'Company or agent not found' });
    }

    // Update agent status if provided
    if (parsed.data.status) {
      store.updateAgentStatus(parsed.data.agentId, parsed.data.status);
    }

    return {
      agent_id: parsed.data.agentId,
      pending_tasks: result.pendingTasks,
      budget: result.budget,
      goal_ancestry: result.goalAncestry,
      timestamp: new Date().toISOString(),
    };
  });
}
