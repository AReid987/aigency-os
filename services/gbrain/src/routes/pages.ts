import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreatePageSchema } from '../schemas.js';

export async function pageRoutes(app: FastifyInstance) {
  // POST /api/v1/pages — create a knowledge page
  app.post('/api/v1/pages', async (request, reply) => {
    const parsed = CreatePageSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const page = store.createPage(parsed.data);
    return reply.code(201).send(page);
  });

  // GET /api/v1/pages — list all pages
  app.get('/api/v1/pages', async () => {
    return { pages: store.listPages() };
  });

  // GET /api/v1/pages/:id — get page by id
  app.get('/api/v1/pages/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const page = store.getPage(id);
    if (!page) {
      return reply.code(404).send({ error: 'Page not found' });
    }
    return page;
  });
}
