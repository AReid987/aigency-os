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
declare class Store {
    contacts: Map<string, Contact>;
    deals: Map<string, Deal>;
    sequences: Map<string, Sequence>;
    leads: Map<string, Lead>;
    createContact(data: {
        name: string;
        email: string;
        company?: string;
        phone?: string;
        tags?: string[];
    }): Contact;
    getContact(id: string): Contact | undefined;
    listContacts(): Contact[];
    updateContact(id: string, data: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>): Contact | undefined;
    deleteContact(id: string): boolean;
    createDeal(data: {
        title: string;
        contactId: string;
        value: number;
        stage?: Deal['stage'];
    }): Deal;
    getDeal(id: string): Deal | undefined;
    listDeals(): Deal[];
    updateDealStage(id: string, stage: Deal['stage']): Deal | undefined;
    deleteDeal(id: string): boolean;
    createSequence(data: {
        name: string;
        steps: SequenceStep[];
    }): Sequence;
    getSequence(id: string): Sequence | undefined;
    listSequences(): Sequence[];
    deleteSequence(id: string): boolean;
    getLead(id: string): Lead | undefined;
    listLeads(): Lead[];
    updateLeadScore(id: string, score: number): Lead | undefined;
    getPipeline(): Record<string, Deal[]>;
    seed(): void;
}
export declare const store: Store;
export {};
//# sourceMappingURL=store.d.ts.map