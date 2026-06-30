import { z } from 'zod';
// ─── Domains ──────────────────────────────────────────────────────────────
export const DOMAIN_LIST = [
    'security', 'performance', 'scalability', 'reliability',
    'maintainability', 'testability', 'usability', 'accessibility',
    'data_integrity', 'api_design', 'architecture', 'documentation',
    'compliance', 'cost_efficiency',
];
// ─── Audit Schemas ────────────────────────────────────────────────────────
export const CreateAuditSchema = z.object({
    project: z.string().min(1).max(200),
    domains: z.array(z.enum(DOMAIN_LIST)).min(1).optional(),
});
export const TransformSchema = z.object({
    auditId: z.string().uuid(),
});
export const AddPersonaEvaluationSchema = z.object({
    persona: z.string().min(1).max(100),
    role: z.string().min(1).max(100),
    evaluation: z.string().min(1).max(5000),
    concerns: z.array(z.string()).optional().default([]),
    approval: z.enum(['approve', 'reject', 'conditional']),
    conditions: z.array(z.string()).optional().default([]),
});
//# sourceMappingURL=schemas.js.map