import { describe, it, expect, beforeEach } from 'vitest';
import Fastify from 'fastify';

describe('skills health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const app = Fastify({ logger: false });
    app.get('/health', async () => ({
      status: 'ok',
      service: 'skills',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    }));

    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('skills');
    expect(body.version).toBe('0.1.0');
    expect(body.timestamp).toBeDefined();

    await app.close();
  });
});

describe('SkillsStore', () => {
  it('store module can be imported', async () => {
    const mod = await import('../store');
    expect(mod).toBeDefined();
    expect(mod.store).toBeDefined();
  });

  it('seed populates 5 demo skills', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();
    testStore.seed();

    const skills = testStore.listSkills();
    expect(skills.length).toBe(5);
  });

  it('listSkills filters by category', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();
    testStore.seed();

    const aiSkills = testStore.listSkills('ai');
    expect(aiSkills.length).toBeGreaterThan(0);
    for (const skill of aiSkills) {
      expect(skill.category).toBe('ai');
    }
  });

  it('getSkill returns a skill by id', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();
    testStore.seed();

    const all = testStore.listSkills();
    const first = all[0];
    const found = testStore.getSkill(first.id);
    expect(found).toBeDefined();
    expect(found!.name).toBe(first.name);
  });

  it('getSkill returns undefined for unknown id', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();

    const found = testStore.getSkill('00000000-0000-0000-0000-000000000000');
    expect(found).toBeUndefined();
  });

  it('installSkill creates an installation and increments downloads', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();
    testStore.seed();

    const all = testStore.listSkills();
    const skill = all[0];
    const downloadsBefore = skill.downloads;

    const installation = testStore.installSkill(skill.id, {
      environment: 'production',
      config: { key: 'value' },
    });

    expect(installation).toBeDefined();
    expect(installation!.skillId).toBe(skill.id);
    expect(installation!.status).toBe('active');
    expect(installation!.environment).toBe('production');
    expect(skill.downloads).toBe(downloadsBefore + 1);
  });

  it('installSkill returns undefined for unknown skill', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();

    const result = testStore.installSkill('00000000-0000-0000-0000-000000000000', {});
    expect(result).toBeUndefined();
  });

  it('validateSkill returns valid for a well-formed skill', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();
    testStore.seed();

    const all = testStore.listSkills();
    const result = testStore.validateSkill(all[0].id);
    expect(result.valid).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('validateSkill returns invalid for unknown skill', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();

    const result = testStore.validateSkill('00000000-0000-0000-0000-000000000000');
    expect(result.valid).toBe(false);
    expect(result.issues).toContain('Skill not found');
  });

  it('rateSkill adds a rating and updates average', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();
    testStore.seed();

    const all = testStore.listSkills();
    const skill = all[0];

    const rating = testStore.rateSkill(skill.id, { rating: 5, review: 'Excellent!' });
    expect(rating).toBeDefined();
    expect(rating!.rating).toBe(5);
    expect(rating!.review).toBe('Excellent!');
    expect(skill.ratingCount).toBeGreaterThan(0);
  });

  it('rateSkill returns undefined for unknown skill', async () => {
    const { SkillsStore } = await import('../store');
    const testStore = new (SkillsStore as any)();

    const result = testStore.rateSkill('00000000-0000-0000-0000-000000000000', { rating: 3 });
    expect(result).toBeUndefined();
  });
});

describe('skills API routes', () => {
  it('GET /api/v1/skills returns list of skills', async () => {
    const { SkillsStore } = await import('../store');
    const { skillRoutes } = await import('../routes/skills');

    const app = Fastify({ logger: false });
    await app.register(skillRoutes);

    const testStore = new (SkillsStore as any)();
    testStore.seed();

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/skills',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.skills).toBeDefined();
    expect(body.total).toBeDefined();

    await app.close();
  });

  it('GET /api/v1/skills/:id returns 404 for unknown id', async () => {
    const { skillRoutes } = await import('../routes/skills');

    const app = Fastify({ logger: false });
    await app.register(skillRoutes);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/skills/00000000-0000-0000-0000-000000000000',
    });

    expect(response.statusCode).toBe(404);
    await app.close();
  });

  it('POST /api/v1/skills/:id/install returns 404 for unknown id', async () => {
    const { skillRoutes } = await import('../routes/skills');

    const app = Fastify({ logger: false });
    await app.register(skillRoutes);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/skills/00000000-0000-0000-0000-000000000000/install',
      payload: {},
    });

    expect(response.statusCode).toBe(404);
    await app.close();
  });

  it('POST /api/v1/skills/:id/rate returns 404 for unknown id', async () => {
    const { ratingRoutes } = await import('../routes/ratings');

    const app = Fastify({ logger: false });
    await app.register(ratingRoutes);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/skills/00000000-0000-0000-0000-000000000000/rate',
      payload: { rating: 5 },
    });

    expect(response.statusCode).toBe(404);
    await app.close();
  });

  it('POST /api/v1/skills/:id/rate returns 400 for invalid body', async () => {
    const { ratingRoutes } = await import('../routes/ratings');

    const app = Fastify({ logger: false });
    await app.register(ratingRoutes);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/skills/00000000-0000-0000-0000-000000000000/rate',
      payload: { rating: 10 },
    });

    expect(response.statusCode).toBe(400);
    await app.close();
  });
});
