import type { FastifyInstance } from 'fastify';
import { store } from '../store.js';
import { CreateTicketSchema, UpdateTicketStatusSchema, AddTicketCommentSchema } from '../schemas.js';

export async function ticketRoutes(app: FastifyInstance) {
  // POST /api/v1/companies/:companyId/tickets — create ticket
  app.post('/api/v1/companies/:companyId/tickets', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const parsed = CreateTicketSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const ticket = store.createTicket(companyId, parsed.data);
    if (!ticket) {
      return reply.code(404).send({ error: 'Company or agent not found' });
    }

    return reply.code(201).send(ticket);
  });

  // GET /api/v1/companies/:companyId/tickets — list tickets
  app.get('/api/v1/companies/:companyId/tickets', async (request, reply) => {
    const { companyId } = request.params as { companyId: string };
    const company = store.getCompany(companyId);
    if (!company) {
      return reply.code(404).send({ error: 'Company not found' });
    }
    return { tickets: store.listTickets(companyId) };
  });

  // GET /api/v1/companies/:companyId/tickets/:ticketId — get ticket
  app.get('/api/v1/companies/:companyId/tickets/:ticketId', async (request, reply) => {
    const { ticketId } = request.params as { companyId: string; ticketId: string };
    const ticket = store.getTicket(ticketId);
    if (!ticket) {
      return reply.code(404).send({ error: 'Ticket not found' });
    }
    return ticket;
  });

  // PATCH /api/v1/companies/:companyId/tickets/:ticketId/status — update ticket status
  app.patch('/api/v1/companies/:companyId/tickets/:ticketId/status', async (request, reply) => {
    const { companyId, ticketId } = request.params as { companyId: string; ticketId: string };
    const parsed = UpdateTicketStatusSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const ticket = store.updateTicketStatus(ticketId, parsed.data.status);
    if (!ticket) {
      return reply.code(404).send({ error: 'Ticket not found' });
    }

    store.addAuditEntry(companyId, {
      action: 'ticket_status_changed',
      actor: 'system',
      details: { ticketId, newStatus: parsed.data.status },
    });

    return ticket;
  });

  // POST /api/v1/companies/:companyId/tickets/:ticketId/comments — add comment
  app.post('/api/v1/companies/:companyId/tickets/:ticketId/comments', async (request, reply) => {
    const { ticketId } = request.params as { companyId: string; ticketId: string };
    const parsed = AddTicketCommentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
    }

    const comment = store.addTicketComment(ticketId, parsed.data);
    if (!comment) {
      return reply.code(404).send({ error: 'Ticket not found' });
    }

    return reply.code(201).send(comment);
  });
}
