// ─── Domain Finding Templates ─────────────────────────────────────────────
const DOMAIN_FINDINGS = {
    security: [
        { title: 'Missing input validation', description: 'API endpoints lack comprehensive input validation, exposing potential injection vectors.', severity: 'critical', confidence: 0.92, recommendation: 'Implement schema-based validation on all endpoints using zod.' },
        { title: 'Hardcoded secrets detected', description: 'Configuration files contain hardcoded credentials that should be externalized.', severity: 'high', confidence: 0.88, recommendation: 'Move all secrets to environment variables or a secrets manager.' },
        { title: 'Missing rate limiting', description: 'API endpoints lack rate limiting, vulnerable to brute-force and DoS attacks.', severity: 'medium', confidence: 0.78, recommendation: 'Add rate limiting middleware with configurable thresholds.' },
    ],
    performance: [
        { title: 'N+1 query pattern detected', description: 'Database queries exhibit N+1 patterns that degrade performance under load.', severity: 'high', confidence: 0.85, recommendation: 'Use eager loading or batch queries to eliminate N+1 patterns.' },
        { title: 'Missing response caching', description: 'Frequently accessed read endpoints lack caching headers or server-side caching.', severity: 'medium', confidence: 0.72, recommendation: 'Implement ETag/Cache-Control headers and Redis caching for hot paths.' },
        { title: 'Large payload sizes', description: 'API responses include unnecessary fields increasing bandwidth usage.', severity: 'low', confidence: 0.65, recommendation: 'Implement field selection and pagination on list endpoints.' },
    ],
    scalability: [
        { title: 'Stateful server design', description: 'In-memory state prevents horizontal scaling across multiple instances.', severity: 'high', confidence: 0.90, recommendation: 'Externalize state to Redis or a database to enable multi-instance deployment.' },
        { title: 'Missing connection pooling', description: 'Database connections are created per-request instead of using a pool.', severity: 'medium', confidence: 0.75, recommendation: 'Configure connection pooling with appropriate min/max limits.' },
    ],
    reliability: [
        { title: 'Missing graceful shutdown', description: 'Server does not handle SIGTERM/SIGINT signals for graceful shutdown.', severity: 'medium', confidence: 0.82, recommendation: 'Implement graceful shutdown handlers that drain connections.' },
        { title: 'No circuit breaker pattern', description: 'External service calls lack circuit breaker protection.', severity: 'medium', confidence: 0.70, recommendation: 'Add circuit breaker for external dependencies to prevent cascade failures.' },
        { title: 'Missing health check depth', description: 'Health checks only verify server is running, not dependency health.', severity: 'low', confidence: 0.68, recommendation: 'Add deep health checks that verify database and cache connectivity.' },
    ],
    maintainability: [
        { title: 'High cyclomatic complexity', description: 'Several service methods exceed recommended complexity thresholds.', severity: 'medium', confidence: 0.77, recommendation: 'Refactor complex methods into smaller, focused functions.' },
        { title: 'Insufficient code documentation', description: 'Core business logic lacks JSDoc comments and inline documentation.', severity: 'low', confidence: 0.65, recommendation: 'Add JSDoc comments to all public methods and complex algorithms.' },
    ],
    testability: [
        { title: 'Low test coverage', description: 'Critical business logic paths have insufficient test coverage.', severity: 'high', confidence: 0.88, recommendation: 'Add unit tests for store methods and integration tests for API routes.' },
        { title: 'Tight coupling impedes testing', description: 'Store class directly depends on crypto.randomUUID, making tests non-deterministic.', severity: 'medium', confidence: 0.73, recommendation: 'Inject ID generation as a dependency for testability.' },
    ],
    usability: [
        { title: 'Inconsistent error responses', description: 'Error response formats vary across endpoints making client handling difficult.', severity: 'medium', confidence: 0.80, recommendation: 'Standardize error response format with code, message, and details fields.' },
        { title: 'Missing API versioning', description: 'No clear API versioning strategy for backward compatibility.', severity: 'low', confidence: 0.62, recommendation: 'Maintain /api/v1/ prefix and document deprecation policy.' },
    ],
    accessibility: [
        { title: 'API lacks content negotiation', description: 'Server does not support multiple response formats (JSON, CSV).', severity: 'low', confidence: 0.58, recommendation: 'Add Accept header parsing and alternative response serializers.' },
        { title: 'Missing internationalization hooks', description: 'Error messages are hardcoded in English without i18n support.', severity: 'low', confidence: 0.55, recommendation: 'Externalize user-facing strings for future localization.' },
    ],
    data_integrity: [
        { title: 'No transaction boundaries', description: 'Multi-step mutations lack transaction isolation.', severity: 'high', confidence: 0.87, recommendation: 'Wrap multi-step mutations in database transactions.' },
        { title: 'Missing data validation at boundaries', description: 'Data entering the store layer is not re-validated.', severity: 'medium', confidence: 0.74, recommendation: 'Add defensive validation in store methods even after route validation.' },
        { title: 'No soft delete pattern', description: 'Deletions are hard deletes with no audit trail or recovery option.', severity: 'low', confidence: 0.66, recommendation: 'Implement soft delete with deletedAt timestamp and restore capability.' },
    ],
    api_design: [
        { title: 'Non-RESTful route patterns', description: 'Some routes use RPC-style patterns instead of REST resource conventions.', severity: 'medium', confidence: 0.76, recommendation: 'Align routes with REST conventions for consistency and discoverability.' },
        { title: 'Missing pagination', description: 'List endpoints return all records without pagination support.', severity: 'high', confidence: 0.83, recommendation: 'Add cursor-based pagination with limit/offset parameters.' },
    ],
    architecture: [
        { title: 'Monolithic store class', description: 'Single store class handles all domains, violating single responsibility.', severity: 'medium', confidence: 0.79, recommendation: 'Split store into domain-specific repositories.' },
        { title: 'Missing dependency injection', description: 'Direct imports of store instance prevent proper testing and modularity.', severity: 'medium', confidence: 0.71, recommendation: 'Introduce DI container or plugin-based architecture for Fastify.' },
    ],
    documentation: [
        { title: 'Missing OpenAPI specification', description: 'No OpenAPI/Swagger spec auto-generated or manually maintained.', severity: 'medium', confidence: 0.84, recommendation: 'Add @fastify/swagger for auto-generated API documentation.' },
        { title: 'No README or setup guide', description: 'Service lacks README with setup, configuration, and usage instructions.', severity: 'low', confidence: 0.69, recommendation: 'Create comprehensive README with examples and deployment guide.' },
    ],
    compliance: [
        { title: 'Missing audit logging', description: 'Sensitive operations lack comprehensive audit trail logging.', severity: 'high', confidence: 0.86, recommendation: 'Ensure all state mutations are logged with actor, action, and timestamp.' },
        { title: 'No data retention policy', description: 'No mechanism to enforce data retention or purge old records.', severity: 'medium', confidence: 0.72, recommendation: 'Implement configurable data retention policies with automated cleanup.' },
    ],
    cost_efficiency: [
        { title: 'Over-provisioned resources', description: 'Default resource allocations exceed typical workload requirements.', severity: 'low', confidence: 0.60, recommendation: 'Implement auto-scaling based on actual traffic patterns.' },
        { title: 'Missing request deduplication', description: 'Identical concurrent requests result in duplicate processing.', severity: 'medium', confidence: 0.68, recommendation: 'Add request deduplication with idempotency keys.' },
    ],
};
// ─── Helpers ──────────────────────────────────────────────────────────────
function severityWeight(s) {
    switch (s) {
        case 'critical': return 1.0;
        case 'high': return 0.75;
        case 'medium': return 0.5;
        case 'low': return 0.25;
    }
}
function riskScoreToPriority(score) {
    if (score >= 0.75)
        return 'P0';
    if (score >= 0.5)
        return 'P1';
    if (score >= 0.25)
        return 'P2';
    return 'P3';
}
function riskScoreToEffort(score) {
    if (score >= 0.7)
        return 'high';
    if (score >= 0.4)
        return 'medium';
    return 'low';
}
// ─── In-Memory Store ──────────────────────────────────────────────────────
class AegisStore {
    audits = new Map();
    findings = new Map();
    personaEvaluations = new Map(); // auditId -> evaluations
    remediationPlans = new Map(); // auditId -> plan
    createAudit(data) {
        const id = crypto.randomUUID();
        const domains = data.domains ?? [
            'security', 'performance', 'scalability', 'reliability',
            'maintainability', 'testability', 'usability', 'accessibility',
            'data_integrity', 'api_design', 'architecture', 'documentation',
            'compliance', 'cost_efficiency',
        ];
        const findings = [];
        for (const domain of domains) {
            const templates = DOMAIN_FINDINGS[domain] ?? [];
            // Pick 2-3 findings per domain deterministically based on audit id
            const count = 2 + (id.charCodeAt(0) % 2); // 2 or 3
            const selected = templates.slice(0, Math.min(count, templates.length));
            for (const tmpl of selected) {
                const finding = {
                    id: crypto.randomUUID(),
                    auditId: id,
                    domain,
                    title: tmpl.title,
                    description: tmpl.description,
                    severity: tmpl.severity,
                    confidence: tmpl.confidence,
                    recommendation: tmpl.recommendation,
                };
                findings.push(finding);
                this.findings.set(finding.id, finding);
            }
        }
        // Calculate overall score: 100 minus weighted deductions
        let deduction = 0;
        for (const f of findings) {
            deduction += severityWeight(f.severity) * f.confidence;
        }
        const maxDeduction = findings.length * 1.0; // worst case
        const overallScore = Math.max(0, Math.round(100 - (deduction / Math.max(maxDeduction, 1)) * 100));
        const audit = {
            id,
            project: data.project,
            domains,
            findings,
            overallScore,
            status: 'completed',
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
        };
        this.audits.set(id, audit);
        this.personaEvaluations.set(id, []);
        return audit;
    }
    getAudit(id) {
        return this.audits.get(id);
    }
    listAudits() {
        return Array.from(this.audits.values());
    }
    transformToRemediation(auditId) {
        const audit = this.audits.get(auditId);
        if (!audit)
            return undefined;
        const existing = this.remediationPlans.get(auditId);
        if (existing)
            return existing;
        const tasks = audit.findings.map(f => {
            const risk = severityWeight(f.severity) * f.confidence;
            return {
                id: crypto.randomUUID(),
                findingId: f.id,
                title: `Resolve: ${f.title}`,
                description: f.recommendation,
                domain: f.domain,
                priority: riskScoreToPriority(risk),
                riskScore: Math.round(risk * 100) / 100,
                effort: riskScoreToEffort(risk),
                acceptanceCriteria: [
                    `Finding "${f.title}" in ${f.domain} domain is resolved`,
                    `Regression test added for ${f.domain}`,
                    'Peer review completed',
                ],
            };
        });
        // Sort by risk score descending
        tasks.sort((a, b) => b.riskScore - a.riskScore);
        const totalRiskScore = Math.round(tasks.reduce((sum, t) => sum + t.riskScore, 0) * 100) / 100;
        const plan = {
            id: crypto.randomUUID(),
            auditId,
            project: audit.project,
            tasks,
            totalRiskScore,
            createdAt: new Date().toISOString(),
        };
        this.remediationPlans.set(auditId, plan);
        return plan;
    }
    getExecutiveSummary(auditId) {
        const audit = this.audits.get(auditId);
        if (!audit)
            return undefined;
        const findings = audit.findings;
        const criticalCount = findings.filter(f => f.severity === 'critical').length;
        const highCount = findings.filter(f => f.severity === 'high').length;
        const mediumCount = findings.filter(f => f.severity === 'medium').length;
        const lowCount = findings.filter(f => f.severity === 'low').length;
        // Calculate per-domain scores (0-100)
        const domainScores = {};
        for (const domain of audit.domains) {
            const domainFindings = findings.filter(f => f.domain === domain);
            if (domainFindings.length === 0) {
                domainScores[domain] = 100;
                continue;
            }
            let deduction = 0;
            for (const f of domainFindings) {
                deduction += severityWeight(f.severity) * f.confidence;
            }
            const maxDeduction = domainFindings.length * 1.0;
            domainScores[domain] = Math.max(0, Math.round(100 - (deduction / maxDeduction) * 100));
        }
        // Top concerns: critical + high findings
        const topConcerns = findings
            .filter(f => f.severity === 'critical' || f.severity === 'high')
            .map(f => `[${f.domain}] ${f.title}: ${f.description}`);
        // Persona consensus
        const evaluations = this.personaEvaluations.get(auditId) ?? [];
        let personaConsensus = null;
        if (evaluations.length > 0) {
            const approvals = evaluations.filter(e => e.approval === 'approve').length;
            const rejections = evaluations.filter(e => e.approval === 'reject').length;
            if (approvals > rejections) {
                personaConsensus = 'Approved by majority of persona evaluators';
            }
            else if (rejections > approvals) {
                personaConsensus = 'Rejected by majority of persona evaluators';
            }
            else {
                personaConsensus = 'Conditional approval — review required';
            }
        }
        return {
            auditId,
            project: audit.project,
            overallScore: audit.overallScore,
            criticalCount,
            highCount,
            mediumCount,
            lowCount,
            totalFindings: findings.length,
            domainScores: domainScores,
            topConcerns,
            personaConsensus,
            createdAt: audit.createdAt,
        };
    }
    addPersonaEvaluation(auditId, data) {
        if (!this.audits.has(auditId))
            return undefined;
        const evaluation = {
            id: crypto.randomUUID(),
            auditId,
            persona: data.persona,
            role: data.role,
            evaluation: data.evaluation,
            concerns: data.concerns,
            approval: data.approval,
            conditions: data.conditions,
            createdAt: new Date().toISOString(),
        };
        const evaluations = this.personaEvaluations.get(auditId) ?? [];
        evaluations.push(evaluation);
        this.personaEvaluations.set(auditId, evaluations);
        return evaluation;
    }
}
export const store = new AegisStore();
//# sourceMappingURL=store.js.map