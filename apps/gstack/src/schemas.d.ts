import { z } from 'zod';
export declare const JobStatusEnum: z.ZodEnum<["pending", "planning", "in_progress", "qa", "shipping", "done", "failed"]>;
export type JobStatus = z.infer<typeof JobStatusEnum>;
export interface BuildJob {
    id: string;
    type: 'autoplan' | 'ship' | 'qa' | 'design';
    spec: string;
    status: JobStatus;
    skills: string[];
    output: string | null;
    createdAt: string;
    updatedAt: string;
}
export interface Skill {
    id: string;
    name: string;
    description: string;
    version: string;
    createdAt: string;
}
export declare const AutoplanSchema: z.ZodObject<{
    spec: z.ZodString;
    skills: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    priority: z.ZodDefault<z.ZodOptional<z.ZodEnum<["P0", "P1", "P2"]>>>;
}, "strip", z.ZodTypeAny, {
    priority: "P0" | "P1" | "P2";
    spec: string;
    skills: string[];
}, {
    spec: string;
    priority?: "P0" | "P1" | "P2" | undefined;
    skills?: string[] | undefined;
}>;
export type AutoplanInput = z.infer<typeof AutoplanSchema>;
export declare const ShipSchema: z.ZodObject<{
    jobId: z.ZodOptional<z.ZodString>;
    target: z.ZodString;
    spec: z.ZodString;
    skills: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    target: string;
    spec: string;
    skills: string[];
    jobId?: string | undefined;
}, {
    target: string;
    spec: string;
    skills?: string[] | undefined;
    jobId?: string | undefined;
}>;
export type ShipInput = z.infer<typeof ShipSchema>;
export declare const QASchema: z.ZodObject<{
    jobId: z.ZodOptional<z.ZodString>;
    spec: z.ZodString;
    criteria: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    skills: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    spec: string;
    skills: string[];
    criteria: string[];
    jobId?: string | undefined;
}, {
    spec: string;
    skills?: string[] | undefined;
    jobId?: string | undefined;
    criteria?: string[] | undefined;
}>;
export type QAInput = z.infer<typeof QASchema>;
export declare const DesignSchema: z.ZodObject<{
    spec: z.ZodString;
    style: z.ZodOptional<z.ZodString>;
    skills: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    spec: string;
    skills: string[];
    style?: string | undefined;
}, {
    spec: string;
    skills?: string[] | undefined;
    style?: string | undefined;
}>;
export type DesignInput = z.infer<typeof DesignSchema>;
//# sourceMappingURL=schemas.d.ts.map