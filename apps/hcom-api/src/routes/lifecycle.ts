import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import db from '../db.js';
import { getAgentById, insertAgentRow, removeAgent, notifySubscribers } from './agents.js';

// ─── Schemas ────────────────────────────────────────────────────────────────

const SpawnSchema = z.object({
  name: z.string().min(1),
  adapter: z.string().optional(),
  terminal_type: z.string().optional().default('tmux'),
});

const ForkSchema = z.object({
  name: z.string().min(1).optional(),
  shareContext: z.boolean().optional().default(true),
});

// ─── Prepared Statements ────────────────────────────────────────────────────

const selectAgentMessages = db.prepare(`
  SELECT * FROM messages
  WHERE sender_id = ? OR recipient_id = ?
  ORDER BY created_at DESC
  LIMIT 20
`);

const selectAgentSubscriptions = db.prepare(`
  SELECT * FROM subscriptions WHERE agent_id = ?
`);

const countAgents = db.prepare(`SELECT COUNT(*) as count FROM agents`);

// ─── Routes ─────────────────────────────────────────────────────────────────

export async function lifecycleRoutes(app: FastifyInstance) {
  // Spawn new agent
  app.post<{ Body: z.infer<typeof SpawnSchema> }>('/hcom/agents/:id/spawn', async (request, reply) => {
    const { id: parentId } = request.params as { id: string };
    const parsed = SpawnSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid body', details: parsed.error.issues });
    }

    const parent = getAgentById(parentId);
    if (!parent) return reply.code(404).send({ error: 'Parent agent not found' });

    const newId = crypto.randomUUID();
    const count = (countAgents.get() as { count: number }).count;
    const sessionId = `tmux:${count}`;

    insertAgentRow({
      id: newId,
      name: parsed.data.name,
      adapter: (parsed.data.adapter ?? parent.adapter) as string,
      terminal_type: parsed.data.terminal_type,
      status: 'active',
      parent_id: parentId,
      session_id: sessionId,
    });

    const agent = getAgentById(newId);
    reply.code(201).send(agent);
  });

  // Fork agent (clone with shared context)
  app.post<{ Body: z.infer<typeof ForkSchema> }>('/hcom/agents/:id/fork', async (request, reply) => {
    const { id: sourceId } = request.params as { id: string };
    const parsed = ForkSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid body', details: parsed.error.issues });
    }

    const source = getAgentById(sourceId);
    if (!source) return reply.code(404).send({ error: 'Source agent not found' });

    const newId = crypto.randomUUID();
    const count = (countAgents.get() as { count: number }).count;
    const sessionId = `tmux:${count}`;
    const forkName = parsed.data.name ?? `${source.name}-fork`;

    insertAgentRow({
      id: newId,
      name: forkName,
      adapter: source.adapter as string,
      terminal_type: source.terminal_type as string,
      status: 'active',
      parent_id: sourceId,
      session_id: sessionId,
    });

    // Copy context (recent messages) if shareContext is true
    let contextMessages: unknown[] = [];
    if (parsed.data.shareContext) {
      const messages = selectAgentMessages.all(sourceId, sourceId);
      contextMessages = messages;

      // Copy subscriptions
      const subs = selectAgentSubscriptions.all(sourceId) as Array<Record<string, unknown>>;
      const insertSub = db.prepare(`
        INSERT INTO subscriptions (id, agent_id, event_type, target_id)
        VALUES (@id, @agent_id, @event_type, @target_id)
      `);
      for (const sub of subs) {
        insertSub.run({
          id: crypto.randomUUID(),
          agent_id: newId,
          event_type: sub.event_type,
          target_id: sub.target_id,
        });
      }
    }

    const agent = getAgentById(newId);
    reply.code(201).send({
      ...agent,
      forkedFrom: sourceId,
      contextMessages: parsed.data.shareContext ? contextMessages : undefined,
    });
  });

  // Resume agent
  app.post('/hcom/agents/:id/resume', async (request, reply) => {
    const { id } = request.params as { id: string };
    const agent = getAgentById(id);
    if (!agent) return reply.code(404).send({ error: 'Agent not found' });

    if (agent.status === 'active') {
      return { message: 'Agent is already active', agent };
    }

    const updateStatus = db.prepare(`
      UPDATE agents SET status = 'active' WHERE id = ?
    `);
    updateStatus.run(id);

    notifySubscribers('status_change', id, {
      agentId: id,
      oldStatus: agent.status,
      newStatus: 'active',
    });

    const updated = getAgentById(id);
    return { message: 'Agent resumed', agent: updated };
  });

  // Kill agent
  app.post('/hcom/agents/:id/kill', async (request, reply) => {
    const { id } = request.params as { id: string };
    const agent = getAgentById(id);
    if (!agent) return reply.code(404).send({ error: 'Agent not found' });

    // Mark as terminated first
    const updateStatus = db.prepare(`
      UPDATE agents SET status = 'terminated' WHERE id = ?
    `);
    updateStatus.run(id);

    notifySubscribers('status_change', id, {
      agentId: id,
      oldStatus: agent.status,
      newStatus: 'terminated',
    });

    // Optionally delete the agent record
    const query = request.query as { hard?: string };
    if (query.hard === 'true') {
      removeAgent(id);
      return { message: 'Agent deleted', agentId: id };
    }

    return { message: 'Agent terminated', agent: getAgentById(id) };
  });
}
