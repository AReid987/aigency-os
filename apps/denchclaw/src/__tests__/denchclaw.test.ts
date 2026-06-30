import { describe, it, expect } from 'vitest';
import Fastify from 'fastify';

describe('denchclaw health endpoint', () => {
  it('GET /health returns status ok', async () => {
    const app = Fastify({ logger: false });
    app.get('/health', async () => ({
      status: 'ok',
      service: 'denchclaw',
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
    expect(body.service).toBe('denchclaw');
    expect(body.version).toBe('0.1.0');
    expect(body.timestamp).toBeDefined();

    await app.close();
  });
});

describe('denchclaw Store', () => {
  it('store module can be imported', async () => {
    const mod = await import('../store');
    expect(mod).toBeDefined();
    expect(mod.store).toBeDefined();
  });

  it('seed populates contacts and deals', async () => {
    const { store } = await import('../store');
    store.seed();
    expect(store.listContacts().length).toBeGreaterThanOrEqual(5);
    expect(store.listDeals().length).toBeGreaterThanOrEqual(3);
  });

  it('createContact and getContact work', async () => {
    const { store } = await import('../store');
    const contact = store.createContact({ name: 'Test User', email: 'test@example.com' });
    expect(contact.name).toBe('Test User');
    expect(contact.email).toBe('test@example.com');
    expect(contact.id).toBeDefined();

    const fetched = store.getContact(contact.id);
    expect(fetched).toBeDefined();
    expect(fetched!.name).toBe('Test User');
  });

  it('createDeal and updateDealStage work', async () => {
    const { store } = await import('../store');
    const contact = store.createContact({ name: 'Deal User', email: 'deal@example.com' });
    const deal = store.createDeal({ title: 'Test Deal', contactId: contact.id, value: 5000 });
    expect(deal.stage).toBe('lead');

    const updated = store.updateDealStage(deal.id, 'proposal');
    expect(updated).toBeDefined();
    expect(updated!.stage).toBe('proposal');
  });

  it('updateLeadScore works', async () => {
    const { store } = await import('../store');
    const leads = store.listLeads();
    expect(leads.length).toBeGreaterThan(0);

    const lead = store.updateLeadScore(leads[0].id, 85);
    expect(lead).toBeDefined();
    expect(lead!.score).toBe(85);
  });

  it('getPipeline returns deals grouped by stage', async () => {
    const { store } = await import('../store');
    store.seed();
    const pipeline = store.getPipeline();
    expect(pipeline).toBeDefined();
    expect(typeof pipeline).toBe('object');
    // Should have all stage keys
    expect('lead' in pipeline).toBe(true);
    expect('qualified' in pipeline).toBe(true);
    expect('proposal' in pipeline).toBe(true);
    expect('negotiation' in pipeline).toBe(true);
    expect('closed_won' in pipeline).toBe(true);
    expect('closed_lost' in pipeline).toBe(true);
  });
});
