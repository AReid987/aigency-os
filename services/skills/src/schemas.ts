import { z } from 'zod';

// ─── Skill Category ────────────────────────────────────────────────────

export const SkillCategorySchema = z.enum([
  'automation',
  'analytics',
  'integration',
  'workflow',
  'ai',
  'security',
  'devops',
  'communication',
]);

// ─── Skill Schemas ─────────────────────────────────────────────────────

export const SkillSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  category: SkillCategorySchema,
  version: z.string().min(1),
  author: z.string().min(1).max(200),
  icon: z.string().optional(),
  tags: z.array(z.string()),
  downloads: z.number().int().min(0),
  rating: z.number().min(0).max(5),
  ratingCount: z.number().int().min(0),
  configSchema: z.record(z.unknown()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const InstallSkillSchema = z.object({
  config: z.record(z.unknown()).optional(),
  environment: z.enum(['development', 'staging', 'production']).optional().default('development'),
});

export const RateSkillSchema = z.object({
  rating: z.number().int().min(1).max(5),
  review: z.string().max(2000).optional(),
});

// ─── Types ──────────────────────────────────────────────────────────────

export type SkillCategory = z.infer<typeof SkillCategorySchema>;
export type InstallSkillInput = z.infer<typeof InstallSkillSchema>;
export type RateSkillInput = z.infer<typeof RateSkillSchema>;
