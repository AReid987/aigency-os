import { z } from 'zod';
export declare const PageTypeSchema: z.ZodEnum<["decision", "plan", "audit_finding", "assumption", "fact", "capture"]>;
export declare const ScopeSchema: z.ZodEnum<["business", "technical", "general"]>;
export declare const ConfidenceSchema: z.ZodEnum<["low", "medium", "high", "verified"]>;
export declare const CreatePageSchema: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    type: z.ZodEnum<["decision", "plan", "audit_finding", "assumption", "fact", "capture"]>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    scope: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["business", "technical", "general"]>, "many">>>;
    confidence: z.ZodDefault<z.ZodOptional<z.ZodEnum<["low", "medium", "high", "verified"]>>>;
    references: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    author: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    type: "decision" | "plan" | "audit_finding" | "assumption" | "fact" | "capture";
    content: string;
    title: string;
    tags: string[];
    scope: ("business" | "technical" | "general")[];
    confidence: "high" | "medium" | "low" | "verified";
    references: string[];
    author: string;
}, {
    type: "decision" | "plan" | "audit_finding" | "assumption" | "fact" | "capture";
    content: string;
    title: string;
    tags?: string[] | undefined;
    scope?: ("business" | "technical" | "general")[] | undefined;
    confidence?: "high" | "medium" | "low" | "verified" | undefined;
    references?: string[] | undefined;
    author?: string | undefined;
}>;
export declare const CaptureSchema: z.ZodObject<{
    source: z.ZodEnum<["paperclip", "hcom", "aegis", "plannotator", "bmad"]>;
    title: z.ZodString;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["decision", "plan", "audit_finding", "assumption", "fact", "capture"]>>>;
    tags: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    scope: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodEnum<["business", "technical", "general"]>, "many">>>;
}, "strip", z.ZodTypeAny, {
    type: "decision" | "plan" | "audit_finding" | "assumption" | "fact" | "capture";
    content: string;
    title: string;
    tags: string[];
    source: "paperclip" | "hcom" | "aegis" | "plannotator" | "bmad";
    scope: ("business" | "technical" | "general")[];
}, {
    content: string;
    title: string;
    source: "paperclip" | "hcom" | "aegis" | "plannotator" | "bmad";
    type?: "decision" | "plan" | "audit_finding" | "assumption" | "fact" | "capture" | undefined;
    tags?: string[] | undefined;
    scope?: ("business" | "technical" | "general")[] | undefined;
}>;
export declare const QueryParamsSchema: z.ZodObject<{
    q: z.ZodString;
    role: z.ZodOptional<z.ZodEnum<["domain_expert", "technical_founder"]>>;
}, "strip", z.ZodTypeAny, {
    q: string;
    role?: "domain_expert" | "technical_founder" | undefined;
}, {
    q: string;
    role?: "domain_expert" | "technical_founder" | undefined;
}>;
export type CreatePageInput = z.infer<typeof CreatePageSchema>;
export type CaptureInput = z.infer<typeof CaptureSchema>;
export type QueryParams = z.infer<typeof QueryParamsSchema>;
export type PageType = z.infer<typeof PageTypeSchema>;
export type Scope = z.infer<typeof ScopeSchema>;
export type Confidence = z.infer<typeof ConfidenceSchema>;
//# sourceMappingURL=schemas.d.ts.map