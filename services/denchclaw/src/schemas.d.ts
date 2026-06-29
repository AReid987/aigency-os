import { z } from 'zod';
export declare const CreateContactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    company: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    company?: string | undefined;
    phone?: string | undefined;
    tags?: string[] | undefined;
}, {
    name: string;
    email: string;
    company?: string | undefined;
    phone?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const UpdateContactSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    tags: z.ZodOptional<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    email?: string | undefined;
    company?: string | undefined;
    phone?: string | undefined;
    tags?: string[] | undefined;
}, {
    name?: string | undefined;
    email?: string | undefined;
    company?: string | undefined;
    phone?: string | undefined;
    tags?: string[] | undefined;
}>;
export declare const CreateDealSchema: z.ZodObject<{
    title: z.ZodString;
    contactId: z.ZodString;
    value: z.ZodNumber;
    stage: z.ZodOptional<z.ZodEnum<["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]>>;
}, "strip", z.ZodTypeAny, {
    value: number;
    title: string;
    contactId: string;
    stage?: "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost" | undefined;
}, {
    value: number;
    title: string;
    contactId: string;
    stage?: "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost" | undefined;
}>;
export declare const UpdateDealStageSchema: z.ZodObject<{
    stage: z.ZodEnum<["lead", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]>;
}, "strip", z.ZodTypeAny, {
    stage: "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
}, {
    stage: "lead" | "qualified" | "proposal" | "negotiation" | "closed_won" | "closed_lost";
}>;
export declare const CreateSequenceSchema: z.ZodObject<{
    name: z.ZodString;
    steps: z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["email", "call", "task"]>;
        delayDays: z.ZodNumber;
        content: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "email" | "call" | "task";
        content: string;
        delayDays: number;
    }, {
        type: "email" | "call" | "task";
        content: string;
        delayDays: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    name: string;
    steps: {
        type: "email" | "call" | "task";
        content: string;
        delayDays: number;
    }[];
}, {
    name: string;
    steps: {
        type: "email" | "call" | "task";
        content: string;
        delayDays: number;
    }[];
}>;
export declare const UpdateLeadScoreSchema: z.ZodObject<{
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    score: number;
}, {
    score: number;
}>;
export type CreateContactInput = z.infer<typeof CreateContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
export type CreateDealInput = z.infer<typeof CreateDealSchema>;
export type UpdateDealStageInput = z.infer<typeof UpdateDealStageSchema>;
export type CreateSequenceInput = z.infer<typeof CreateSequenceSchema>;
export type UpdateLeadScoreInput = z.infer<typeof UpdateLeadScoreSchema>;
//# sourceMappingURL=schemas.d.ts.map