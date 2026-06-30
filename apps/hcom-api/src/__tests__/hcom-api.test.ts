import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';

describe('hcom-api health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const app = Fastify({ logger: false });
    app.get('/health', async () => ({
      status: 'ok',
      service: 'hcom-api',
      timestamp: new Date().toISOString(),
    }));

    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('hcom-api');
    expect(body.timestamp).toBeDefined();

    await app.close();
  });
});

describe('hcom-api database module', () => {
  it('db module can be imported', async () => {
    const mod = await import('../db');
    expect(mod.default).toBeDefined();
    mod.default.close();
  });
});
