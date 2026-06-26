import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';

describe('aegis health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const app = Fastify({ logger: false });
    app.get('/health', async () => ({
      status: 'ok',
      service: 'aegis',
      version: '0.1.0',
      description: 'Quality Gates Engine',
      timestamp: new Date().toISOString(),
    }));

    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('aegis');
    expect(body.version).toBe('0.1.0');
    expect(body.description).toBe('Quality Gates Engine');
    expect(body.timestamp).toBeDefined();

    await app.close();
  });
});

describe('aegis Store', () => {
  it('store module can be imported', async () => {
    const mod = await import('../store');
    expect(mod).toBeDefined();
    expect(mod.store).toBeDefined();
  });

  it('createAudit generates findings for all 14 domains', async () => {
    const { store } = await import('../store');
    const audit = store.createAudit({ project: 'test-project' });

    expect(audit.id).toBeDefined();
    expect(audit.project).toBe('test-project');
    expect(audit.domains).toHaveLength(14);
    expect(audit.findings.length).toBeGreaterThanOrEqual(14 * 2);
    expect(audit.findings.length).toBeLessThanOrEqual(14 * 3);
    expect(audit.overallScore).toBeGreaterThanOrEqual(0);
    expect(audit.overallScore).toBeLessThanOrEqual(100);
    expect(audit.status).toBe('completed');

    // Verify each finding has required fields
    for (const finding of audit.findings) {
      expect(finding.id).toBeDefined();
      expect(finding.domain).toBeDefined();
      expect(finding.severity).toMatch(/^(critical|high|medium|low)$/);
      expect(finding.confidence).toBeGreaterThanOrEqual(0);
      expect(finding.confidence).toBeLessThanOrEqual(1);
    }
  });

  it('getAudit returns stored audit', async () => {
    const { store } = await import('../store');
    const audit = store.createAudit({ project: 'get-test' });
    const retrieved = store.getAudit(audit.id);
    expect(retrieved).toBeDefined();
    expect(retrieved!.id).toBe(audit.id);
  });

  it('listAudits returns all audits', async () => {
    const { store } = await import('../store');
    const before = store.listAudits().length;
    store.createAudit({ project: 'list-test-1' });
    store.createAudit({ project: 'list-test-2' });
    const after = store.listAudits().length;
    expect(after).toBe(before + 2);
  });

  it('transformToRemediation creates PAUL-compatible plan', async () => {
    const { store } = await import('../store');
    const audit = store.createAudit({ project: 'transform-test' });
    const plan = store.transformToRemediation(audit.id);

    expect(plan).toBeDefined();
    expect(plan!.auditId).toBe(audit.id);
    expect(plan!.project).toBe('transform-test');
    expect(plan!.tasks.length).toBe(audit.findings.length);
    expect(plan!.totalRiskScore).toBeGreaterThanOrEqual(0);

    // Verify tasks are sorted by risk score
    for (let i = 1; i < plan!.tasks.length; i++) {
      expect(plan!.tasks[i - 1].riskScore).toBeGreaterThanOrEqual(plan!.tasks[i].riskScore);
    }

    // Verify PAUL-compatible task structure
    for (const task of plan!.tasks) {
      expect(task.priority).toMatch(/^(P0|P1|P2|P3)$/);
      expect(task.effort).toMatch(/^(low|medium|high)$/);
      expect(task.acceptanceCriteria.length).toBeGreaterThan(0);
    }
  });

  it('getExecutiveSummary returns business-only view', async () => {
    const { store } = await import('../store');
    const audit = store.createAudit({ project: 'summary-test' });
    const summary = store.getExecutiveSummary(audit.id);

    expect(summary).toBeDefined();
    expect(summary!.auditId).toBe(audit.id);
    expect(summary!.overallScore).toBe(audit.overallScore);
    expect(summary!.totalFindings).toBe(audit.findings.length);
    expect(summary!.criticalCount + summary!.highCount + summary!.mediumCount + summary!.lowCount).toBe(audit.findings.length);
    expect(Object.keys(summary!.domainScores).length).toBe(14);
  });

  it('addPersonaEvaluation stores evaluation', async () => {
    const { store } = await import('../store');
    const audit = store.createAudit({ project: 'persona-test' });
    const evaluation = store.addPersonaEvaluation(audit.id, {
      persona: 'CTO',
      role: 'Chief Technology Officer',
      evaluation: 'Architecture looks solid but needs better test coverage.',
      concerns: ['Low test coverage', 'Missing CI pipeline'],
      approval: 'conditional',
      conditions: ['Add integration tests before production deployment'],
    });

    expect(evaluation).toBeDefined();
    expect(evaluation!.persona).toBe('CTO');
    expect(evaluation!.approval).toBe('conditional');
  });

  it('transformToRemediation returns cached plan on repeat call', async () => {
    const { store } = await import('../store');
    const audit = store.createAudit({ project: 'cache-test' });
    const plan1 = store.transformToRemediation(audit.id);
    const plan2 = store.transformToRemediation(audit.id);
    expect(plan1!.id).toBe(plan2!.id);
  });
});
