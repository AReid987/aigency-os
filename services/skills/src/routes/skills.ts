import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { InstallSkillSchema, SkillCategorySchema } from '../schemas.js';

export async function skillRoutes(app: FastifyInstance) {
  // GET /api/v1/skills — list all skills (optional category filter)
  app.get('/api/v1/skills', async (request) => {
    const { category } = request.query as { category?: string };
    const parsedCategory = SkillCategorySchema.safeParse(category);
    const skills = store.listSkills(parsedCategory.success ? parsedCategory.data : undefined);
    return { skills, total: skills.length };
  });

  // GET /api/v1/skills/:id — get skill by id
  app.get('/api/v1/skills/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const skill = store.getSkill(id);
    if (!skill) {
      return reply.code(404).send({ error: 'Skill not found' });
    }
    return skill;
  });

  // POST /api/v1/skills/:id/install — install a skill
  app.post('/api/v1/skills/:id/install', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = InstallSkillSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const installation = store.installSkill(id, parsed.data);
    if (!installation) {
      return reply.code(404).send({ error: 'Skill not found' });
    }
    return reply.code(201).send(installation);
  });
}
