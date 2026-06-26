// ─── DenchClaw (CRM / Outreach) Types ───────────────────────────────────────

export type PipelineStage =
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  tags: string[];
  source: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  contactId: string;
  stage: PipelineStage;
  value: number;
  currency: string;
  notes: string;
}

export interface OutreachStep {
  id: string;
  order: number;
  channel: 'email' | 'linkedin' | 'call' | 'other';
  template: string;
  delayDays: number;
}

export interface OutreachSequence {
  id: string;
  name: string;
  steps: OutreachStep[];
  contactIds: string[];
}

export interface Lead {
  id: string;
  contactId: string;
  score: number;
  status: 'new' | 'contacted' | 'engaged' | 'disqualified';
  lastActivity: string;
}
