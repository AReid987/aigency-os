import { z } from 'zod';
// ─── Plan Schemas ─────────────────────────────────────────────────────────
export const CreatePlanSchema = z.object({
    prd: z.string().min(1).max(10000),
});
export const ApplyPlanSchema = z.object({
// No body required — applies all pending tasks in the plan
});
export const UnifySchema = z.object({
// No body required — generates TECH-SPEC from plan state
});
export const UpdateCriteriaStatusSchema = z.object({
    status: z.enum(['pending', 'passed', 'failed']),
});
//# sourceMappingURL=schemas.js.map