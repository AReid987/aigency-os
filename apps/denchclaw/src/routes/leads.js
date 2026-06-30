import { store } from '../store.js';
import { UpdateLeadScoreSchema } from '../schemas.js';
export async function leadRoutes(app) {
    // GET /api/v1/leads — list all leads
    app.get('/api/v1/leads', async () => {
        return { leads: store.listLeads() };
    });
    // GET /api/v1/leads/:id — get lead by id
    app.get('/api/v1/leads/:id', async (request, reply) => {
        const { id } = request.params;
        const lead = store.getLead(id);
        if (!lead) {
            return reply.code(404).send({ error: 'Lead not found' });
        }
        return lead;
    });
    // PATCH /api/v1/leads/:id/score — update lead score
    app.patch('/api/v1/leads/:id/score', async (request, reply) => {
        const { id } = request.params;
        const parsed = UpdateLeadScoreSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const lead = store.updateLeadScore(id, parsed.data.score);
        if (!lead) {
            return reply.code(404).send({ error: 'Lead not found' });
        }
        return lead;
    });
}
//# sourceMappingURL=leads.js.map