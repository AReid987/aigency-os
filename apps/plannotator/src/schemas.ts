import { z } from 'zod';

// ─── Section Schemas ──────────────────────────────────────────────────────

export const SectionAccessRole = z.enum(['business', 'technical', 'architecture']);
export type SectionAccessRole = z.infer<typeof SectionAccessRole>;

export const PlanSectionSchema = z.object({
  id: z.string(),
  type: z.enum(['business', 'technical', 'architecture']),
  title: z.string().min(1).max(500),
  content: z.string(),
  accessRoles: z.array(z.enum(['domain_expert', 'technical_founder', 'agent'])),
});
export type PlanSection = z.infer<typeof PlanSectionSchema>;

// ─── Plan Schemas ─────────────────────────────────────────────────────────

export const CreatePlanSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional().default(''),
  source: z.enum(['paperclip', 'manual', 'plannotator']).optional().default('manual'),
  sections: z.array(PlanSectionSchema).optional().default([]),
});
export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;

// ─── Annotation Schemas ───────────────────────────────────────────────────

export const CreateAnnotationSchema = z.object({
  author: z.string().min(1).max(200),
  role: z.enum(['domain_expert', 'technical_founder', 'agent']),
  sectionId: z.string().optional(),
  content: z.string().min(1).max(5000),
  type: z.enum(['comment', 'suggestion', 'concern', 'approval']).optional().default('comment'),
});
export type CreateAnnotationInput = z.infer<typeof CreateAnnotationSchema>;
