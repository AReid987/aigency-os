import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { HireAgentSchema, UpdateAgentStatusSchema } from '../schemas.js';

export async function agentRoutes(app: FastifyInstance) {
  // POST /api/v1/companies/:companyId/agents — hire agent
  app.post('/api/v1/companies/:companyId/agents', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const parsed = HireAgentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const agent = store.hireAgent(companyId, parsed.data);
    if (!agent) {
      return reply.code(404).send({ error: 'Company not found' });
    }

    return reply.code(201).send({
      agent_id: agent.id,
      heartbeat_schedule: agent.heartbeatSchedule,
      agent,
    });
  });

  // GET /api/v1/companies/:companyId/agents — list agents
  app.get('/api/v1/companies/:companyId/agents', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const company = store.getCompany(companyId);
    if (!company) {
      return reply.code(404).send({ error: 'Company not found' });
    }
    return { agents: store.listAgents(companyId) };
  });

  // GET /api/v1/companies/:companyId/agents/:agentId — get agent
  app.get('/api/v1/companies/:companyId/agents/:agentId', async (request, reply) => {
    const { agentId } = request.params as { companyId: string; agentId: string };
    const agent = store.getAgent(agentId);
    if (!agent) {
      return reply.code(404).send({ error: 'Agent not found' });
    }
    return agent;
  });

  // PATCH /api/v1/companies/:companyId/agents/:agentId/status — update agent status
  app.patch('/api/v1/companies/:companyId/agents/:agentId/status', async (request, reply) => {
    const { companyId, agentId } = request.params as { companyId: string; agentId: string };
    const parsed = UpdateAgentStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const agent = store.updateAgentStatus(agentId, parsed.data.status);
    if (!agent) {
      return reply.code(404).send({ error: 'Agent not found' });
    }

    store.addAuditEntry(companyId, {
      action: 'agent_status_changed',
      actor: 'system',
      details: { agentId, newStatus: parsed.data.status },
    });

    return agent;
  });
}
