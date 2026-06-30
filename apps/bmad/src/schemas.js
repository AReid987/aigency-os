import { z } from 'zod';
// ─── Canvas Schemas ──────────────────────────────────────────────────────
export const CreateCanvasSchema = z.object({
    name: z.string().min(1).max(200),
    valueProposition: z.string().min(1).max(2000),
    customerSegments: z.array(z.string().min(1)).min(1),
    channels: z.array(z.string().min(1)).min(1),
    revenueStreams: z.array(z.string().min(1)).min(1),
    costStructure: z.array(z.string().min(1)),
    keyActivities: z.array(z.string().min(1)),
    keyResources: z.array(z.string().min(1)),
    keyPartners: z.array(z.string().min(1)),
});
// ─── Revenue Model Schemas ──────────────────────────────────────────────
export const CreateRevenueModelSchema = z.object({
    canvasId: z.string().uuid(),
    modelType: z.string().min(1).max(100),
    pricingStrategy: z.string().min(1).max(200),
    unitPrice: z.number().positive(),
    projectedVolume: z.number().int().positive(),
    currency: z.string().min(3).max(3).default('USD'),
});
export const CalculateUnitEconomicsSchema = z.object({
    unitPrice: z.number().positive(),
    costPerUnit: z.number().nonnegative(),
    fixedCosts: z.number().nonnegative(),
    projectedVolume: z.number().int().positive(),
});
// ─── Milestone Schemas ──────────────────────────────────────────────────
export const CreateMilestoneSchema = z.object({
    canvasId: z.string().uuid(),
    title: z.string().min(1).max(500),
    description: z.string().max(5000).default(''),
    targetDate: z.string().datetime(),
    gateCriteria: z.array(z.string().min(1)).default([]),
});
export const UpdateGateStatusSchema = z.object({
    gateStatus: z.enum(['pending', 'passed', 'failed', 'deferred']),
});
// ─── Competitive Analysis Schemas ──────────────────────────────────────
export const CreateCompetitiveAnalysisSchema = z.object({
    canvasId: z.string().uuid(),
    competitorName: z.string().min(1).max(200),
    strengths: z.array(z.string().min(1)).default([]),
    weaknesses: z.array(z.string().min(1)).default([]),
    marketShare: z.number().min(0).max(100),
    pricingComparison: z.string().max(2000).default(''),
});
//# sourceMappingURL=schemas.js.map