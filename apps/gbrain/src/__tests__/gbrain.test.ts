import { describe, it, expect, beforeEach } from 'vitest';
import Fastify from 'fastify';

describe('gbrain health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const app = Fastify({ logger: false });
    app.get('/health', async () => ({
      status: 'ok',
      service: 'gbrain',
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
    expect(body.service).toBe('gbrain');
    expect(body.version).toBe('0.1.0');
    expect(body.timestamp).toBeDefined();

    await app.close();
  });
});

describe('gbrain Store', () => {
  it('store module can be imported', async () => {
    const mod = await import('../store');
    expect(mod).toBeDefined();
    expect(mod.store).toBeDefined();
  });

  it('creates and retrieves a page', async () => {
    const { GbrainStore } = await import('../store');
    const testStore = new (GbrainStore as any)();

    const page = testStore.createPage({
      title: 'Test Page',
      content: 'This is test content about architecture.',
      type: 'fact',
      tags: ['test'],
      scope: ['general'],
      confidence: 'medium',
      references: [],
      author: 'test',
    });

    expect(page.id).toBeDefined();
    expect(page.title).toBe('Test Page');

    const retrieved = testStore.getPage(page.id);
    expect(retrieved).toBeDefined();
    expect(retrieved!.title).toBe('Test Page');
  });

  it('queryPages returns results ranked by relevance', async () => {
    const { GbrainStore } = await import('../store');
    const testStore = new (GbrainStore as any)();

    testStore.createPage({
      title: 'Fastify architecture decision',
      content: 'We chose Fastify for performance.',
      type: 'decision',
      tags: ['fastify', 'architecture'],
      scope: ['technical'],
      confidence: 'high',
      references: [],
      author: 'CTO',
    });

    testStore.createPage({
      title: 'Marketing budget plan',
      content: 'Allocate $50K for Q3 marketing.',
      type: 'plan',
      tags: ['marketing', 'budget'],
      scope: ['business'],
      confidence: 'medium',
      references: [],
      author: 'CMO',
    });

    const results = testStore.queryPages('fastify');
    expect(results.length).toBe(1);
    expect(results[0].title).toContain('Fastify');
  });

  it('getScopedResults filters for domain_expert', async () => {
    const { GbrainStore } = await import('../store');
    const testStore = new (GbrainStore as any)();

    const biz = testStore.createPage({
      title: 'Business plan',
      content: 'Revenue targets.',
      type: 'plan',
      tags: ['business'],
      scope: ['business'],
      confidence: 'medium',
      references: [],
      author: 'CEO',
    });

    testStore.createPage({
      title: 'Tech stack decision',
      content: 'Use Fastify.',
      type: 'decision',
      tags: ['tech'],
      scope: ['technical'],
      confidence: 'high',
      references: [],
      author: 'CTO',
    });

    const allPages = testStore.listPages();
    const scoped = testStore.getScopedResults(allPages, 'domain_expert');
    expect(scoped.length).toBe(1);
    expect(scoped[0].title).toBe('Business plan');
  });

  it('getScopedResults returns all for technical_founder', async () => {
    const { GbrainStore } = await import('../store');
    const testStore = new (GbrainStore as any)();

    testStore.createPage({
      title: 'Business plan',
      content: 'Revenue targets.',
      type: 'plan',
      tags: ['business'],
      scope: ['business'],
      confidence: 'medium',
      references: [],
      author: 'CEO',
    });

    testStore.createPage({
      title: 'Tech stack decision',
      content: 'Use Fastify.',
      type: 'decision',
      tags: ['tech'],
      scope: ['technical'],
      confidence: 'high',
      references: [],
      author: 'CTO',
    });

    const allPages = testStore.listPages();
    const scoped = testStore.getScopedResults(allPages, 'technical_founder');
    expect(scoped.length).toBe(2);
  });

  it('addCapture creates a page with source tag', async () => {
    const { GbrainStore } = await import('../store');
    const testStore = new (GbrainStore as any)();

    const page = testStore.addCapture({
      source: 'paperclip',
      title: 'Captured insight',
      content: 'Important data from paperclip.',
      type: 'capture',
      tags: ['insight'],
      scope: ['general'],
    });

    expect(page.title).toBe('[paperclip] Captured insight');
    expect(page.tags).toContain('source:paperclip');
  });

  it('getGraph returns nodes and edges', async () => {
    const { GbrainStore } = await import('../store');
    const testStore = new (GbrainStore as any)();

    testStore.createPage({
      title: 'Page A',
      content: 'Content A',
      type: 'fact',
      tags: ['shared-tag'],
      scope: ['general'],
      confidence: 'medium',
      references: [],
      author: 'test',
    });

    testStore.createPage({
      title: 'Page B',
      content: 'Content B',
      type: 'fact',
      tags: ['shared-tag'],
      scope: ['general'],
      confidence: 'medium',
      references: [],
      author: 'test',
    });

    const graph = testStore.getGraph();
    expect(graph.nodes.length).toBe(2);
    expect(graph.edges.length).toBe(1);
    expect(graph.edges[0].label).toContain('shared_tags');
  });
});
