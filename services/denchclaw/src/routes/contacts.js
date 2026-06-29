import { store } from '../store.js';
import { CreateContactSchema, UpdateContactSchema } from '../schemas.js';
export async function contactRoutes(app) {
    // POST /api/v1/contacts — create contact
    app.post('/api/v1/contacts', async (request, reply) => {
        const parsed = CreateContactSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const contact = store.createContact(parsed.data);
        return reply.code(201).send(contact);
    });
    // GET /api/v1/contacts — list all contacts
    app.get('/api/v1/contacts', async () => {
        return { contacts: store.listContacts() };
    });
    // GET /api/v1/contacts/:id — get contact by id
    app.get('/api/v1/contacts/:id', async (request, reply) => {
        const { id } = request.params;
        const contact = store.getContact(id);
        if (!contact) {
            return reply.code(404).send({ error: 'Contact not found' });
        }
        return contact;
    });
    // PATCH /api/v1/contacts/:id — update contact
    app.patch('/api/v1/contacts/:id', async (request, reply) => {
        const { id } = request.params;
        const parsed = UpdateContactSchema.safeParse(request.body);
        if (!parsed.success) {
            return reply.code(400).send({ error: 'Validation failed', details: parsed.error.issues });
        }
        const contact = store.updateContact(id, parsed.data);
        if (!contact) {
            return reply.code(404).send({ error: 'Contact not found' });
        }
        return contact;
    });
    // DELETE /api/v1/contacts/:id — delete contact
    app.delete('/api/v1/contacts/:id', async (request, reply) => {
        const { id } = request.params;
        const deleted = store.deleteContact(id);
        if (!deleted) {
            return reply.code(404).send({ error: 'Contact not found' });
        }
        return reply.code(204).send();
    });
}
//# sourceMappingURL=contacts.js.map