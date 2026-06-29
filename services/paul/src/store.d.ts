export interface AcceptanceCriterion {
    id: string;
    description: string;
    status: 'pending' | 'passed' | 'failed';
}
export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'done';
    acceptanceCriteria: AcceptanceCriterion[];
}
export interface Plan {
    id: string;
    prd: string;
    title: string;
    summary: string;
    tasks: Task[];
    status: 'draft' | 'in_progress' | 'completed';
    createdAt: string;
    updatedAt: string;
}
export interface TechSpecSection {
    title: string;
    content: string;
}
export interface TechSpec {
    planId: string;
    generatedAt: string;
    sections: TechSpecSection[];
}
declare class Store {
    plans: Map<string, Plan>;
    criteria: Map<string, AcceptanceCriterion>;
    techSpecs: Map<string, TechSpec>;
    createPlan(prd: string): Plan;
    getPlan(id: string): Plan | undefined;
    listPlans(): Plan[];
    applyPlan(id: string): Plan | undefined;
    unifyPlan(id: string): TechSpec | undefined;
    getCriteria(planId: string): AcceptanceCriterion[];
    updateCriteriaStatus(planId: string, criteriaId: string, status: AcceptanceCriterion['status']): AcceptanceCriterion | undefined;
}
export declare const store: Store;
export {};
//# sourceMappingURL=store.d.ts.map