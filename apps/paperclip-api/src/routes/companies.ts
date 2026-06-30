import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreateCompanySchema, UpdateCompanySchema } from '../schemas.js';

export async function companyRoutes(app: FastifyInstance) {
  // POST /api/v1/companies — create company
  app.post('/api/v1/companies', async (request, reply) => {
    const parsed = CreateCompanySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const company = store.createCompany(parsed.data);
    const ceoAgent = company.agents[0];

    return reply.code(201).send({
      company_id: company.id,
      ceo_agent_id: ceoAgent.id,
      company,
    });
  });

  // GET /api/v1/companies — list companies
  app.get('/api/v1/companies', async () => {
    return { companies: store.listCompanies() };
  });

  // GET /api/v1/companies/:id — get company by id
  app.get('/api/v1/companies/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const company = store.getCompany(id);
    if (!company) {
      return reply.code(404).send({ error: 'Company not found' });
    }
    return company;
  });

  // PATCH /api/v1/companies/:id — update company
  app.patch('/api/v1/companies/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const parsed = UpdateCompanySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const company = store.updateCompany(id, parsed.data);
    if (!company) {
      return reply.code(404).send({ error: 'Company not found' });
    }

    store.addAuditEntry(id, {
      action: 'company_updated',
      actor: 'system',
      details: parsed.data,
    });

    return company;
  });

  // DELETE /api/v1/companies/:id — delete company
  app.delete('/api/v1/companies/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const deleted = store.deleteCompany(id);
    if (!deleted) {
      return reply.code(404).send({ error: 'Company not found' });
    }
    return reply.code(204).send();
  });
}
