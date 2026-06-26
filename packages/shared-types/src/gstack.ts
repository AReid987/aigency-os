// ─── GStack (Build / Skill Engine) Types ────────────────────────────────────

export type BuildJobStatus = 'queued' | 'running' | 'success' | 'failed' | 'cancelled';
export type BuildStepType = 'fetch' | 'transform' | 'validate' | 'generate' | 'deploy' | 'notify';
export type SkillTrigger = 'manual' | 'event' | 'schedule' | 'webhook';

export interface BuildStep {
  id: string;
  jobId: string;
  type: BuildStepType;
  name: string;
  status: BuildJobStatus;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
  error: string | null;
}

export interface BuildJob {
  id: string;
  name: string;
  steps: BuildStep[];
  status: BuildJobStatus;
  triggeredBy: string;
  trigger: SkillTrigger;
  context: Record<string, unknown>;
  startedAt: string;
  finishedAt: string | null;
  totalDurationMs: number | null;
  logs: string[];
}

export interface SkillInvocation {
  id: string;
  skillName: string;
  jobId: string | null;
  trigger: SkillTrigger;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  status: BuildJobStatus;
  invokedBy: string;
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  error: string | null;
}

export interface DesignOutput {
  id: string;
  invocationId: string;
  format: 'figma' | 'svg' | 'html' | 'css' | 'json' | 'markdown';
  content: string;
  metadata: Record<string, unknown>;
  artifacts: { name: string; url: string; mimeType: string }[];
  generatedAt: string;
}
