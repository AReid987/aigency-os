import type { FastifyInstance } from 'fastify';
import db from '../db.js';

// ─── Prepared Statements ────────────────────────────────────────────────────

const selectAllAgents = db.prepare(`
  SELECT * FROM agents ORDER BY created_at DESC
`);

const selectRecentMessages = db.prepare(`
  SELECT * FROM messages ORDER BY created_at DESC LIMIT 50
`);

const selectActiveCollisions = db.prepare(`
  SELECT c.*, a1.name as agent1_name, a2.name as agent2_name
  FROM collisions c
  JOIN agents a1 ON c.agent1_id = a1.id
  JOIN agents a2 ON c.agent2_id = a2.id
  WHERE c.resolved = 0
  ORDER BY c.created_at DESC
`);

const selectAgentCounts = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
    SUM(CASE WHEN status = 'thinking' THEN 1 ELSE 0 END) as thinking,
    SUM(CASE WHEN status = 'blocked' THEN 1 ELSE 0 END) as blocked,
    SUM(CASE WHEN status = 'paused' THEN 1 ELSE 0 END) as paused,
    SUM(CASE WHEN status = 'terminated' THEN 1 ELSE 0 END) as terminated
  FROM agents
`);

const selectMessageCounts = db.prepare(`
  SELECT
    COUNT(*) as total,
    SUM(CASE WHEN delivery_status = 'pending' THEN 1 ELSE 0 END) as pending,
    SUM(CASE WHEN delivery_status = 'delivered' THEN 1 ELSE 0 END) as delivered,
    SUM(CASE WHEN delivery_status = 'read' THEN 1 ELSE 0 END) as "read"
  FROM messages
`);

const selectCollisionCount = db.prepare(`
  SELECT COUNT(*) as active FROM collisions WHERE resolved = 0
`);

// ─── Routes ─────────────────────────────────────────────────────────────────

export async function dashboardRoutes(app: FastifyInstance) {
  app.get('/hcom/dashboard', async () => {
    const agents = selectAllAgents.all();
    const messages = selectRecentMessages.all();
    const collisions = selectActiveCollisions.all();
    const agentStats = selectAgentCounts.get();
    const messageStats = selectMessageCounts.get();
    const collisionStats = selectCollisionCount.get();

    return {
      agents,
      messages,
      collisions,
      stats: {
        agents: agentStats,
        messages: messageStats,
        activeCollisions: collisionStats,
      },
      timestamp: new Date().toISOString(),
    };
  });
}
