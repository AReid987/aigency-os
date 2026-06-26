/**
 * Seed data for Aigency OS development environment.
 * Run with: npx prisma db seed
 */

export const seedData = {
  companies: [
    { name: 'Acme Ventures', mission: 'Build the #1 AI note-taking app', goal: '$1M ARR in 12 months' },
  ],
  agents: [
    { name: 'Zeus', role: 'CEO', adapter: 'hermes', budgetLimit: 60 },
    { name: 'Hermes', role: 'CTO', adapter: 'hermes', budgetLimit: 50 },
    { name: 'Claude', role: 'Engineer', adapter: 'claude', budgetLimit: 30 },
  ],
  knowledge: [
    { title: 'Pricing Decision', type: 'decision', content: 'Set Pro tier at $49/mo based on competitor analysis.' },
    { title: 'Auth Architecture', type: 'plan', content: 'JWT with RBAC, Fastify middleware, SQLite sessions.' },
  ],
};

export default seedData;
