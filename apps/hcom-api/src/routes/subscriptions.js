import { z } from 'zod';
import db from '../db.js';
import { getAgentById } from './agents.js';
// ─── Schemas ────────────────────────────────────────────────────────────────
const SubscribeSchema = z.object({
    eventType: z.enum(['file_edit', 'status_change', 'message', 'collision']),
    targetId: z.string().uuid().optional(), // null = subscribe to all
});
// ─── Prepared Statements ────────────────────────────────────────────────────
const insertSubscription = db.prepare(`
  INSERT INTO subscriptions (id, agent_id, event_type, target_id)
  VALUES (@id, @agent_id, @event_type, @target_id)
`);
const selectSubscriptions = db.prepare(`
  SELECT * FROM subscriptions WHERE agent_id = ?
`);
const deleteSubscription = db.prepare(`
  DELETE FROM subscriptions WHERE id = ? AND agent_id = ?
`);
const deleteAllSubscriptions = db.prepare(`
  DELETE FROM subscriptions WHERE agent_id = ?
`);
// ─── Routes ─────────────────────────────────────────────────────────────────
export async function subscriptionRoutes(app) {
    // Subscribe to events
    app.post('/hcom/agents/:id/subscribe', async (request, reply) => {
        const { id: agentId } = request.params;
        const parsed = SubscribeSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Invalid body', details: parsed.error.issues });
        }
        const agent = getAgentById(agentId);
        if (!agent)
            return reply.code(404).send({ error: 'Agent not found' });
        const subId = crypto.randomUUID();
        insertSubscription.run({
            id: subId,
            agent_id: agentId,
            event_type: parsed.data.eventType,
            target_id: parsed.data.targetId ?? null,
        });
        reply.code(201).send({
            id: subId,
            agentId,
            eventType: parsed.data.eventType,
            targetId: parsed.data.targetId ?? null,
        });
    });
    // List subscriptions for an agent
    app.get('/hcom/agents/:id/subscriptions', async (request, reply) => {
        const { id } = request.params;
        const agent = getAgentById(id);
        if (!agent)
            return reply.code(404).send({ error: 'Agent not found' });
        return selectSubscriptions.all(id);
    });
    // Unsubscribe
    app.delete('/hcom/agents/:id/subscribe/:subId', async (request, reply) => {
        const { id, subId } = request.params;
        const result = deleteSubscription.run(subId, id);
        if (result.changes === 0) {
            return reply.code(404).send({ error: 'Subscription not found' });
        }
        return { deleted: true };
    });
    // Unsubscribe from all
    app.delete('/hcom/agents/:id/subscriptions', async (request, reply) => {
        const { id } = request.params;
        const result = deleteAllSubscriptions.run(id);
        return { deleted: result.changes };
    });
}
//# sourceMappingURL=subscriptions.js.map