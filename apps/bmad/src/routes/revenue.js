import { store } from '../store.js';
import { CreateRevenueModelSchema, CalculateUnitEconomicsSchema } from '../schemas.js';
export async function revenueRoutes(app) {
    // POST /api/v1/revenue — create revenue model
    app.post('/api/v1/revenue', async (request, reply) => {
        const parsed = CreateRevenueModelSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const model = store.createRevenueModel(parsed.data);
        if (!model) {
            return reply.code(404).send({ error: 'Canvas not found' });
        }
        return reply.code(201).send(model);
    });
    // GET /api/v1/revenue — list all revenue models
    app.get('/api/v1/revenue', async () => {
        return { revenueModels: Array.from(store.revenueModels.values()) };
    });
    // POST /api/v1/revenue/calculate — calculate unit economics
    app.post('/api/v1/revenue/calculate', async (request, reply) => {
        const parsed = CalculateUnitEconomicsSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const economics = store.calculateUnitEconomics(parsed.data);
        return economics;
    });
}
//# sourceMappingURL=revenue.js.map