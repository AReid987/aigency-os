import { store } from '../store.js';
import { z } from 'zod';
const SynthesizeSchema = z.object({
    ventureId: z.string().min(1).max(200),
    period: z.string().min(1).max(100), // e.g. "2026-Q2", "2026-06"
});
export async function synthesizeRoutes(app) {
    // POST /api/v1/synthesize — synthesize knowledge for a venture and period
    app.post('/api/v1/synthesize', async (request, reply) => {
        const parsed = SynthesizeSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const { ventureId, period } = parsed.data;
        // Retrieve all knowledge pages and filter for relevant ones
        const pages = store.listPages();
        // Group pages by type
        const decisions = pages.filter((p) => p.type === 'decision');
        const plans = pages.filter((p) => p.type === 'plan');
        const findings = pages.filter((p) => p.type === 'audit_finding');
        const assumptions = pages.filter((p) => p.type === 'assumption');
        const facts = pages.filter((p) => p.type === 'fact');
        // Generate synthesis summary
        const keyDecisions = decisions.map((p) => ({
            title: p.title,
            summary: p.content.slice(0, 200),
            confidence: p.confidence,
            author: p.author,
        }));
        const activePlans = plans.map((p) => ({
            title: p.title,
            summary: p.content.slice(0, 200),
            confidence: p.confidence,
            author: p.author,
        }));
        const openFindings = findings.map((p) => ({
            title: p.title,
            summary: p.content.slice(0, 200),
            confidence: p.confidence,
            author: p.author,
        }));
        const recommendations = [];
        if (findings.length > 0) {
            recommendations.push(`Address ${findings.length} open audit finding(s) before the next release.`);
        }
        if (assumptions.length > 0) {
            recommendations.push(`Validate ${assumptions.length} unverified assumption(s) through targeted experiments.`);
        }
        if (decisions.length > 0) {
            recommendations.push(`Review ${decisions.length} architectural decision(s) for alignment with current strategy.`);
        }
        if (plans.length > 0) {
            recommendations.push(`Track progress on ${plans.length} active plan(s) and update milestones.`);
        }
        if (recommendations.length === 0) {
            recommendations.push('No knowledge pages found. Consider capturing more context.');
        }
        return {
            ventureId,
            period,
            summary: {
                totalPages: pages.length,
                keyDecisions,
                activePlans,
                openFindings,
                assumptions: assumptions.map((p) => ({
                    title: p.title,
                    confidence: p.confidence,
                })),
                verifiedFacts: facts.map((p) => ({
                    title: p.title,
                    tags: p.tags,
                })),
            },
            recommendations,
            generatedAt: new Date().toISOString(),
        };
    });
}
//# sourceMappingURL=synthesize.js.map