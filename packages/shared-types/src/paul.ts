// ─── Paul (Planner) Types ───────────────────────────────────────────────────

export type PaulTaskStatus = 'draft' | 'ready' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
export type PaulTaskPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type UnifyConfidence = 'high' | 'medium' | 'low';

export interface AcceptanceCriteria {
  id: string;
  taskId: string;
  description: string;
  type: 'functional' | 'non_functional' | 'constraint';
  met: boolean;
  verifiedAt: string | null;
  verifiedBy: string | null;
}

export interface PaulTask {
  id: string;
  planId: string;
  title: string;
  description: string;
  status: PaulTaskStatus;
  priority: PaulTaskPriority;
  assigneeId: string | null;
  acceptanceCriteria: AcceptanceCriteria[];
  dependencies: string[];
  estimatedHours: number;
  actualHours: number | null;
  context: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PaulPlan {
  id: string;
  title: string;
  description: string;
  goalId: string;
  tasks: PaulTask[];
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface UnifyResult {
  id: string;
  planId: string;
  sources: string[];
  mergedTasks: PaulTask[];
  conflicts: { taskId: string; source1: string; source2: string; resolution: string }[];
  confidence: UnifyConfidence;
  generatedAt: string;
}

export interface TechSpec {
  id: string;
  taskId: string;
  title: string;
  overview: string;
  architecture: Record<string, unknown>;
  apiContracts: { endpoint: string; method: string; description: string }[];
  dataModels: { name: string; schema: Record<string, unknown> }[];
  dependencies: string[];
  risks: { description: string; mitigation: string }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
