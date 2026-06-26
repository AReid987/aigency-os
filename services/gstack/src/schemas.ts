import { z } from 'zod';

// ─── Job Status ──────────────────────────────────────────────────────────

export const JobStatusEnum = z.enum([
  'pending',
  'planning',
  'in_progress',
  'qa',
  'shipping',
  'done',
  'failed',
]);

export type JobStatus = z.infer<typeof JobStatusEnum>;

// ─── Build Job ───────────────────────────────────────────────────────────

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

// ─── Skill ───────────────────────────────────────────────────────────────

export interface Skill {
  id: string;
  name: string;
  description: string;
  version: string;
  createdAt: string;
}

// ─── Autoplan Schema ─────────────────────────────────────────────────────

export const AutoplanSchema = z.object({
  spec: z.string().min(1).max(10000),
  skills: z.array(z.string()).optional().default([]),
  priority: z.enum(['P0', 'P1', 'P2']).optional().default('P1'),
});

export type AutoplanInput = z.infer<typeof AutoplanSchema>;

// ─── Ship Schema ─────────────────────────────────────────────────────────

export const ShipSchema = z.object({
  jobId: z.string().uuid().optional(),
  target: z.string().min(1).max(500),
  spec: z.string().min(1).max(10000),
  skills: z.array(z.string()).optional().default([]),
});

export type ShipInput = z.infer<typeof ShipSchema>;

// ─── QA Schema ───────────────────────────────────────────────────────────

export const QASchema = z.object({
  jobId: z.string().uuid().optional(),
  spec: z.string().min(1).max(10000),
  criteria: z.array(z.string()).optional().default([]),
  skills: z.array(z.string()).optional().default([]),
});

export type QAInput = z.infer<typeof QASchema>;

// ─── Design Schema ───────────────────────────────────────────────────────

export const DesignSchema = z.object({
  spec: z.string().min(1).max(10000),
  style: z.string().max(500).optional(),
  skills: z.array(z.string()).optional().default([]),
});

export type DesignInput = z.infer<typeof DesignSchema>;
