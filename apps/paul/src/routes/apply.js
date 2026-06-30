import { store } from '../store.js';
export async function applyRoutes(app) {
    // POST /api/v1/plan/:id/apply — mark all pending tasks as in-progress
    app.post('/api/v1/plan/:id/apply', async (request, reply) => {
        const { id } = request.params;
        const plan = store.applyPlan(id);
        if (!plan) {
            return reply.code(404).send({ error: 'Plan not found' });
        }
        return plan;
    });
}
//# sourceMappingURL=apply.js.map