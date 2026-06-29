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
declare class BmadStore {
    canvases: Map<string, BusinessCanvas>;
    revenueModels: Map<string, RevenueModel>;
    milestones: Map<string, Milestone>;
    competitiveAnalyses: Map<string, CompetitiveAnalysis>;
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
    }): BusinessCanvas;
    listCanvases(): BusinessCanvas[];
    getCanvas(id: string): BusinessCanvas | undefined;
    createRevenueModel(data: {
        canvasId: string;
        modelType: string;
        pricingStrategy: string;
        unitPrice: number;
        projectedVolume: number;
        currency: string;
    }): RevenueModel | undefined;
    calculateUnitEconomics(data: {
        unitPrice: number;
        costPerUnit: number;
        fixedCosts: number;
        projectedVolume: number;
    }): UnitEconomics;
    createMilestone(data: {
        canvasId: string;
        title: string;
        description: string;
        targetDate: string;
        gateCriteria: string[];
    }): Milestone | undefined;
    updateGateStatus(id: string, gateStatus: 'pending' | 'passed' | 'failed' | 'deferred'): Milestone | undefined;
    createCompetitiveAnalysis(data: {
        canvasId: string;
        competitorName: string;
        strengths: string[];
        weaknesses: string[];
        marketShare: number;
        pricingComparison: string;
    }): CompetitiveAnalysis | undefined;
}
export declare const store: BmadStore;
export {};
//# sourceMappingURL=store.d.ts.map