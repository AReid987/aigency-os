// ─── BMAD Store Types ─────────────────────────────────────────────────────

export interface BusinessCanvas {
  id: string;
  name: string;
  valueProposition: string;
  customerSegments: string[];
  channels: string[];
  revenueStreams: string[];
  costStructure: string[];
  keyActivities: string[];
  keyResources: string[];
  keyPartners: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RevenueModel {
  id: string;
  canvasId: string;
  modelType: string;
  pricingStrategy: string;
  unitPrice: number;
  projectedVolume: number;
  currency: string;
  createdAt: string;
}

export interface UnitEconomics {
  revenuePerUnit: number;
  costPerUnit: number;
  marginPerUnit: number;
  marginPercent: number;
  breakEvenVolume: number;
}

export interface Milestone {
  id: string;
  canvasId: string;
  title: string;
  description: string;
  targetDate: string;
  gateStatus: 'pending' | 'passed' | 'failed' | 'deferred';
  gateCriteria: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CompetitiveAnalysis {
  id: string;
  canvasId: string;
  competitorName: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: number;
  pricingComparison: string;
  createdAt: string;
}

// ─── In-Memory Store ──────────────────────────────────────────────────────

class BmadStore {
  canvases = new Map<string, BusinessCanvas>();
  revenueModels = new Map<string, RevenueModel>();
  milestones = new Map<string, Milestone>();
  competitiveAnalyses = new Map<string, CompetitiveAnalysis>();

  // ─── Canvas Methods ──────────────────────────────────────────────────

  createCanvas(data: {
    name: string;
    valueProposition: string;
    customerSegments: string[];
    channels: string[];
    revenueStreams: string[];
    costStructure: string[];
    keyActivities: string[];
    keyResources: string[];
    keyPartners: string[];
  }): BusinessCanvas {
    const now = new Date().toISOString();
    const canvas: BusinessCanvas = {
      id: crypto.randomUUID(),
      name: data.name,
      valueProposition: data.valueProposition,
      customerSegments: data.customerSegments,
      channels: data.channels,
      revenueStreams: data.revenueStreams,
      costStructure: data.costStructure,
      keyActivities: data.keyActivities,
      keyResources: data.keyResources,
      keyPartners: data.keyPartners,
      createdAt: now,
      updatedAt: now,
    };
    this.canvases.set(canvas.id, canvas);
    return canvas;
  }

  listCanvases(): BusinessCanvas[] {
    return Array.from(this.canvases.values());
  }

  getCanvas(id: string): BusinessCanvas | undefined {
    return this.canvases.get(id);
  }

  // ─── Revenue Model Methods ──────────────────────────────────────────

  createRevenueModel(data: {
    canvasId: string;
    modelType: string;
    pricingStrategy: string;
    unitPrice: number;
    projectedVolume: number;
    currency: string;
  }): RevenueModel | undefined {
    const canvas = this.canvases.get(data.canvasId);
    if (!canvas) return undefined;

    const model: RevenueModel = {
      id: crypto.randomUUID(),
      canvasId: data.canvasId,
      modelType: data.modelType,
      pricingStrategy: data.pricingStrategy,
      unitPrice: data.unitPrice,
      projectedVolume: data.projectedVolume,
      currency: data.currency,
      createdAt: new Date().toISOString(),
    };
    this.revenueModels.set(model.id, model);
    return model;
  }

  calculateUnitEconomics(data: {
    unitPrice: number;
    costPerUnit: number;
    fixedCosts: number;
    projectedVolume: number;
  }): UnitEconomics {
    const marginPerUnit = data.unitPrice - data.costPerUnit;
    const marginPercent = data.unitPrice > 0 ? (marginPerUnit / data.unitPrice) * 100 : 0;
    const breakEvenVolume = marginPerUnit > 0 ? Math.ceil(data.fixedCosts / marginPerUnit) : Infinity;

    return {
      revenuePerUnit: data.unitPrice,
      costPerUnit: data.costPerUnit,
      marginPerUnit,
      marginPercent,
      breakEvenVolume,
    };
  }

  // ─── Milestone Methods ──────────────────────────────────────────────

  createMilestone(data: {
    canvasId: string;
    title: string;
    description: string;
    targetDate: string;
    gateCriteria: string[];
  }): Milestone | undefined {
    const canvas = this.canvases.get(data.canvasId);
    if (!canvas) return undefined;

    const now = new Date().toISOString();
    const milestone: Milestone = {
      id: crypto.randomUUID(),
      canvasId: data.canvasId,
      title: data.title,
      description: data.description,
      targetDate: data.targetDate,
      gateStatus: 'pending',
      gateCriteria: data.gateCriteria,
      createdAt: now,
      updatedAt: now,
    };
    this.milestones.set(milestone.id, milestone);
    return milestone;
  }

  updateGateStatus(
    id: string,
    gateStatus: 'pending' | 'passed' | 'failed' | 'deferred'
  ): Milestone | undefined {
    const milestone = this.milestones.get(id);
    if (!milestone) return undefined;
    milestone.gateStatus = gateStatus;
    milestone.updatedAt = new Date().toISOString();
    return milestone;
  }

  // ─── Competitive Analysis Methods ───────────────────────────────────

  createCompetitiveAnalysis(data: {
    canvasId: string;
    competitorName: string;
    strengths: string[];
    weaknesses: string[];
    marketShare: number;
    pricingComparison: string;
  }): CompetitiveAnalysis | undefined {
    const canvas = this.canvases.get(data.canvasId);
    if (!canvas) return undefined;

    const analysis: CompetitiveAnalysis = {
      id: crypto.randomUUID(),
      canvasId: data.canvasId,
      competitorName: data.competitorName,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      marketShare: data.marketShare,
      pricingComparison: data.pricingComparison,
      createdAt: new Date().toISOString(),
    };
    this.competitiveAnalyses.set(analysis.id, analysis);
    return analysis;
  }
}

export const store = new BmadStore();
