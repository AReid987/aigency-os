import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { z } from 'zod';

const ContinuousAuditSchema = z.object({
  target: z.string().min(1).max(500),
  trigger: z.enum(['manual', 'scheduled', 'event']),
  domains: z
    .array(
      z.enum([
        'security',
        'performance',
        'scalability',
        'reliability',
        'maintainability',
        'testability',
        'usability',
        'accessibility',
        'data_integrity',
        'api_design',
        'architecture',
        'documentation',
        'compliance',
        'cost_efficiency',
      ]),
    )
    .optional(),
});

export async function continuousRoutes(app: FastifyInstance) {
  // POST /api/v1/audit/continuous — run continuous audit on a target
  app.post('/api/v1/audit/continuous', async (request, reply) => {
    const parsed = ContinuousAuditSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const { target, trigger, domains } = parsed.data;

    // Create an audit against the target
    const audit = store.createAudit({
      project: target,
      domains,
    });

    // Classify findings by severity
    const criticalFindings = audit.findings.filter((f) => f.severity === 'critical');
    const highFindings = audit.findings.filter((f) => f.severity === 'high');
    const mediumFindings = audit.findings.filter((f) => f.severity === 'medium');
    const lowFindings = audit.findings.filter((f) => f.severity === 'low');

    return {
      auditId: audit.id,
      target,
      trigger,
      overallScore: audit.overallScore,
      status: audit.status,
      findings: {
        total: audit.findings.length,
        critical: criticalFindings.length,
        high: highFindings.length,
        medium: mediumFindings.length,
        low: lowFindings.length,
      },
      details: audit.findings.map((f) => ({
        id: f.id,
        domain: f.domain,
        title: f.title,
        severity: f.severity,
        confidence: f.confidence,
        recommendation: f.recommendation,
      })),
      createdAt: audit.createdAt,
    };
  });
}
