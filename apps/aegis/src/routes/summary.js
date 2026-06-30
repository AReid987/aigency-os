import { store } from '../store.js';
export async function summaryRoutes(app) {
    // GET /api/v1/audit/:id/summary — executive summary
    app.get('/api/v1/audit/:id/summary', async (request, reply) => {
        const { id } = request.params;
        const summary = store.getExecutiveSummary(id);
        if (!summary) {
            return reply.code(404).send({ error: 'Audit not found' });
        }
        return summary;
    });
}
//# sourceMappingURL=summary.js.map