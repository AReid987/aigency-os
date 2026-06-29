// ─── Domain Types ──────────────────────────────────────────────────────────
// ─── In-Memory Store ──────────────────────────────────────────────────────
class Store {
    contacts = new Map();
    deals = new Map();
    sequences = new Map();
    leads = new Map();
    // ─── Contact Methods ──────────────────────────────────────────────────
    createContact(data) {
        const contact = {
            id: crypto.randomUUID(),
            name: data.name,
            email: data.email,
            company: data.company,
            phone: data.phone,
            tags: data.tags ?? [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.contacts.set(contact.id, contact);
        // Also create a lead for this contact
        const lead = {
            id: crypto.randomUUID(),
            contactId: contact.id,
            score: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.leads.set(lead.id, lead);
        return contact;
    }
    getContact(id) {
        return this.contacts.get(id);
    }
    listContacts() {
        return Array.from(this.contacts.values());
    }
    updateContact(id, data) {
        const contact = this.contacts.get(id);
        if (!contact)
            return undefined;
        const updated = { ...contact, ...data, updatedAt: new Date().toISOString() };
        this.contacts.set(id, updated);
        return updated;
    }
    deleteContact(id) {
        return this.contacts.delete(id);
    }
    // ─── Deal Methods ─────────────────────────────────────────────────────
    createDeal(data) {
        const deal = {
            id: crypto.randomUUID(),
            title: data.title,
            contactId: data.contactId,
            value: data.value,
            stage: data.stage ?? 'lead',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.deals.set(deal.id, deal);
        return deal;
    }
    getDeal(id) {
        return this.deals.get(id);
    }
    listDeals() {
        return Array.from(this.deals.values());
    }
    updateDealStage(id, stage) {
        const deal = this.deals.get(id);
        if (!deal)
            return undefined;
        deal.stage = stage;
        deal.updatedAt = new Date().toISOString();
        return deal;
    }
    deleteDeal(id) {
        return this.deals.delete(id);
    }
    // ─── Sequence Methods ─────────────────────────────────────────────────
    createSequence(data) {
        const sequence = {
            id: crypto.randomUUID(),
            name: data.name,
            steps: data.steps,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        this.sequences.set(sequence.id, sequence);
        return sequence;
    }
    getSequence(id) {
        return this.sequences.get(id);
    }
    listSequences() {
        return Array.from(this.sequences.values());
    }
    deleteSequence(id) {
        return this.sequences.delete(id);
    }
    // ─── Lead Methods ─────────────────────────────────────────────────────
    getLead(id) {
        return this.leads.get(id);
    }
    listLeads() {
        return Array.from(this.leads.values());
    }
    updateLeadScore(id, score) {
        const lead = this.leads.get(id);
        if (!lead)
            return undefined;
        lead.score = score;
        lead.updatedAt = new Date().toISOString();
        return lead;
    }
    // ─── Pipeline Methods ─────────────────────────────────────────────────
    getPipeline() {
        const stages = {
            lead: [],
            qualified: [],
            proposal: [],
            negotiation: [],
            closed_won: [],
            closed_lost: [],
        };
        for (const deal of this.deals.values()) {
            stages[deal.stage].push(deal);
        }
        return stages;
    }
    // ─── Seed Data ────────────────────────────────────────────────────────
    seed() {
        // Seed 5 demo contacts
        const contacts = [
            { name: 'Alice Johnson', email: 'alice@example.com', company: 'Acme Corp', phone: '555-0101', tags: ['enterprise', 'hot'] },
            { name: 'Bob Williams', email: 'bob@example.com', company: 'TechStart', phone: '555-0102', tags: ['startup'] },
            { name: 'Carol Davis', email: 'carol@example.com', company: 'MegaCo', phone: '555-0103', tags: ['enterprise', 'renewal'] },
            { name: 'David Lee', email: 'david@example.com', company: 'Innovate Inc', phone: '555-0104', tags: ['mid-market'] },
            { name: 'Eva Martinez', email: 'eva@example.com', company: 'Future Ltd', phone: '555-0105', tags: ['partner'] },
        ];
        const createdContacts = contacts.map((c) => this.createContact(c));
        // Seed 3 demo deals
        this.createDeal({ title: 'Acme Enterprise License', contactId: createdContacts[0].id, value: 50000, stage: 'proposal' });
        this.createDeal({ title: 'TechStart Pilot Program', contactId: createdContacts[1].id, value: 10000, stage: 'qualified' });
        this.createDeal({ title: 'MegaCo Annual Renewal', contactId: createdContacts[2].id, value: 120000, stage: 'negotiation' });
    }
}
export const store = new Store();
//# sourceMappingURL=store.js.map