import { z } from 'zod';

// ─── Company Schemas ──────────────────────────────────────────────────────

export const CreateCompanySchema = z.object({
  name: z.string().min(1).max(200),
  mission: z.string().min(1).max(2000),
  goal: z.string().min(1).max(1000),
});

export const UpdateCompanySchema = z.object({
  name: z.string().min(1).max(200).optional(),
  mission: z.string().min(1).max(2000).optional(),
});

// ─── Agent Schemas ────────────────────────────────────────────────────────

export const HireAgentSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.enum(['CEO', 'CTO', 'CMO', 'Sales', 'Engineer', 'QA', 'Designer']),
  adapter: z.enum([
    'claude', 'codex', 'gemini', 'cursor', 'hermes',
    'kimi', 'omp', 'mimo', 'opencode', 'command',
    'blackbox', 'groq', 'mistral',
  ]),
  budget: z.number().positive(),
  reportingTo: z.string().uuid().nullable().optional(),
  heartbeatSchedule: z.enum(['4h', '8h', '12h', 'continuous']).optional().default('8h'),
});

export const UpdateAgentStatusSchema = z.object({
  status: z.enum(['active', 'paused', 'terminated']),
});

// ─── Goal Schemas ─────────────────────────────────────────────────────────

export const CreateGoalSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional().default(''),
  parentGoalId: z.string().uuid().nullable().optional(),
  priority: z.enum(['P0', 'P1', 'P2']).optional().default('P1'),
});

export const UpdateGoalStatusSchema = z.object({
  status: z.enum(['backlog', 'in_progress', 'done', 'blocked']),
});

// ─── Task Schemas ─────────────────────────────────────────────────────────

export const CreateTaskSchema = z.object({
  goalId: z.string().uuid(),
  assigneeId: z.string().uuid(),
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional().default(''),
  acceptanceCriteria: z.array(z.string()).optional().default([]),
  priority: z.enum(['P0', 'P1', 'P2']).optional().default('P1'),
});

export const UpdateTaskStatusSchema = z.object({
  status: z.enum(['backlog', 'in_progress', 'review', 'done', 'rejected']),
});

// ─── Ticket Schemas ───────────────────────────────────────────────────────

export const CreateTicketSchema = z.object({
  title: z.string().min(1).max(500),
  description: z.string().max(5000).optional().default(''),
  assigneeId: z.string().uuid(),
  priority: z.enum(['P0', 'P1', 'P2']).optional().default('P1'),
});

export const UpdateTicketStatusSchema = z.object({
  status: z.enum(['backlog', 'in_progress', 'review', 'done', 'rejected']),
});

export const AddTicketCommentSchema = z.object({
  authorId: z.string().uuid(),
  content: z.string().min(1).max(5000),
});

// ─── Budget Schemas ───────────────────────────────────────────────────────

export const UpdateBudgetSchema = z.object({
  amount: z.number().positive(),
});

// ─── Board Approval Schemas ───────────────────────────────────────────────

export const BoardApprovalSchema = z.object({
  decisionType: z.enum(['hire', 'strategy', 'budget', 'termination', 'other']),
  decisionId: z.string().uuid(),
  approval: z.enum(['approve', 'reject']),
  notes: z.string().max(2000).optional().default(''),
});

// ─── Heartbeat Schema ─────────────────────────────────────────────────────

export const HeartbeatSchema = z.object({
  agentId: z.string().uuid(),
  status: z.enum(['active', 'thinking', 'blocked']).optional(),
  currentTask: z.string().uuid().nullable().optional(),
});

// ─── Types ────────────────────────────────────────────────────────────────

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;
export type HireAgentInput = z.infer<typeof HireAgentSchema>;
export type UpdateAgentStatusInput = z.infer<typeof UpdateAgentStatusSchema>;
export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;
export type UpdateGoalStatusInput = z.infer<typeof UpdateGoalStatusSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusSchema>;
export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;
export type UpdateTicketStatusInput = z.infer<typeof UpdateTicketStatusSchema>;
export type AddTicketCommentInput = z.infer<typeof AddTicketCommentSchema>;
export type UpdateBudgetInput = z.infer<typeof UpdateBudgetSchema>;
export type BoardApprovalInput = z.infer<typeof BoardApprovalSchema>;
export type HeartbeatInput = z.infer<typeof HeartbeatSchema>;
