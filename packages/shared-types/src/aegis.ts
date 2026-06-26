// ─── Aegis (Audit Engine) Types ──────────────────────────────────────────────

export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface Finding {
  id: string;
  domain: string;
  severity: FindingSeverity;
  description: string;
  confidence: number;
  evidence: string[];
  persona: string;
}

export interface Persona {
  id: string;
  name: string;
  type: string;
  perspective: string;
}

export interface AuditDomain {
  id: string;
  name: string;
  score: number;
  findings: Finding[];
}

export interface ConfidenceScore {
  value: number; // 0–1
  evidence: string[];
  methodology: string;
}

export interface RemediationTask {
  id: string;
  description: string;
  priority: 'P0' | 'P1' | 'P2';
  status: 'pending' | 'in_progress' | 'done';
  assignee: string | null;
}

export interface RemediationPlan {
  id: string;
  auditId: string;
  tasks: RemediationTask[];
  riskScore: number;
}

export interface AuditReport {
  id: string;
  project: string;
  domains: AuditDomain[];
  findings: Finding[];
  personas: Persona[];
  overallScore: number;
  createdAt: string;
}
