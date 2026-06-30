import { store } from '../store.js';
export async function jobRoutes(app) {
    // GET /api/v1/jobs — list all jobs
    app.get('/api/v1/jobs', async () => {
        return { jobs: store.listJobs() };
    });
    // GET /api/v1/jobs/:id — get job by id
    app.get('/api/v1/jobs/:id', async (request, reply) => {
        const { id } = request.params;
        const job = store.getJob(id);
        if (!job) {
            return reply.code(404).send({ error: 'Job not found' });
        }
        return job;
    });
}
//# sourceMappingURL=jobs.js.map