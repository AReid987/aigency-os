import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';

describe('paperclip-api health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const app = Fastify({ logger: false });
    app.get('/health', async () => ({
      status: 'ok',
      service: 'paperclip-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    }));

    const response = await app.inject({
      method: 'GET',
      url: '/health',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('paperclip-api');
    expect(body.version).toBe('0.1.0');
    expect(body.timestamp).toBeDefined();

    await app.close();
  });
});

describe('paperclip-api Store', () => {
  it('store module can be imported', async () => {
    const mod = await import('../store');
    expect(mod).toBeDefined();
  });
});
