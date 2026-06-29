import { z } from 'zod';
import db from '../db.js';
import { getAgentById, notifySubscribers } from './agents.js';
// ─── Schemas ────────────────────────────────────────────────────────────────
const SendMessageSchema = z.object({
    recipientId: z.string().uuid().nullable().optional(),
    content: z.string().min(1),
    intent: z.string().optional().default('message'),
    contextBundle: z.record(z.unknown()).optional().default({}),
});
// ─── Prepared Statements ────────────────────────────────────────────────────
const insertMessage = db.prepare(`
  INSERT INTO messages (id, sender_id, recipient_id, intent, content, context_bundle, delivery_status)
  VALUES (@id, @sender_id, @recipient_id, @intent, @content, @context_bundle, @delivery_status)
`);
const selectInbox = db.prepare(`
  SELECT * FROM messages
  WHERE (recipient_id = @agentId OR recipient_id IS NULL)
    AND sender_id != @agentId
    AND delivery_status != 'read'
  ORDER BY created_at DESC
  LIMIT @limit
`);
const markAsRead = db.prepare(`
  UPDATE messages
  SET delivery_status = 'read', read_at = datetime('now')
  WHERE id = @id AND (recipient_id = @agentId OR recipient_id IS NULL)
`);
const markAllRead = db.prepare(`
  UPDATE messages
  SET delivery_status = 'read', read_at = datetime('now')
  WHERE (recipient_id = @agentId OR recipient_id IS NULL)
    AND sender_id != @agentId
    AND delivery_status != 'read'
`);
const selectRecentMessages = db.prepare(`
  SELECT * FROM messages ORDER BY created_at DESC LIMIT ?
`);
const selectMessagesByAgent = db.prepare(`
  SELECT * FROM messages
  WHERE sender_id = ? OR recipient_id = ?
  ORDER BY created_at DESC
  LIMIT ?
`);
// ─── Routes ─────────────────────────────────────────────────────────────────
export async function messageRoutes(app) {
    // Send message
    app.post('/hcom/agents/:id/message', async (request, reply) => {
        const { id: senderId } = request.params;
        const parsed = SendMessageSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Invalid body', details: parsed.error.issues });
        }
        const sender = getAgentById(senderId);
        if (!sender)
            return reply.code(404).send({ error: 'Sender agent not found' });
        const { recipientId, content, intent, contextBundle } = parsed.data;
        // Validate recipient exists if specified
        if (recipientId) {
            const recipient = getAgentById(recipientId);
            if (!recipient)
                return reply.code(404).send({ error: 'Recipient agent not found' });
        }
        const msgId = crypto.randomUUID();
        const isBroadcast = recipientId === null || recipientId === undefined;
        insertMessage.run({
            id: msgId,
            sender_id: senderId,
            recipient_id: isBroadcast ? null : recipientId,
            intent,
            content,
            context_bundle: JSON.stringify(contextBundle),
            delivery_status: 'delivered',
        });
        // Notify subscribers
        notifySubscribers('message', isBroadcast ? '*' : recipientId, {
            messageId: msgId,
            senderId,
            recipientId: isBroadcast ? null : recipientId,
            intent,
            content,
        });
        reply.code(201).send({
            id: msgId,
            senderId,
            recipientId: isBroadcast ? null : recipientId,
            intent,
            content,
            contextBundle,
            deliveryStatus: 'delivered',
            timestamp: new Date().toISOString(),
        });
    });
    // Get inbox (unread messages)
    app.get('/hcom/agents/:id/inbox', async (request, reply) => {
        const { id } = request.params;
        const query = request.query;
        const agent = getAgentById(id);
        if (!agent)
            return reply.code(404).send({ error: 'Agent not found' });
        const limit = Math.min(parseInt(query.limit ?? '50', 10), 200);
        const messages = selectInbox.all({ agentId: id, limit });
        return { messages, unreadCount: messages.length };
    });
    // Mark message as read
    app.post('/hcom/agents/:id/mark-read', async (request, reply) => {
        const { id } = request.params;
        const body = request.body;
        if (body?.messageId) {
            const result = markAsRead.run({ id: body.messageId, agentId: id });
            return { updated: result.changes };
        }
        // Mark all as read
        const result = markAllRead.run({ agentId: id });
        return { updated: result.changes };
    });
    // Get recent messages (global)
    app.get('/hcom/messages/recent', async (request) => {
        const query = request.query;
        const limit = Math.min(parseInt(query.limit ?? '50', 10), 200);
        return selectRecentMessages.all(limit);
    });
    // Get messages for a specific agent (sent + received)
    app.get('/hcom/agents/:id/messages', async (request, reply) => {
        const { id } = request.params;
        const query = request.query;
        const agent = getAgentById(id);
        if (!agent)
            return reply.code(404).send({ error: 'Agent not found' });
        const limit = Math.min(parseInt(query.limit ?? '50', 10), 200);
        return selectMessagesByAgent.all(id, id, limit);
    });
}
//# sourceMappingURL=messages.js.map