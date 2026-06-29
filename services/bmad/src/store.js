// ─── BMAD Store Types ─────────────────────────────────────────────────────
// ─── In-Memory Store ──────────────────────────────────────────────────────
class BmadStore {
    canvases = new Map();
    revenueModels = new Map();
    milestones = new Map();
    competitiveAnalyses = new Map();
    // ─── Canvas Methods ──────────────────────────────────────────────────
    createCanvas(data) {
        const now = new Date().toISOString();
        const canvas = {
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
    listCanvases() {
        return Array.from(this.canvases.values());
    }
    getCanvas(id) {
        return this.canvases.get(id);
    }
    // ─── Revenue Model Methods ──────────────────────────────────────────
    createRevenueModel(data) {
        const canvas = this.canvases.get(data.canvasId);
        if (!canvas)
            return undefined;
        const model = {
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
    calculateUnitEconomics(data) {
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
    createMilestone(data) {
        const canvas = this.canvases.get(data.canvasId);
        if (!canvas)
            return undefined;
        const now = new Date().toISOString();
        const milestone = {
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
    updateGateStatus(id, gateStatus) {
        const milestone = this.milestones.get(id);
        if (!milestone)
            return undefined;
        milestone.gateStatus = gateStatus;
        milestone.updatedAt = new Date().toISOString();
        return milestone;
    }
    // ─── Competitive Analysis Methods ───────────────────────────────────
    createCompetitiveAnalysis(data) {
        const canvas = this.canvases.get(data.canvasId);
        if (!canvas)
            return undefined;
        const analysis = {
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
//# sourceMappingURL=store.js.map