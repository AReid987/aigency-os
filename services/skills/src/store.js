// ─── In-Memory Store ────────────────────────────────────────────────────
export class SkillsStore {
    skills = new Map();
    installations = new Map();
    ratings = new Map();
    // ─── Skill Methods ────────────────────────────────────────────────────
    listSkills(category) {
        const all = Array.from(this.skills.values());
        if (category) {
            return all.filter((s) => s.category === category);
        }
        return all;
    }
    getSkill(id) {
        return this.skills.get(id);
    }
    installSkill(skillId, data) {
        const skill = this.skills.get(skillId);
        if (!skill)
            return undefined;
        const id = crypto.randomUUID();
        const installation = {
            id,
            skillId,
            config: data.config,
            environment: data.environment,
            status: 'active',
            installedAt: new Date().toISOString(),
        };
        // Track installations as an array
        const existing = this.installations.get(id);
        this.installations.set(id, installation);
        // Increment download count
        skill.downloads += 1;
        skill.updatedAt = new Date().toISOString();
        return installation;
    }
    validateSkill(id) {
        const skill = this.skills.get(id);
        if (!skill) {
            return { valid: false, issues: ['Skill not found'] };
        }
        const issues = [];
        if (!skill.name || skill.name.trim().length === 0) {
            issues.push('Skill name is empty');
        }
        if (!skill.description || skill.description.trim().length === 0) {
            issues.push('Skill description is empty');
        }
        if (!skill.version || !/^\d+\.\d+\.\d+/.test(skill.version)) {
            issues.push('Invalid semantic version');
        }
        if (!skill.author || skill.author.trim().length === 0) {
            issues.push('Author is required');
        }
        if (skill.tags.length === 0) {
            issues.push('At least one tag is required');
        }
        return { valid: issues.length === 0, issues };
    }
    rateSkill(skillId, data) {
        const skill = this.skills.get(skillId);
        if (!skill)
            return undefined;
        const rating = {
            id: crypto.randomUUID(),
            skillId,
            rating: data.rating,
            review: data.review,
            createdAt: new Date().toISOString(),
        };
        const existingRatings = this.ratings.get(skillId) ?? [];
        existingRatings.push(rating);
        this.ratings.set(skillId, existingRatings);
        // Recalculate average rating
        const total = existingRatings.reduce((sum, r) => sum + r.rating, 0);
        skill.rating = Math.round((total / existingRatings.length) * 10) / 10;
        skill.ratingCount = existingRatings.length;
        skill.updatedAt = new Date().toISOString();
        return rating;
    }
    // ─── Seed Demo Data ───────────────────────────────────────────────────
    seed() {
        if (this.skills.size > 0)
            return; // Already seeded
        const now = new Date().toISOString();
        const demoSkills = [
            {
                name: 'Auto-Deploy Pipeline',
                description: 'Automated deployment pipeline skill that integrates with CI/CD systems. Supports blue-green deployments, canary releases, and automatic rollback on failure metrics.',
                category: 'devops',
                version: '2.1.0',
                author: 'AIGENCY Core Team',
                icon: '🚀',
                tags: ['deployment', 'ci-cd', 'automation', 'rollback'],
                downloads: 1247,
                rating: 4.6,
                ratingCount: 89,
                configSchema: {
                    type: 'object',
                    properties: {
                        provider: { type: 'string', enum: ['github', 'gitlab', 'bitbucket'] },
                        strategy: { type: 'string', enum: ['blue-green', 'canary', 'rolling'] },
                    },
                },
                createdAt: '2026-01-15T10:00:00.000Z',
                updatedAt: now,
            },
            {
                name: 'Sentiment Analyzer',
                description: 'Real-time sentiment analysis skill using LLM-powered classification. Analyzes customer feedback, support tickets, and social media mentions to provide actionable insights.',
                category: 'ai',
                version: '1.3.2',
                author: 'AI Research Lab',
                icon: '🧠',
                tags: ['nlp', 'sentiment', 'analysis', 'llm'],
                downloads: 2103,
                rating: 4.8,
                ratingCount: 156,
                configSchema: {
                    type: 'object',
                    properties: {
                        model: { type: 'string', default: 'gpt-4o-mini' },
                        threshold: { type: 'number', minimum: 0, maximum: 1 },
                    },
                },
                createdAt: '2026-02-01T14:30:00.000Z',
                updatedAt: now,
            },
            {
                name: 'Slack Integration Bridge',
                description: 'Two-way Slack integration for sending notifications, receiving commands, and creating interactive workflows directly from Slack channels.',
                category: 'integration',
                version: '3.0.1',
                author: 'Connector Labs',
                icon: '💬',
                tags: ['slack', 'notifications', 'chat-ops', 'webhooks'],
                downloads: 3456,
                rating: 4.3,
                ratingCount: 201,
                createdAt: '2025-11-20T09:00:00.000Z',
                updatedAt: now,
            },
            {
                name: 'Revenue Forecast Engine',
                description: 'ML-powered revenue forecasting skill that analyzes historical data, pipeline health, and market signals to predict future revenue with confidence intervals.',
                category: 'analytics',
                version: '1.0.0',
                author: 'Finance AI Team',
                icon: '📊',
                tags: ['forecasting', 'revenue', 'ml', 'analytics', 'pipeline'],
                downloads: 678,
                rating: 4.1,
                ratingCount: 34,
                configSchema: {
                    type: 'object',
                    properties: {
                        lookbackMonths: { type: 'number', default: 12 },
                        confidenceLevel: { type: 'number', default: 0.95 },
                    },
                },
                createdAt: '2026-03-10T16:00:00.000Z',
                updatedAt: now,
            },
            {
                name: 'Workflow Orchestrator',
                description: 'Visual workflow builder and orchestrator skill. Create complex multi-step workflows with conditional branching, parallel execution, and error handling.',
                category: 'workflow',
                version: '2.5.0',
                author: 'FlowBuilder Inc',
                icon: '⚡',
                tags: ['workflow', 'orchestration', 'automation', 'no-code'],
                downloads: 1892,
                rating: 4.5,
                ratingCount: 112,
                configSchema: {
                    type: 'object',
                    properties: {
                        maxConcurrent: { type: 'number', default: 10 },
                        retryPolicy: { type: 'string', enum: ['none', 'exponential', 'linear'] },
                    },
                },
                createdAt: '2025-12-05T11:00:00.000Z',
                updatedAt: now,
            },
        ];
        for (const demo of demoSkills) {
            const skill = {
                ...demo,
                id: crypto.randomUUID(),
            };
            this.skills.set(skill.id, skill);
        }
    }
}
export const store = new SkillsStore();
//# sourceMappingURL=store.js.map