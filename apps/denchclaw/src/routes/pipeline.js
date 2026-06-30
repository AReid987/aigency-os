import { store } from '../store.js';
export async function pipelineRoutes(app) {
    // GET /api/v1/pipeline — returns deals grouped by stage
    app.get('/api/v1/pipeline', async () => {
        return { pipeline: store.getPipeline() };
    });
}
//# sourceMappingURL=pipeline.js.map