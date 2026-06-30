import { store } from '../store.js';
import { CreateDealSchema, UpdateDealStageSchema } from '../schemas.js';
export async function dealRoutes(app) {
    // POST /api/v1/deals — create deal
    app.post('/api/v1/deals', async (request, reply) => {
        const parsed = CreateDealSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const deal = store.createDeal(parsed.data);
        return reply.code(201).send(deal);
    });
    // GET /api/v1/deals — list all deals
    app.get('/api/v1/deals', async () => {
        return { deals: store.listDeals() };
    });
    // GET /api/v1/deals/:id — get deal by id
    app.get('/api/v1/deals/:id', async (request, reply) => {
        const { id } = request.params;
        const deal = store.getDeal(id);
        if (!deal) {
            return reply.code(404).send({ error: 'Deal not found' });
        }
        return deal;
    });
    // PATCH /api/v1/deals/:id/stage — update deal stage
    app.patch('/api/v1/deals/:id/stage', async (request, reply) => {
        const { id } = request.params;
        const parsed = UpdateDealStageSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const deal = store.updateDealStage(id, parsed.data.stage);
        if (!deal) {
            return reply.code(404).send({ error: 'Deal not found' });
        }
        return deal;
    });
    // DELETE /api/v1/deals/:id — delete deal
    app.delete('/api/v1/deals/:id', async (request, reply) => {
        const { id } = request.params;
        const deleted = store.deleteDeal(id);
        if (!deleted) {
            return reply.code(404).send({ error: 'Deal not found' });
        }
        return reply.code(204).send();
    });
}
//# sourceMappingURL=deals.js.map