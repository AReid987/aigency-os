import { z } from 'zod';
export declare const SectionAccessRole: z.ZodEnum<["business", "technical", "architecture"]>;
export type SectionAccessRole = z.infer<typeof SectionAccessRole>;
export declare const PlanSectionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<["business", "technical", "architecture"]>;
    title: z.ZodString;
    content: z.ZodString;
    accessRoles: z.ZodArray<z.ZodEnum<["domain_expert", "technical_founder", "agent"]>, "many">;
}, "strip", z.ZodTypeAny, {
    type: "architecture" | "business" | "technical";
    content: string;
    id: string;
    title: string;
    accessRoles: ("domain_expert" | "technical_founder" | "agent")[];
}, {
    type: "architecture" | "business" | "technical";
    content: string;
    id: string;
    title: string;
    accessRoles: ("domain_expert" | "technical_founder" | "agent")[];
}>;
export type PlanSection = z.infer<typeof PlanSectionSchema>;
export declare const CreatePlanSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    source: z.ZodDefault<z.ZodOptional<z.ZodEnum<["paperclip", "manual", "plannotator"]>>>;
    sections: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<["business", "technical", "architecture"]>;
        title: z.ZodString;
        content: z.ZodString;
        accessRoles: z.ZodArray<z.ZodEnum<["domain_expert", "technical_founder", "agent"]>, "many">;
    }, "strip", z.ZodTypeAny, {
        type: "architecture" | "business" | "technical";
        content: string;
        id: string;
        title: string;
        accessRoles: ("domain_expert" | "technical_founder" | "agent")[];
    }, {
        type: "architecture" | "business" | "technical";
        content: string;
        id: string;
        title: string;
        accessRoles: ("domain_expert" | "technical_founder" | "agent")[];
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    description: string;
    source: "manual" | "paperclip" | "plannotator";
    sections: {
        type: "architecture" | "business" | "technical";
        content: string;
        id: string;
        title: string;
        accessRoles: ("domain_expert" | "technical_founder" | "agent")[];
    }[];
}, {
    title: string;
    description?: string | undefined;
    source?: "manual" | "paperclip" | "plannotator" | undefined;
    sections?: {
        type: "architecture" | "business" | "technical";
        content: string;
        id: string;
        title: string;
        accessRoles: ("domain_expert" | "technical_founder" | "agent")[];
    }[] | undefined;
}>;
export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export declare const CreateAnnotationSchema: z.ZodObject<{
    author: z.ZodString;
    role: z.ZodEnum<["domain_expert", "technical_founder", "agent"]>;
    sectionId: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    type: z.ZodDefault<z.ZodOptional<z.ZodEnum<["comment", "suggestion", "concern", "approval"]>>>;
}, "strip", z.ZodTypeAny, {
    type: "approval" | "comment" | "suggestion" | "concern";
    content: string;
    role: "domain_expert" | "technical_founder" | "agent";
    author: string;
    sectionId?: string | undefined;
}, {
    content: string;
    role: "domain_expert" | "technical_founder" | "agent";
    author: string;
    type?: "approval" | "comment" | "suggestion" | "concern" | undefined;
    sectionId?: string | undefined;
}>;
export type CreateAnnotationInput = z.infer<typeof CreateAnnotationSchema>;
//# sourceMappingURL=schemas.d.ts.map