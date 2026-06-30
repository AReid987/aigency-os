// ─── In-Memory Store ────────────────────────────────────────────────────
export class GbrainStore {
    pages = new Map();
    graphEdges = [];
    // ─── Page Methods ─────────────────────────────────────────────────────
    createPage(data) {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const page = {
            id,
            title: data.title,
            content: data.content,
            type: data.type,
            tags: data.tags,
            scope: data.scope,
            confidence: data.confidence,
            references: data.references,
            author: data.author,
            createdAt: now,
            updatedAt: now,
        };
        this.pages.set(id, page);
        this.rebuildEdges();
        return page;
    }
    getPage(id) {
        return this.pages.get(id);
    }
    listPages() {
        return Array.from(this.pages.values());
    }
    // ─── Hybrid Search ────────────────────────────────────────────────────
    queryPages(query) {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        const scored = [];
        for (const page of this.pages.values()) {
            const titleLower = page.title.toLowerCase();
            const contentLower = page.content.toLowerCase();
            const tagsLower = page.tags.map(t => t.toLowerCase());
            let score = 0;
            for (const term of terms) {
                // Title match (highest weight)
                if (titleLower.includes(term)) {
                    score += 10;
                }
                // Tag match (medium weight)
                if (tagsLower.some(t => t.includes(term))) {
                    score += 5;
                }
                // Content match (base weight)
                const contentMatches = contentLower.split(term).length - 1;
                score += contentMatches;
            }
            // Only include pages that actually match the query
            if (score > 0) {
                // Recency bonus: newer pages get a small boost
                const ageMs = Date.now() - new Date(page.createdAt).getTime();
                const ageHours = ageMs / (1000 * 60 * 60);
                if (ageHours < 24)
                    score += 2;
                if (ageHours < 1)
                    score += 3;
                // Confidence bonus
                if (page.confidence === 'verified')
                    score += 3;
                if (page.confidence === 'high')
                    score += 2;
                scored.push({ page, score });
            }
        }
        return scored
            .sort((a, b) => b.score - a.score)
            .map(s => s.page);
    }
    // ─── Graph ────────────────────────────────────────────────────────────
    getGraph() {
        const nodes = Array.from(this.pages.values()).map(p => ({
            id: p.id,
            label: p.title,
            type: p.type,
        }));
        return { nodes, edges: [...this.graphEdges] };
    }
    rebuildEdges() {
        const edges = [];
        const pages = Array.from(this.pages.values());
        for (let i = 0; i < pages.length; i++) {
            for (let j = i + 1; j < pages.length; j++) {
                const a = pages[i];
                const b = pages[j];
                // Connect pages that share tags
                const sharedTags = a.tags.filter(t => b.tags.includes(t));
                if (sharedTags.length > 0) {
                    edges.push({
                        from: a.id,
                        to: b.id,
                        label: `shared_tags: ${sharedTags.join(', ')}`,
                    });
                }
                // Connect pages where one references the other's id
                if (a.references.includes(b.id)) {
                    edges.push({
                        from: a.id,
                        to: b.id,
                        label: 'references',
                    });
                }
                if (b.references.includes(a.id)) {
                    edges.push({
                        from: b.id,
                        to: a.id,
                        label: 'references',
                    });
                }
            }
        }
        this.graphEdges = edges;
    }
    // ─── Auto-Capture ─────────────────────────────────────────────────────
    addCapture(data) {
        const page = this.createPage({
            title: `[${data.source}] ${data.title}`,
            content: data.content,
            type: data.type,
            tags: [...data.tags, `source:${data.source}`],
            scope: data.scope,
            confidence: 'medium',
            references: [],
            author: `capture:${data.source}`,
        });
        page.source = data.source;
        return page;
    }
    // ─── Scoped Results ───────────────────────────────────────────────────
    getScopedResults(pages, role) {
        if (!role || role === 'technical_founder') {
            return pages; // technical_founder sees everything
        }
        // domain_expert sees only business-scoped pages
        if (role === 'domain_expert') {
            return pages.filter(p => p.scope.includes('business'));
        }
        return pages;
    }
    // ─── Seed Demo Data ───────────────────────────────────────────────────
    seed() {
        if (this.pages.size > 0)
            return; // Already seeded
        const decision = this.createPage({
            title: 'Use Fastify as our API framework',
            content: 'After evaluating Express, Fastify, and Hono, the team decided to adopt Fastify for all new API services. Fastify provides better performance benchmarks, built-in JSON schema validation, and a mature plugin ecosystem. Migration from existing Express services will be completed by Q3.',
            type: 'decision',
            tags: ['architecture', 'api', 'fastify', 'performance'],
            scope: ['technical'],
            confidence: 'verified',
            references: [],
            author: 'CTO',
        });
        const plan = this.createPage({
            title: 'Q3 product launch plan for AIGENCY',
            content: 'The Q3 product launch targets enterprise customers with the v1.0 release of AIGENCY OS. Key milestones: July 15 - feature freeze, August 1 - beta release to 10 design partners, September 1 - GA release. Revenue target: $500K ARR by end of Q3. Marketing budget allocated: $50K for launch events and content.',
            type: 'plan',
            tags: ['product', 'launch', 'q3', 'revenue', 'marketing'],
            scope: ['business', 'technical'],
            confidence: 'high',
            references: [],
            author: 'CEO',
        });
        const auditFinding = this.createPage({
            title: 'Security audit: missing rate limiting on auth endpoints',
            content: 'The Q2 security audit identified that authentication endpoints (/login, /register, /reset-password) lack rate limiting. This exposes the system to brute-force attacks. Severity: HIGH. Recommended fix: implement rate limiting with a sliding window of 10 requests per minute per IP. Fix deadline: July 1, 2026.',
            type: 'audit_finding',
            tags: ['security', 'audit', 'rate-limiting', 'auth', 'compliance'],
            scope: ['technical'],
            confidence: 'verified',
            references: [],
            author: 'Security Auditor',
        });
        const assumption = this.createPage({
            title: 'Customers prefer self-serve onboarding over sales calls',
            content: 'Based on early user interviews (n=25), 72% of prospects indicated a preference for self-serve product tours over scheduling a sales call. This assumption will be validated with the beta launch by tracking the self-serve-to-paid conversion rate. If conversion exceeds 5%, the assumption holds.',
            type: 'assumption',
            tags: ['product', 'onboarding', 'sales', 'user-research'],
            scope: ['business'],
            confidence: 'medium',
            references: [plan.id],
            author: 'Product Lead',
        });
        const fact = this.createPage({
            title: 'Fastify handles 2.3x more requests/sec than Express in benchmarks',
            content: 'Internal benchmarks conducted on May 2026 show Fastify serving 2.3x more JSON requests per second than Express on identical hardware (c5.xlarge). Test setup: 100 concurrent connections, simple JSON response, Node.js 22 LTS. Fastify: 78,000 req/s. Express: 34,000 req/s. This validates our architecture decision to adopt Fastify.',
            type: 'fact',
            tags: ['performance', 'fastify', 'express', 'benchmark', 'architecture'],
            scope: ['technical'],
            confidence: 'verified',
            references: [decision.id],
            author: 'Engineering',
        });
    }
}
export const store = new GbrainStore();
//# sourceMappingURL=store.js.map