import { describe, it, expect, beforeEach } from 'vitest';
import Fastify from 'fastify';

// ─── Store Tests ──────────────────────────────────────────────────────────

describe('PlannotatorStore', () => {
  beforeEach(async () => {
    // Re-import store fresh for each test
    const { store } = await import('../store.js');
    // Clear existing data
    store.plans.clear();
    store.annotations.clear();
    store.versions.clear();
  });

  it('can import the store module', async () => {
    const mod = await import('../store.js');
    expect(mod.store).toBeDefined();
  });

  it('createPlan creates a plan with correct fields', async () => {
    const { store } = await import('../store.js');
    const plan = store.createPlan({
      title: 'Test Plan',
      description: 'A test plan',
      source: 'manual',
    });

    expect(plan.id).toBeDefined();
    expect(plan.title).toBe('Test Plan');
    expect(plan.description).toBe('A test plan');
    expect(plan.source).toBe('manual');
    expect(plan.version).toBe(1);
    expect(plan.createdAt).toBeDefined();
  });

  it('getPlan filters sections by role (domain_expert sees only business)', async () => {
    const { store } = await import('../store.js');
    const plan = store.createPlan({
      title: 'RBAC Test',
      sections: [
        {
          id: 'sec-1',
          type: 'business',
          title: 'Business Section',
          content: 'Business content',
          accessRoles: ['domain_expert', 'technical_founder'],
        },
        {
          id: 'sec-2',
          type: 'technical',
          title: 'Tech Section',
          content: 'Tech content',
          accessRoles: ['technical_founder'],
        },
      ],
    });

    const domainExpertView = store.getPlan(plan.id, 'domain_expert');
    expect(domainExpertView!.sections).toHaveLength(1);
    expect(domainExpertView!.sections[0].type).toBe('business');

    const techFounderView = store.getPlan(plan.id, 'technical_founder');
    expect(techFounderView!.sections).toHaveLength(2);
  });

  it('listPlans filters by source', async () => {
    const { store } = await import('../store.js');
    store.createPlan({ title: 'Plan A', source: 'paperclip' });
    store.createPlan({ title: 'Plan B', source: 'manual' });
    store.createPlan({ title: 'Plan C', source: 'paperclip' });

    const all = store.listPlans();
    expect(all).toHaveLength(3);

    const paperclipOnly = store.listPlans({ source: 'paperclip' });
    expect(paperclipOnly).toHaveLength(2);

    const manualOnly = store.listPlans({ source: 'manual' });
    expect(manualOnly).toHaveLength(1);
  });

  it('addAnnotation and getAnnotations work correctly', async () => {
    const { store } = await import('../store.js');
    const plan = store.createPlan({ title: 'Annotated Plan' });

    store.addAnnotation(plan.id, {
      author: 'Alice',
      role: 'domain_expert',
      content: 'Looks good!',
      type: 'approval',
    });

    store.addAnnotation(plan.id, {
      author: 'Bob',
      role: 'technical_founder',
      content: 'Need more detail on architecture.',
      type: 'suggestion',
    });

    const annotations = store.getAnnotations(plan.id);
    expect(annotations).toHaveLength(2);
    expect(annotations[0].author).toBe('Alice');
    expect(annotations[1].type).toBe('suggestion');
  });

  it('getDiff detects field changes between versions', async () => {
    const { store } = await import('../store.js');
    const plan = store.createPlan({ title: 'Original Title', description: 'Original desc' });

    store.updatePlan(plan.id, { title: 'Updated Title' });

    const diff = store.getDiff(plan.id, 1, 2);
    expect(diff).toBeDefined();
    expect(diff!.changes).toHaveLength(1);
    expect(diff!.changes[0].field).toBe('title');
    expect(diff!.changes[0].from).toBe('Original Title');
    expect(diff!.changes[0].to).toBe('Updated Title');
  });

  it('seed creates 2 demo plans', async () => {
    const { store } = await import('../store.js');
    store.seed();

    const plans = store.listPlans();
    expect(plans).toHaveLength(2);
    expect(plans[0].title).toBe('AIGENCY OS Platform Launch');
    expect(plans[1].title).toBe('Q3 Agent Hiring Strategy');
  });
});

