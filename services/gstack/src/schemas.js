import { z } from 'zod';
// ─── Job Status ──────────────────────────────────────────────────────────
export const JobStatusEnum = z.enum([
    'pending',
    'planning',
    'in_progress',
    'qa',
    'shipping',
    'done',
    'failed',
]);
// ─── Autoplan Schema ─────────────────────────────────────────────────────
export const AutoplanSchema = z.object({
    spec: z.string().min(1).max(10000),
    skills: z.array(z.string()).optional().default([]),
    priority: z.enum(['P0', 'P1', 'P2']).optional().default('P1'),
});
// ─── Ship Schema ─────────────────────────────────────────────────────────
export const ShipSchema = z.object({
    jobId: z.string().uuid().optional(),
    target: z.string().min(1).max(500),
    spec: z.string().min(1).max(10000),
    skills: z.array(z.string()).optional().default([]),
});
// ─── QA Schema ───────────────────────────────────────────────────────────
export const QASchema = z.object({
    jobId: z.string().uuid().optional(),
    spec: z.string().min(1).max(10000),
    criteria: z.array(z.string()).optional().default([]),
    skills: z.array(z.string()).optional().default([]),
});
// ─── Design Schema ───────────────────────────────────────────────────────
export const DesignSchema = z.object({
    spec: z.string().min(1).max(10000),
    style: z.string().max(500).optional(),
    skills: z.array(z.string()).optional().default([]),
});
//# sourceMappingURL=schemas.js.map