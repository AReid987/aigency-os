import { z } from 'zod';
export declare const SkillCategorySchema: z.ZodEnum<["automation", "analytics", "integration", "workflow", "ai", "security", "devops", "communication"]>;
export declare const SkillSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodString;
    category: z.ZodEnum<["automation", "analytics", "integration", "workflow", "ai", "security", "devops", "communication"]>;
    version: z.ZodString;
    author: z.ZodString;
    icon: z.ZodOptional<z.ZodString>;
    tags: z.ZodArray<z.ZodString, "many">;
    downloads: z.ZodNumber;
    rating: z.ZodNumber;
    ratingCount: z.ZodNumber;
    configSchema: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    version: string;
    id: string;
    createdAt: string;
    name: string;
    description: string;
    tags: string[];
    updatedAt: string;
    author: string;
    rating: number;
    category: "security" | "integration" | "automation" | "analytics" | "workflow" | "ai" | "devops" | "communication";
    downloads: number;
    ratingCount: number;
    icon?: string | undefined;
    configSchema?: Record<string, unknown> | undefined;
}, {
    version: string;
    id: string;
    createdAt: string;
    name: string;
    description: string;
    tags: string[];
    updatedAt: string;
    author: string;
    rating: number;
    category: "security" | "integration" | "automation" | "analytics" | "workflow" | "ai" | "devops" | "communication";
    downloads: number;
    ratingCount: number;
    icon?: string | undefined;
    configSchema?: Record<string, unknown> | undefined;
}>;
export declare const InstallSkillSchema: z.ZodObject<{
    config: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    environment: z.ZodDefault<z.ZodOptional<z.ZodEnum<["development", "staging", "production"]>>>;
}, "strip", z.ZodTypeAny, {
    environment: "development" | "staging" | "production";
    config?: Record<string, unknown> | undefined;
}, {
    config?: Record<string, unknown> | undefined;
    environment?: "development" | "staging" | "production" | undefined;
}>;
export declare const RateSkillSchema: z.ZodObject<{
    rating: z.ZodNumber;
    review: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    rating: number;
    review?: string | undefined;
}, {
    rating: number;
    review?: string | undefined;
}>;
export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type InstallSkillInput = z.infer<typeof InstallSkillSchema>;
export type RateSkillInput = z.infer<typeof RateSkillSchema>;
//# sourceMappingURL=schemas.d.ts.map