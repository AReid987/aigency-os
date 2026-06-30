import { z } from 'zod';
export declare const DOMAIN_LIST: readonly ["security", "performance", "scalability", "reliability", "maintainability", "testability", "usability", "accessibility", "data_integrity", "api_design", "architecture", "documentation", "compliance", "cost_efficiency"];
export type Domain = (typeof DOMAIN_LIST)[number];
export declare const CreateAuditSchema: z.ZodObject<{
    project: z.ZodString;
    domains: z.ZodOptional<z.ZodArray<z.ZodEnum<["security", "performance", "scalability", "reliability", "maintainability", "testability", "usability", "accessibility", "data_integrity", "api_design", "architecture", "documentation", "compliance", "cost_efficiency"]>, "many">>;
}, "strip", z.ZodTypeAny, {
    project: string;
    domains?: ("security" | "performance" | "scalability" | "reliability" | "maintainability" | "testability" | "usability" | "accessibility" | "data_integrity" | "api_design" | "architecture" | "documentation" | "compliance" | "cost_efficiency")[] | undefined;
}, {
    project: string;
    domains?: ("security" | "performance" | "scalability" | "reliability" | "maintainability" | "testability" | "usability" | "accessibility" | "data_integrity" | "api_design" | "architecture" | "documentation" | "compliance" | "cost_efficiency")[] | undefined;
}>;
export declare const TransformSchema: z.ZodObject<{
    auditId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    auditId: string;
}, {
    auditId: string;
}>;
export declare const AddPersonaEvaluationSchema: z.ZodObject<{
    persona: z.ZodString;
    role: z.ZodString;
    evaluation: z.ZodString;
    concerns: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    approval: z.ZodEnum<["approve", "reject", "conditional"]>;
    conditions: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    persona: string;
    role: string;
    evaluation: string;
    concerns: string[];
    approval: "approve" | "reject" | "conditional";
    conditions: string[];
}, {
    persona: string;
    role: string;
    evaluation: string;
    approval: "approve" | "reject" | "conditional";
    concerns?: string[] | undefined;
    conditions?: string[] | undefined;
}>;
export type CreateAuditInput = z.infer<typeof CreateAuditSchema>;
export type TransformInput = z.infer<typeof TransformSchema>;
export type AddPersonaEvaluationInput = z.infer<typeof AddPersonaEvaluationSchema>;
//# sourceMappingURL=schemas.d.ts.map