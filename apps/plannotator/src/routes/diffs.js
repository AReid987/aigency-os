import { store } from '../store.js';
export async function diffRoutes(app) {
    // GET /api/v1/plans/:id/diff/:v1/:v2 — compare two plan versions
    app.get('/api/v1/plans/:id/diff/:v1/:v2', async (request, reply) => {
        const { id, v1, v2 } = request.params;
        const version1 = parseInt(v1, 10);
        const version2 = parseInt(v2, 10);
        if (isNaN(version1) || isNaN(version2)) {
            return reply.code(400).send({ error: 'Invalid version numbers' });
        }
        const diff = store.getDiff(id, version1, version2);
        if (!diff) {
            return reply.code(404).send({ error: 'Plan or versions not found' });
        }
        return diff;
    });
}
//# sourceMappingURL=diffs.js.map