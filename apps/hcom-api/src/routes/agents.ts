import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import db from '../db.js';
import type { AgentAdapter, AgentStatus, HCOMAgent } from '@aigency-os/shared-types';

// ─── Schemas ────────────────────────────────────────────────────────────────

const RegisterAgentSchema = z.object({
  name: z.string().min(1),
  adapter: z.string().min(1),
  terminal_type: z.string().optional().default('tmux'),
  parent_id: z.string().uuid().optional(),
});

const UpdateStatusSchema = z.object({
  status: z.enum(['active', 'paused', 'terminated', 'thinking', 'blocked']),
  active_task: z.string().optional(),
});

// ─── Prepared Statements ────────────────────────────────────────────────────

const insertAgent = db.prepare(`
  INSERT INTO agents (id, name, adapter, terminal_type, status, parent_id, session_id)
  VALUES (@id, @name, @adapter, @terminal_type, @status, @parent_id, @session_id)
`);

const selectAgent = db.prepare(`SELECT * FROM agents WHERE id = ?`);

const selectAllAgents = db.prepare(`SELECT * FROM agents ORDER BY created_at DESC`);

const updateAgentStatus = db.prepare(`
  UPDATE agents SET status = @status, active_task = COALESCE(@active_task, active_task)
  WHERE id = @id
`);

const updateHeartbeat = db.prepare(`
  UPDATE agents SET last_heartbeat = datetime('now') WHERE id = ?
`);

const deleteAgent = db.prepare(`DELETE FROM agents WHERE id = ?`);

const countAgents = db.prepare(`SELECT COUNT(*) as count FROM agents`);

// ─── Routes ─────────────────────────────────────────────────────────────────

export async function agentRoutes(app: FastifyInstance) {
  // Register agent
  app.post<{ Body: z.infer<typeof RegisterAgentSchema> }>('/hcom/agents', async (request, reply) => {
    const parsed = RegisterAgentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid body', details: parsed.error.issues });
    }

    const { name, adapter, terminal_type, parent_id } = parsed.data;
    const id = crypto.randomUUID();
    const count = (countAgents.get() as { count: number }).count;
    const sessionId = `tmux:${count}`;

    insertAgent.run({
      id,
      name,
      adapter,
      terminal_type,
      status: 'active',
      parent_id: parent_id ?? null,
      session_id: sessionId,
    });

    const agent = selectAgent.get(id) as Record<string, unknown>;
    reply.code(201).send(agent);
  });

  // Get agent status
  app.get('/hcom/agents/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const agent = selectAgent.get(id) as Record<string, unknown> | undefined;
    if (!agent) return reply.code(404).send({ error: 'Agent not found' });
    return agent;
  });

  // Update agent status
  app.put<{ Body: z.infer<typeof UpdateStatusSchema> }>('/hcom/agents/:id/status', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = UpdateStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Invalid body', details: parsed.error.issues });
    }

    const existing = selectAgent.get(id) as Record<string, unknown> | undefined;
    if (!existing) return reply.code(404).send({ error: 'Agent not found' });

    updateAgentStatus.run({ id, status: parsed.data.status, active_task: parsed.data.active_task ?? null });

    // Notify subscribers
    notifySubscribers('status_change', id, {
      agentId: id,
      oldStatus: existing.status,
      newStatus: parsed.data.status,
    });

    const agent = selectAgent.get(id) as Record<string, unknown>;
    return agent;
  });

  // Heartbeat
  app.post('/hcom/agents/:id/heartbeat', async (request, reply) => {
    const { id } = request.params as { id: string };
    const existing = selectAgent.get(id) as Record<string, unknown> | undefined;
    if (!existing) return reply.code(404).send({ error: 'Agent not found' });

    updateHeartbeat.run(id);
    return { ok: true, lastHeartbeat: new Date().toISOString() };
  });

  // List all agents
  app.get('/hcom/agents', async () => {
    return selectAllAgents.all();
  });
}

// ─── Helpers (exported for use by other routes) ─────────────────────────────

export function getAgentById(id: string): Record<string, unknown> | undefined {
  return selectAgent.get(id) as Record<string, unknown> | undefined;
}

export function insertAgentRow(params: {
  id: string;
  name: string;
  adapter: string;
  terminal_type: string;
  status: string;
  parent_id: string | null;
  session_id: string;
}) {
  insertAgent.run(params);
}

export function removeAgent(id: string) {
  deleteAgent.run(id);
}

// In-memory event notification (lightweight — no SSE for now)
type EventCallback = (eventType: string, targetId: string, payload: unknown) => void;
const eventListeners: EventCallback[] = [];

export function onEvent(cb: EventCallback) {
  eventListeners.push(cb);
}

export function notifySubscribers(eventType: string, targetId: string, payload: unknown) {
  for (const cb of eventListeners) {
    try { cb(eventType, targetId, payload); } catch { /* ignore */ }
  }
}
