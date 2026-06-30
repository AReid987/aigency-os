import { z } from 'zod';
import db from '../db.js';
import { getAgentById, notifySubscribers } from './agents.js';
// ─── Constants ──────────────────────────────────────────────────────────────
const COLLISION_WINDOW_SECONDS = 30;
// ─── Schemas ────────────────────────────────────────────────────────────────
const FileEditSchema = z.object({
    filePath: z.string().min(1),
    operation: z.string().optional().default('edit'),
});
// ─── Prepared Statements ────────────────────────────────────────────────────
const insertFileEdit = db.prepare(`
  INSERT INTO file_edits (id, agent_id, file_path, operation)
  VALUES (@id, @agent_id, @file_path, @operation)
`);
const selectRecentEdits = db.prepare(`
  SELECT * FROM file_edits
  WHERE file_path = @filePath
    AND agent_id != @agentId
    AND created_at >= datetime('now', '-${COLLISION_WINDOW_SECONDS} seconds')
  ORDER BY created_at DESC
`);
const insertCollision = db.prepare(`
  INSERT INTO collisions (id, file_path, agent1_id, agent2_id, edit1_id, edit2_id)
  VALUES (@id, @file_path, @agent1_id, @agent2_id, @edit1_id, @edit2_id)
`);
const selectActiveCollisions = db.prepare(`
  SELECT c.*, a1.name as agent1_name, a2.name as agent2_name
  FROM collisions c
  JOIN agents a1 ON c.agent1_id = a1.id
  JOIN agents a2 ON c.agent2_id = a2.id
  WHERE c.resolved = 0
  ORDER BY c.created_at DESC
`);
const selectAllCollisions = db.prepare(`
  SELECT c.*, a1.name as agent1_name, a2.name as agent2_name
  FROM collisions c
  JOIN agents a1 ON c.agent1_id = a1.id
  JOIN agents a2 ON c.agent2_id = a2.id
  ORDER BY c.created_at DESC
  LIMIT ?
`);
const resolveCollision = db.prepare(`
  UPDATE collisions SET resolved = 1 WHERE id = ?
`);
const selectCollisionsByFile = db.prepare(`
  SELECT * FROM collisions WHERE file_path = ? AND resolved = 0 ORDER BY created_at DESC
`);
// ─── Routes ─────────────────────────────────────────────────────────────────
export async function collisionRoutes(app) {
    // Record file edit & detect collisions
    app.post('/hcom/agents/:id/file-edit', async (request, reply) => {
        const { id: agentId } = request.params;
        const parsed = FileEditSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Invalid body', details: parsed.error.issues });
        }
        const agent = getAgentById(agentId);
        if (!agent)
            return reply.code(404).send({ error: 'Agent not found' });
        const editId = crypto.randomUUID();
        insertFileEdit.run({
            id: editId,
            agent_id: agentId,
            file_path: parsed.data.filePath,
            operation: parsed.data.operation,
        });
        // Check for collisions
        const recentEdits = selectRecentEdits.all({
            filePath: parsed.data.filePath,
            agentId,
        });
        const collisions = [];
        for (const edit of recentEdits) {
            const collisionId = crypto.randomUUID();
            insertCollision.run({
                id: collisionId,
                file_path: parsed.data.filePath,
                agent1_id: edit.agent_id,
                agent2_id: agentId,
                edit1_id: edit.id,
                edit2_id: editId,
            });
            const collision = {
                id: collisionId,
                filePath: parsed.data.filePath,
                agent1: edit.agent_id,
                agent2: agentId,
                timestamp: new Date().toISOString(),
                resolved: false,
            };
            collisions.push(collision);
            // Notify subscribers
            notifySubscribers('collision', '*', collision);
        }
        reply.code(201).send({
            editId,
            filePath: parsed.data.filePath,
            collisions,
        });
    });
    // Get active collisions
    app.get('/hcom/collisions', async (request) => {
        const query = request.query;
        if (query.filePath) {
            return selectCollisionsByFile.all(query.filePath);
        }
        return selectActiveCollisions.all();
    });
    // Resolve a collision
    app.post('/hcom/collisions/:id/resolve', async (request, reply) => {
        const { id } = request.params;
        const result = resolveCollision.run(id);
        if (result.changes === 0) {
            return reply.code(404).send({ error: 'Collision not found' });
        }
        return { resolved: true };
    });
}
//# sourceMappingURL=collisions.js.map