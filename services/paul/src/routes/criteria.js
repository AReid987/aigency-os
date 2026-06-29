import { store } from '../store.js';
import { UpdateCriteriaStatusSchema } from '../schemas.js';
export async function criteriaRoutes(app) {
    // GET /api/v1/plan/:id/criteria — list all criteria for a plan
    app.get('/api/v1/plan/:id/criteria', async (request, reply) => {
        const { id } = request.params;
        const plan = store.getPlan(id);
        if (!plan) {
            return reply.code(404).send({ error: 'Plan not found' });
        }
        return { criteria: store.getCriteria(id) };
    });
    // PATCH /api/v1/plan/:id/criteria/:cid — update criteria status
    app.patch('/api/v1/plan/:id/criteria/:cid', async (request, reply) => {
        const { id, cid } = request.params;
        const parsed = UpdateCriteriaStatusSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const criterion = store.updateCriteriaStatus(id, cid, parsed.data.status);
        if (!criterion) {
            return reply.code(404).send({ error: 'Criterion not found' });
        }
        return criterion;
    });
}
//# sourceMappingURL=criteria.js.map