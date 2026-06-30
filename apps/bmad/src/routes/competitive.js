import { store } from '../store.js';
import { CreateCompetitiveAnalysisSchema } from '../schemas.js';
export async function competitiveRoutes(app) {
    // POST /api/v1/competitive — create competitive analysis
    app.post('/api/v1/competitive', async (request, reply) => {
        const parsed = CreateCompetitiveAnalysisSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const analysis = store.createCompetitiveAnalysis(parsed.data);
        if (!analysis) {
            return reply.code(404).send({ error: 'Canvas not found' });
        }
        return reply.code(201).send(analysis);
    });
    // GET /api/v1/competitive — list all competitive analyses
    app.get('/api/v1/competitive', async () => {
        return { competitiveAnalyses: Array.from(store.competitiveAnalyses.values()) };
    });
}
//# sourceMappingURL=competitive.js.map