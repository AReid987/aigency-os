import { z } from 'zod';
export declare const CreateCanvasSchema: z.ZodObject<{
    name: z.ZodString;
    valueProposition: z.ZodString;
    customerSegments: z.ZodArray<z.ZodString, "many">;
    channels: z.ZodArray<z.ZodString, "many">;
    revenueStreams: z.ZodArray<z.ZodString, "many">;
    costStructure: z.ZodArray<z.ZodString, "many">;
    keyActivities: z.ZodArray<z.ZodString, "many">;
    keyResources: z.ZodArray<z.ZodString, "many">;
    keyPartners: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    valueProposition: string;
    customerSegments: string[];
    channels: string[];
    revenueStreams: string[];
    costStructure: string[];
    keyActivities: string[];
    keyResources: string[];
    keyPartners: string[];
}, {
    name: string;
    valueProposition: string;
    customerSegments: string[];
    channels: string[];
    revenueStreams: string[];
    costStructure: string[];
    keyActivities: string[];
    keyResources: string[];
    keyPartners: string[];
}>;
export declare const CreateRevenueModelSchema: z.ZodObject<{
    canvasId: z.ZodString;
    modelType: z.ZodString;
    pricingStrategy: z.ZodString;
    unitPrice: z.ZodNumber;
    projectedVolume: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    canvasId: string;
    modelType: string;
    pricingStrategy: string;
    unitPrice: number;
    projectedVolume: number;
    currency: string;
}, {
    canvasId: string;
    modelType: string;
    pricingStrategy: string;
    unitPrice: number;
    projectedVolume: number;
    currency?: string | undefined;
}>;
export declare const CalculateUnitEconomicsSchema: z.ZodObject<{
    unitPrice: z.ZodNumber;
    costPerUnit: z.ZodNumber;
    fixedCosts: z.ZodNumber;
    projectedVolume: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    unitPrice: number;
    projectedVolume: number;
    costPerUnit: number;
    fixedCosts: number;
}, {
    unitPrice: number;
    projectedVolume: number;
    costPerUnit: number;
    fixedCosts: number;
}>;
export declare const CreateMilestoneSchema: z.ZodObject<{
    canvasId: z.ZodString;
    title: z.ZodString;
    description: z.ZodDefault<z.ZodString>;
    targetDate: z.ZodString;
    gateCriteria: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    canvasId: string;
    title: string;
    description: string;
    targetDate: string;
    gateCriteria: string[];
}, {
    canvasId: string;
    title: string;
    targetDate: string;
    description?: string | undefined;
    gateCriteria?: string[] | undefined;
}>;
export declare const UpdateGateStatusSchema: z.ZodObject<{
    gateStatus: z.ZodEnum<["pending", "passed", "failed", "deferred"]>;
}, "strip", z.ZodTypeAny, {
    gateStatus: "pending" | "passed" | "failed" | "deferred";
}, {
    gateStatus: "pending" | "passed" | "failed" | "deferred";
}>;
export declare const CreateCompetitiveAnalysisSchema: z.ZodObject<{
    canvasId: z.ZodString;
    competitorName: z.ZodString;
    strengths: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    weaknesses: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    marketShare: z.ZodNumber;
    pricingComparison: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    canvasId: string;
    competitorName: string;
    strengths: string[];
    weaknesses: string[];
    marketShare: number;
    pricingComparison: string;
}, {
    canvasId: string;
    competitorName: string;
    marketShare: number;
    strengths?: string[] | undefined;
    weaknesses?: string[] | undefined;
    pricingComparison?: string | undefined;
}>;
export type CreateCanvasInput = z.infer<typeof CreateCanvasSchema>;
export type CreateRevenueModelInput = z.infer<typeof CreateRevenueModelSchema>;
export type CalculateUnitEconomicsInput = z.infer<typeof CalculateUnitEconomicsSchema>;
export type CreateMilestoneInput = z.infer<typeof CreateMilestoneSchema>;
export type UpdateGateStatusInput = z.infer<typeof UpdateGateStatusSchema>;
export type CreateCompetitiveAnalysisInput = z.infer<typeof CreateCompetitiveAnalysisSchema>;
//# sourceMappingURL=schemas.d.ts.map