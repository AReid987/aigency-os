import type { PlanSection } from './schemas.js';
export interface Plan {
    id: string;
    title: string;
    description: string;
    source: 'paperclip' | 'manual' | 'plannotator';
    sections: PlanSection[];
    version: number;
    createdAt: string;
    updatedAt: string;
}
export interface Annotation {
    id: string;
    planId: string;
    author: string;
    role: 'domain_expert' | 'technical_founder' | 'agent';
    sectionId?: string;
    content: string;
    type: 'comment' | 'suggestion' | 'concern' | 'approval';
    createdAt: string;
}
export interface PlanVersion {
    version: number;
    planId: string;
    snapshot: Omit<Plan, 'id'>;
    timestamp: string;
}
export interface DiffResult {
    planId: string;
    v1: number;
    v2: number;
    changes: {
        field: string;
        from: unknown;
        to: unknown;
    }[];
}
declare class PlannotatorStore {
    plans: Map<string, Plan>;
    annotations: Map<string, Annotation[]>;
    versions: Map<string, PlanVersion[]>;
    createPlan(data: {
        title: string;
        description?: string;
        source?: 'paperclip' | 'manual' | 'plannotator';
        sections?: PlanSection[];
    }): Plan;
    getPlan(id: string, role?: string): Plan | undefined;
    listPlans(filter?: {
        source?: string;
    }): Plan[];
    updatePlan(id: string, data: {
        title?: string;
        description?: string;
        sections?: PlanSection[];
    }): Plan | undefined;
    addAnnotation(planId: string, data: {
        author: string;
        role: 'domain_expert' | 'technical_founder' | 'agent';
        sectionId?: string;
        content: string;
        type?: 'comment' | 'suggestion' | 'concern' | 'approval';
    }): Annotation | undefined;
    getAnnotations(planId: string): Annotation[];
    getDiff(planId: string, v1: number, v2: number): DiffResult | undefined;
    seed(): void;
}
export declare const store: PlannotatorStore;
export {};
//# sourceMappingURL=store.d.ts.map