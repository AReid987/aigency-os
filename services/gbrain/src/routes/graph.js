import { store } from '../store.js';
export async function graphRoutes(app) {
    // GET /api/v1/graph — returns knowledge graph data (nodes + edges)
    app.get('/api/v1/graph', async () => {
        const graph = store.getGraph();
        return {
            nodeCount: graph.nodes.length,
            edgeCount: graph.edges.length,
            ...graph,
        };
    });
}
//# sourceMappingURL=graph.js.map