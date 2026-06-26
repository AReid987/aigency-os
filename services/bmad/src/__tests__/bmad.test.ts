import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';
import { store } from '../store.js';

describe('bmad health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const app = Fastify({ logger: false });
    app.get('/health', async () => ({
      status: 'ok',
      service: 'bmad',
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
    expect(body.service).toBe('bmad');
    expect(body.version).toBe('0.1.0');
    expect(body.timestamp).toBeDefined();

    await app.close();
  });
});

describe('bmad store', () => {
  it('can create and retrieve a canvas', () => {
    const canvas = store.createCanvas({
      name: 'Test Canvas',
      valueProposition: 'Test VP',
      customerSegments: ['segment1'],
      channels: ['channel1'],
      revenueStreams: ['stream1'],
      costStructure: ['cost1'],
      keyActivities: ['activity1'],
      keyResources: ['resource1'],
      keyPartners: ['partner1'],
    });

    expect(canvas.id).toBeDefined();
    expect(canvas.name).toBe('Test Canvas');

    const retrieved = store.getCanvas(canvas.id);
    expect(retrieved).toBeDefined();
    expect(retrieved!.name).toBe('Test Canvas');
  });

  it('can calculate unit economics', () => {
    const result = store.calculateUnitEconomics({
      unitPrice: 100,
      costPerUnit: 40,
      fixedCosts: 10000,
      projectedVolume: 500,
    });

    expect(result.revenuePerUnit).toBe(100);
    expect(result.costPerUnit).toBe(40);
    expect(result.marginPerUnit).toBe(60);
    expect(result.marginPercent).toBe(60);
    expect(result.breakEvenVolume).toBe(167);
  });

  it('returns undefined for revenue model on nonexistent canvas', () => {
    const result = store.createRevenueModel({
      canvasId: '00000000-0000-0000-0000-000000000000',
      modelType: 'subscription',
      pricingStrategy: 'tiered',
      unitPrice: 50,
      projectedVolume: 100,
      currency: 'USD',
    });
    expect(result).toBeUndefined();
  });
});
