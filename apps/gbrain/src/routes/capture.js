import { store } from '../store.js';
import { CaptureSchema } from '../schemas.js';
export async function captureRoutes(app) {
    // POST /api/v1/capture — auto-capture knowledge from external source
    app.post('/api/v1/capture', async (request, reply) => {
        const parsed = CaptureSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const page = store.addCapture(parsed.data);
        return reply.code(201).send({
            message: `Captured from ${parsed.data.source}`,
            page,
        });
    });
}
//# sourceMappingURL=capture.js.map