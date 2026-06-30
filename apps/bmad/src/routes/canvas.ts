import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreateCanvasSchema } from '../schemas.js';

export async function canvasRoutes(app: FastifyInstance) {
  // POST /api/v1/canvas — create business model canvas
  app.post('/api/v1/canvas', async (request, reply) => {
    const parsed = CreateCanvasSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const canvas = store.createCanvas(parsed.data);
    return reply.code(201).send(canvas);
  });

  // GET /api/v1/canvas — list all canvases
  app.get('/api/v1/canvas', async () => {
    return { canvases: store.listCanvases() };
  });

  // GET /api/v1/canvas/:id — get single canvas
  app.get('/api/v1/canvas/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const canvas = store.getCanvas(id);
    if (!canvas) {
      return reply.code(404).send({ error: 'Canvas not found' });
    }
    return canvas;
  });
}
