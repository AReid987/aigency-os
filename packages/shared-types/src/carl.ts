// ─── Carl (Classifier / Router) Types ───────────────────────────────────────

export type RuleAction = 'route' | 'reject' | 'escalate' | 'transform' | 'enrich';
export type IntentConfidence = 'high' | 'medium' | 'low';
export type DomainCategory = 'business' | 'engineering' | 'design' | 'operations' | 'legal' | 'finance';

export interface CarlRule {
  id: string;
  name: string;
  description: string;
  domain: string;
  conditions: { field: string; operator: 'equals' | 'contains' | 'matches' | 'gt' | 'lt'; value: string | number }[];
  action: RuleAction;
  target: string;
  priority: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RuleSet {
  id: string;
  name: string;
  description: string;
  rules: CarlRule[];
  version: number;
  active: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Intent {
  id: string;
  label: string;
  description: string;
  domain: string;
  keywords: string[];
  examples: string[];
  confidence: IntentConfidence;
  handler: string | null;
}

export interface Domain {
  id: string;
  name: string;
  category: DomainCategory;
  description: string;
  intents: string[];
  rules: string[];
  owner: string;
  metadata: Record<string, unknown>;
}