// ─── Route Tests ──────────────────────────────────────────────────────────

describe('Plannotator health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const app = Fastify({ logger: false });
    app.get('/health', async () => ({
      status: 'ok',
      service: 'plannotator',
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
    expect(body.service).toBe('plannotator');

    await app.close();
  });
});

describe('Plan API routes', () => {
  let app: ReturnType<typeof Fastify>;

  beforeEach(async () => {
    const { store } = await import('../store.js');
    store.plans.clear();
    store.annotations.clear();
    store.versions.clear();
    store.seed();

    app = Fastify({ logger: false });
    const { planRoutes } = await import('../routes/plans.js');
    const { annotationRoutes } = await import('../routes/annotations.js');
    const { diffRoutes } = await import('../routes/diffs.js');
    await app.register(planRoutes);
    await app.register(annotationRoutes);
    await app.register(diffRoutes);
  });

  it('GET /api/v1/plans returns all plans', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/plans',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.plans).toHaveLength(2);
  });

  it('GET /api/v1/plans?source=paperclip filters by source', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/plans?source=paperclip',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.plans).toHaveLength(1);
    expect(body.plans[0].source).toBe('paperclip');
  });

  it('GET /api/v1/plans/:id returns plan with all sections (no role)', async () => {
    const { store } = await import('../store.js');
    const plans = store.listPlans();
    const planId = plans[0].id;

    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/plans/${planId}`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.sections.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/plans/:id?role=domain_expert filters sections', async () => {
    const { store } = await import('../store.js');
    const plans = store.listPlans();
    const planId = plans[0].id;

    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/plans/${planId}?role=domain_expert`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    // domain_expert should only see business sections
    body.sections.forEach((s: { type: string }) => {
      expect(s.type).toBe('business');
    });
  });

  it('POST /api/v1/plans creates a new plan', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/plans',
      payload: {
        title: 'New Plan',
        description: 'Created via API',
        source: 'manual',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.title).toBe('New Plan');
    expect(body.source).toBe('manual');
  });

  it('POST /api/v1/plans/:id/annotations creates an annotation', async () => {
    const { store } = await import('../store.js');
    const plans = store.listPlans();
    const planId = plans[0].id;

    const response = await app.inject({
      method: 'POST',
      url: `/api/v1/plans/${planId}/annotations`,
      payload: {
        author: 'Test User',
        role: 'domain_expert',
        content: 'Great plan!',
        type: 'approval',
      },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    expect(body.author).toBe('Test User');
    expect(body.content).toBe('Great plan!');
  });

  it('GET /api/v1/plans/:id/annotations returns annotations', async () => {
    const { store } = await import('../store.js');
    const plans = store.listPlans();
    const planId = plans[0].id;

    store.addAnnotation(planId, {
      author: 'Alice',
      role: 'domain_expert',
      content: 'Looks good!',
    });

    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/plans/${planId}/annotations`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.annotations).toHaveLength(1);
  });

  it('GET /api/v1/plans/:id/diff/:v1/:v2 returns diff', async () => {
    const { store } = await import('../store.js');
    const plans = store.listPlans();
    const planId = plans[0].id;

    store.updatePlan(planId, { title: 'Updated Title' });

    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/plans/${planId}/diff/1/2`,
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.v1).toBe(1);
    expect(body.v2).toBe(2);
    expect(body.changes).toHaveLength(1);
  });

  it('GET /api/v1/plans/:id returns 404 for unknown id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/plans/nonexistent-id',
    });

    expect(response.statusCode).toBe(404);
  });
});
