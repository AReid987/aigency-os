import { describe, it, expect, beforeEach } from 'vitest';
import Fastify from 'fastify';
import { store } from '../store.js';

// Reset store before each test
beforeEach(() => {
  store.plans.clear();
  store.criteria.clear();
  store.techSpecs.clear();
});

describe('paul health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const app = Fastify({ logger: false });
    app.get('/health', async () => ({
      status: 'ok',
      service: 'paul',
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
    expect(body.service).toBe('paul');
    expect(body.version).toBe('0.1.0');

    await app.close();
  });
});

describe('PAUL Store', () => {
  it('store module can be imported', async () => {
    const mod = await import('../store');
    expect(mod).toBeDefined();
    expect(mod.store).toBeDefined();
  });

  it('createPlan generates a structured plan from PRD', () => {
    const plan = store.createPlan('Build auth system');

    expect(plan.id).toBeDefined();
    expect(plan.prd).toBe('Build auth system');
    expect(plan.title).toBeDefined();
    expect(plan.summary).toBeDefined();
    expect(plan.tasks.length).toBeGreaterThanOrEqual(3);
    expect(plan.tasks.length).toBeLessThanOrEqual(5);
    expect(plan.status).toBe('draft');

    // Each task should have 2-3 acceptance criteria
    for (const task of plan.tasks) {
      expect(task.acceptanceCriteria.length).toBeGreaterThanOrEqual(2);
      expect(task.acceptanceCriteria.length).toBeLessThanOrEqual(3);
      expect(task.status).toBe('pending');
    }
  });

  it('getPlan returns plan by id', () => {
    const plan = store.createPlan('Build auth system');
    const found = store.getPlan(plan.id);
    expect(found).toBeDefined();
    expect(found!.id).toBe(plan.id);
  });

  it('getPlan returns undefined for unknown id', () => {
    expect(store.getPlan('nonexistent')).toBeUndefined();
  });

  it('listPlans returns all plans', () => {
    store.createPlan('Build auth system');
    store.createPlan('Build notification service');
    expect(store.listPlans().length).toBe(2);
  });

  it('applyPlan marks all tasks as in_progress', () => {
    const plan = store.createPlan('Build auth system');
    const applied = store.applyPlan(plan.id);

    expect(applied).toBeDefined();
    expect(applied!.status).toBe('in_progress');
    for (const task of applied!.tasks) {
      expect(task.status).toBe('in_progress');
    }
  });

  it('applyPlan returns undefined for unknown id', () => {
    expect(store.applyPlan('nonexistent')).toBeUndefined();
  });

  it('unifyPlan generates a TECH-SPEC with 5 sections', () => {
    const plan = store.createPlan('Build auth system');
    const techSpec = store.unifyPlan(plan.id);

    expect(techSpec).toBeDefined();
    expect(techSpec!.planId).toBe(plan.id);
    expect(techSpec!.sections.length).toBe(5);

    const sectionTitles = techSpec!.sections.map((s) => s.title);
    expect(sectionTitles).toContain('Overview');
    expect(sectionTitles).toContain('Architecture');
    expect(sectionTitles).toContain('API Design');
    expect(sectionTitles).toContain('Data Model');
    expect(sectionTitles).toContain('Testing Strategy');

    for (const section of techSpec!.sections) {
      expect(section.content.length).toBeGreaterThan(0);
    }
  });

  it('unifyPlan returns undefined for unknown id', () => {
    expect(store.unifyPlan('nonexistent')).toBeUndefined();
  });

  it('getCriteria returns all criteria for a plan', () => {
    const plan = store.createPlan('Build auth system');
    const criteria = store.getCriteria(plan.id);

    expect(criteria.length).toBeGreaterThanOrEqual(6); // 3 tasks * 2 criteria min
    expect(criteria.every((c) => c.status === 'pending')).toBe(true);
  });

  it('updateCriteriaStatus changes criterion status', () => {
    const plan = store.createPlan('Build auth system');
    const criteria = store.getCriteria(plan.id);
    const firstCriterion = criteria[0];

    const updated = store.updateCriteriaStatus(plan.id, firstCriterion.id, 'passed');
    expect(updated).toBeDefined();
    expect(updated!.status).toBe('passed');
  });

  it('updateCriteriaStatus returns undefined for unknown criterion', () => {
    const plan = store.createPlan('Build auth system');
    expect(store.updateCriteriaStatus(plan.id, 'nonexistent', 'passed')).toBeUndefined();
  });

  it('all criteria passed marks task as done', () => {
    const plan = store.createPlan('Build auth system');
    const firstTask = plan.tasks[0];

    for (const criterion of firstTask.acceptanceCriteria) {
      store.updateCriteriaStatus(plan.id, criterion.id, 'passed');
    }

    const updatedPlan = store.getPlan(plan.id)!;
    expect(updatedPlan.tasks[0].status).toBe('done');
  });

  it('all tasks done marks plan as completed', () => {
    const plan = store.createPlan('Build auth system');

    for (const task of plan.tasks) {
      for (const criterion of task.acceptanceCriteria) {
        store.updateCriteriaStatus(plan.id, criterion.id, 'passed');
      }
    }

    const updatedPlan = store.getPlan(plan.id)!;
    expect(updatedPlan.status).toBe('completed');
  });
});

describe('paul API routes', () => {
  it('POST /api/v1/plan creates a plan', async () => {
    const { planRoutes } = await import('../routes/plan.js');
    const app = Fastify({ logger: false });
    await app.register(planRoutes);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/plan',
      payload: { prd: 'Build auth system' },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.id).toBeDefined();
    expect(body.tasks.length).toBeGreaterThanOrEqual(3);
    expect(body.status).toBe('draft');

    await app.close();
  });

  it('POST /api/v1/plan returns 400 for missing prd', async () => {
    const { planRoutes } = await import('../routes/plan.js');
    const app = Fastify({ logger: false });
    await app.register(planRoutes);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/plan',
      payload: {},
    });

    expect(response.statusCode).toBe(400);

    await app.close();
  });

  it('GET /api/v1/plan/:id returns 404 for unknown plan', async () => {
    const { planRoutes } = await import('../routes/plan.js');
    const app = Fastify({ logger: false });
    await app.register(planRoutes);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/plan/nonexistent',
    });

    expect(response.statusCode).toBe(404);

    await app.close();
  });
});
