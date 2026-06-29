import { z } from 'zod';
// ─── Knowledge Page Schemas ─────────────────────────────────────────────
export const PageTypeSchema = z.enum([
    'decision',
    'plan',
    'audit_finding',
    'assumption',
    'fact',
    'capture',
]);
export const ScopeSchema = z.enum(['business', 'technical', 'general']);
export const ConfidenceSchema = z.enum(['low', 'medium', 'high', 'verified']);
export const CreatePageSchema = z.object({
    title: z.string().min(1).max(500),
    content: z.string().min(1).max(10000),
    type: PageTypeSchema,
    tags: z.array(z.string()).optional().default([]),
    scope: z.array(ScopeSchema).optional().default(['general']),
    confidence: ConfidenceSchema.optional().default('medium'),
    references: z.array(z.string()).optional().default([]),
    author: z.string().optional().default('system'),
});
export const CaptureSchema = z.object({
    source: z.enum(['paperclip', 'hcom', 'aegis', 'plannotator', 'bmad']),
    title: z.string().min(1).max(500),
    content: z.string().min(1).max(10000),
    type: PageTypeSchema.optional().default('capture'),
    tags: z.array(z.string()).optional().default([]),
    scope: z.array(ScopeSchema).optional().default(['general']),
});
export const QueryParamsSchema = z.object({
    q: z.string().min(1),
    role: z.enum(['domain_expert', 'technical_founder']).optional(),
});
//# sourceMappingURL=schemas.js.map