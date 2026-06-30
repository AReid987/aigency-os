import type { Domain } from './schemas.js';
export type Severity = 'critical' | 'high' | 'medium' | 'low';
export interface Finding {
    id: string;
    auditId: string;
    domain: Domain;
    title: string;
    description: string;
    severity: Severity;
    confidence: number;
    recommendation: string;
}
export interface Audit {
    id: string;
    project: string;
    domains: Domain[];
    findings: Finding[];
    overallScore: number;
    status: 'pending' | 'in_progress' | 'completed';
    createdAt: string;
    completedAt: string | null;
}
export interface PersonaEvaluation {
    id: string;
    auditId: string;
    persona: string;
    role: string;
    evaluation: string;
    concerns: string[];
    approval: 'approve' | 'reject' | 'conditional';
    conditions: string[];
    createdAt: string;
}
export interface RemediationTask {
    id: string;
    findingId: string;
    title: string;
    description: string;
    domain: Domain;
    priority: 'P0' | 'P1' | 'P2' | 'P3';
    riskScore: number;
    effort: 'low' | 'medium' | 'high';
    acceptanceCriteria: string[];
}
export interface RemediationPlan {
    id: string;
    auditId: string;
    project: string;
    tasks: RemediationTask[];
    totalRiskScore: number;
    createdAt: string;
}
export interface ExecutiveSummary {
    auditId: string;
    project: string;
    overallScore: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    totalFindings: number;
    domainScores: Record<Domain, number>;
    topConcerns: string[];
    personaConsensus: string | null;
    createdAt: string;
}
declare class AegisStore {
    audits: Map<string, Audit>;
    findings: Map<string, Finding>;
    personaEvaluations: Map<string, PersonaEvaluation[]>;
    remediationPlans: Map<string, RemediationPlan>;
    createAudit(data: {
        project: string;
        domains?: Domain[];
    }): Audit;
    getAudit(id: string): Audit | undefined;
    listAudits(): Audit[];
    transformToRemediation(auditId: string): RemediationPlan | undefined;
    getExecutiveSummary(auditId: string): ExecutiveSummary | undefined;
    addPersonaEvaluation(auditId: string, data: {
        persona: string;
        role: string;
        evaluation: string;
        concerns: string[];
        approval: 'approve' | 'reject' | 'conditional';
        conditions: string[];
    }): PersonaEvaluation | undefined;
}
export declare const store: AegisStore;
export {};
//# sourceMappingURL=store.d.ts.map