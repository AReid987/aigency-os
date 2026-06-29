import { z } from 'zod';
export declare const CreatePlanSchema: z.ZodObject<{
    prd: z.ZodString;
}, "strip", z.ZodTypeAny, {
    prd: string;
}, {
    prd: string;
}>;
export declare const ApplyPlanSchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const UnifySchema: z.ZodObject<{}, "strip", z.ZodTypeAny, {}, {}>;
export declare const UpdateCriteriaStatusSchema: z.ZodObject<{
    status: z.ZodEnum<["pending", "passed", "failed"]>;
}, "strip", z.ZodTypeAny, {
    status: "pending" | "passed" | "failed";
}, {
    status: "pending" | "passed" | "failed";
}>;
export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export type ApplyPlanInput = z.infer<typeof ApplyPlanSchema>;
export type UnifyInput = z.infer<typeof UnifySchema>;
export type UpdateCriteriaStatusInput = z.infer<typeof UpdateCriteriaStatusSchema>;
//# sourceMappingURL=schemas.d.ts.map