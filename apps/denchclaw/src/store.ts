// ─── Domain Types ──────────────────────────────────────────────────────────

export interface Contact {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  value: number;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  createdAt: string;
  updatedAt: string;
}

export interface SequenceStep {
  type: 'email' | 'call' | 'task';
  delayDays: number;
  content: string;
}

export interface Sequence {
  id: string;
  name: string;
  steps: SequenceStep[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  contactId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

// ─── In-Memory Store ──────────────────────────────────────────────────────

class Store {
  contacts = new Map<string, Contact>();
  deals = new Map<string, Deal>();
  sequences = new Map<string, Sequence>();
  leads = new Map<string, Lead>();

  // ─── Contact Methods ──────────────────────────────────────────────────

  createContact(data: { name: string; email: string; company?: string; phone?: string; tags?: string[] }): Contact {
    const contact: Contact = {
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
    const lead: Lead = {
      id: crypto.randomUUID(),
      contactId: contact.id,
      score: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.leads.set(lead.id, lead);

    return contact;
  }

  getContact(id: string): Contact | undefined {
    return this.contacts.get(id);
  }

  listContacts(): Contact[] {
    return Array.from(this.contacts.values());
  }

  updateContact(id: string, data: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>): Contact | undefined {
    const contact = this.contacts.get(id);
    if (!contact) return undefined;

    const updated = { ...contact, ...data, updatedAt: new Date().toISOString() };
    this.contacts.set(id, updated);
    return updated;
  }

  deleteContact(id: string): boolean {
    return this.contacts.delete(id);
  }

  // ─── Deal Methods ─────────────────────────────────────────────────────

  createDeal(data: { title: string; contactId: string; value: number; stage?: Deal['stage'] }): Deal {
    const deal: Deal = {
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

  getDeal(id: string): Deal | undefined {
    return this.deals.get(id);
  }

  listDeals(): Deal[] {
    return Array.from(this.deals.values());
  }

  updateDealStage(id: string, stage: Deal['stage']): Deal | undefined {
    const deal = this.deals.get(id);
    if (!deal) return undefined;

    deal.stage = stage;
    deal.updatedAt = new Date().toISOString();
    return deal;
  }

  deleteDeal(id: string): boolean {
    return this.deals.delete(id);
  }

  // ─── Sequence Methods ─────────────────────────────────────────────────

  createSequence(data: { name: string; steps: SequenceStep[] }): Sequence {
    const sequence: Sequence = {
      id: crypto.randomUUID(),
      name: data.name,
      steps: data.steps,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.sequences.set(sequence.id, sequence);
    return sequence;
  }

  getSequence(id: string): Sequence | undefined {
    return this.sequences.get(id);
  }

  listSequences(): Sequence[] {
    return Array.from(this.sequences.values());
  }

  deleteSequence(id: string): boolean {
    return this.sequences.delete(id);
  }

  // ─── Lead Methods ─────────────────────────────────────────────────────

  getLead(id: string): Lead | undefined {
    return this.leads.get(id);
  }

  listLeads(): Lead[] {
    return Array.from(this.leads.values());
  }

  updateLeadScore(id: string, score: number): Lead | undefined {
    const lead = this.leads.get(id);
    if (!lead) return undefined;

    lead.score = score;
    lead.updatedAt = new Date().toISOString();
    return lead;
  }

  // ─── Pipeline Methods ─────────────────────────────────────────────────

  getPipeline(): Record<string, Deal[]> {
    const stages: Record<string, Deal[]> = {
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

  seed(): void {
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
