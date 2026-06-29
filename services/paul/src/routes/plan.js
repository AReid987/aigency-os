import { store } from '../store.js';
import { CreatePlanSchema } from '../schemas.js';
export async function planRoutes(app) {
    // POST /api/v1/plan — create plan from PRD
    app.post('/api/v1/plan', async (request, reply) => {
        const parsed = CreatePlanSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const plan = store.createPlan(parsed.data.prd);
        return reply.code(201).send(plan);
    });
    // GET /api/v1/plan — list all plans
    app.get('/api/v1/plan', async () => {
        return { plans: store.listPlans() };
    });
    // GET /api/v1/plan/:id — get plan by id
    app.get('/api/v1/plan/:id', async (request, reply) => {
        const { id } = request.params;
        const plan = store.getPlan(id);
        if (!plan) {
            return reply.code(404).send({ error: 'Plan not found' });
        }
        return plan;
    });
}
//# sourceMappingURL=plan.js.map