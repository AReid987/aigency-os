import { z } from 'zod';

// ─── Contact Schemas ─────────────────────────────────────────────────────

export const CreateContactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email(),
  company: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  tags: z.array(z.string()).optional(),
});

export const UpdateContactSchema = CreateContactSchema.partial();

// ─── Deal Schemas ────────────────────────────────────────────────────────

export const CreateDealSchema = z.object({
  title: z.string().min(1).max(300),
  contactId: z.string().uuid(),
  value: z.number().min(0),
  stage: z.enum(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']).optional(),
});

export const UpdateDealStageSchema = z.object({
  stage: z.enum(['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost']),
});

// ─── Sequence Schemas ────────────────────────────────────────────────────

export const CreateSequenceSchema = z.object({
  name: z.string().min(1).max(200),
  steps: z.array(z.object({
    type: z.enum(['email', 'call', 'task']),
    delayDays: z.number().min(0),
    content: z.string().max(5000),
  })),
});

// ─── Lead Schemas ────────────────────────────────────────────────────────

export const UpdateLeadScoreSchema = z.object({
  score: z.number().min(0).max(100),
});

// ─── Types ───────────────────────────────────────────────────────────────

export type CreateContactInput = z.infer<typeof CreateContactSchema>;
export type UpdateContactInput = z.infer<typeof UpdateContactSchema>;
export type CreateDealInput = z.infer<typeof CreateDealSchema>;
export type UpdateDealStageInput = z.infer<typeof UpdateDealStageSchema>;
export type CreateSequenceInput = z.infer<typeof CreateSequenceSchema>;
export type UpdateLeadScoreInput = z.infer<typeof UpdateLeadScoreSchema>;
