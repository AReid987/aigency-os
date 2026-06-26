// ─── BMAD Types ─────────────────────────────────────────────────────────────

export type BusinessModelType = 'B2B' | 'B2C' | 'B2B2C' | 'marketplace' | 'SaaS' | 'usage_based' | 'freemium';
export type MilestoneStatus = 'planned' | 'in_progress' | 'achieved' | 'missed' | 'deferred';
export type GateDecision = 'pass' | 'fail' | 'conditional_pass' | 'defer';

export interface RevenueStream {
  id: string;
  name: string;
  type: 'subscription' | 'transaction' | 'licensing' | 'advertising' | 'usage' | 'one_time';
  projectedMRR: number;
  actualMRR: number;
  growthRate: number;
  unitEconomics: {
    cac: number;
    ltv: number;
    paybackMonths: number;
  };
}

export interface RevenueModel {
  id: string;
  streams: RevenueStream[];
  totalProjectedMRR: number;
  totalActualMRR: number;
  currency: string;
  forecastMonths: number;
  updatedAt: string;
}

export interface BusinessModel {
  id: string;
  name: string;
  type: BusinessModelType;
  description: string;
  revenueModel: RevenueModel;
  milestones: Milestone[];
  competitiveAnalysis: CompetitiveAnalysis;
  canvas: BusinessModelCanvas;
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  businessModelId: string;
  title: string;
  description: string;
  targetDate: string;
  status: MilestoneStatus;
  metrics: Record<string, number>;
  dependencies: string[];
}

export interface GateStatus {
  id: string;
  milestoneId: string;
  decision: GateDecision;
  criteria: { metric: string; threshold: number; actual: number; passed: boolean }[];
  reviewedBy: string;
  reviewedAt: string;
  notes: string;
}

export interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: number;
  pricing: string;
}

export interface CompetitiveAnalysis {
  id: string;
  businessModelId: string;
  competitors: Competitor[];
  differentiators: string[];
  moat: string;
  riskFactors: string[];
  updatedAt: string;
}

export interface BusinessModelCanvas {
  id: string;
  businessModelId: string;
  keyPartners: string[];
  keyActivities: string[];
  keyResources: string[];
  valuePropositions: string[];
  customerRelationships: string[];
  channels: string[];
  customerSegments: string[];
  costStructure: string[];
  revenueStreams: string[];
  updatedAt: string;
}
