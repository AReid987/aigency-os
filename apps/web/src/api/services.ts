// ─── Service API Clients ─────────────────────────────────────────────────────
// Uses @vscp/api-client createAPIClient factory for typed, timeout-aware requests.
// Each service has a health() method for capability gates (graceful degradation).

import { createAPIClient } from '@vscp/api-client';

// ─── Base URLs from env (with localhost defaults) ────────────────────────────

const PAPERCLIP_URL = import.meta.env.VITE_PAPERCLIP_URL || 'http://localhost:3001';
const DENCHCLAW_URL = import.meta.env.VITE_DENCHCLAW_URL || 'http://localhost:3015';
const HCOM_URL = import.meta.env.VITE_HCOM_URL || 'http://localhost:3006';
const GBRAIN_URL = import.meta.env.VITE_GBRAIN_URL || 'http://localhost:3005';
const AEGIS_URL = import.meta.env.VITE_AEGIS_URL || 'http://localhost:3007';
const PLANNOTATOR_URL = import.meta.env.VITE_PLANNOTATOR_URL || 'http://localhost:3008';
const SKILLS_URL = import.meta.env.VITE_SKILLS_URL || 'http://localhost:3010';

// ─── Raw API clients ────────────────────────────────────────────────────────

const paperclipRaw = createAPIClient({ baseUrl: PAPERCLIP_URL, timeout: 10000 });
const denchclawRaw = createAPIClient({ baseUrl: DENCHCLAW_URL, timeout: 10000 });
const hcomRaw = createAPIClient({ baseUrl: HCOM_URL, timeout: 10000 });
const gbrainRaw = createAPIClient({ baseUrl: GBRAIN_URL, timeout: 10000 });
const aegisRaw = createAPIClient({ baseUrl: AEGIS_URL, timeout: 10000 });
const plannotatorRaw = createAPIClient({ baseUrl: PLANNOTATOR_URL, timeout: 10000 });
const skillsRaw = createAPIClient({ baseUrl: SKILLS_URL, timeout: 10000 });

// ─── Health check helper ─────────────────────────────────────────────────────

async function checkHealth(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Paperclip API (companies, agents, goals, tickets, budgets, heartbeats) ──

export const paperclipApi = {
  health: () => checkHealth(PAPERCLIP_URL),

  // Companies
  getCompanies: () => paperclipRaw.get<unknown[]>('/api/v1/companies'),
  getCompany: (id: string) => paperclipRaw.get<unknown>(`/api/v1/companies/${id}`),
  createCompany: (data: unknown) => paperclipRaw.post<unknown>('/api/v1/companies', data),

  // Agents
  getAgents: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/agents`),
  createAgent: (companyId: string, data: unknown) =>
    paperclipRaw.post<unknown>(`/api/v1/companies/${companyId}/agents`, data),
  getAgent: (companyId: string, agentId: string) =>
    paperclipRaw.get<unknown>(`/api/v1/companies/${companyId}/agents/${agentId}`),
  updateAgentStatus: (companyId: string, agentId: string, status: string) =>
    paperclipRaw.put<unknown>(`/api/v1/companies/${companyId}/agents/${agentId}/status`, { status }),

  // Goals
  getGoals: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/goals`),
  createGoal: (companyId: string, data: unknown) =>
    paperclipRaw.post<unknown>(`/api/v1/companies/${companyId}/goals`, data),

  // Tasks
  getTasks: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/tasks`),
  createTask: (companyId: string, data: unknown) =>
    paperclipRaw.post<unknown>(`/api/v1/companies/${companyId}/tasks`, data),
  updateTaskStatus: (taskId: string, status: string) =>
    paperclipRaw.put<unknown>(`/api/v1/tasks/${taskId}/status`, { status }),

  // Tickets
  getTickets: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/tickets`),
  createTicket: (companyId: string, data: unknown) =>
    paperclipRaw.post<unknown>(`/api/v1/companies/${companyId}/tickets`, data),

  // Budgets
  getBudgets: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/budgets`),

  // Heartbeats
  getHeartbeats: (companyId: string) =>
    paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/heartbeats`),

  // Board
  getBoardActions: (companyId: string) =>
    paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/board`),

  // Dashboard (aggregated)
  getDashboard: (companyId: string) =>
    paperclipRaw.get<unknown>(`/api/v1/companies/${companyId}/dashboard`),
};

// ─── DenchClaw CRM API (contacts, deals, sequences, leads, pipeline) ────────

export const denchclawApi = {
  health: () => checkHealth(DENCHCLAW_URL),

  // Contacts
  getContacts: () => denchclawRaw.get<{ contacts: unknown[] }>('/api/v1/contacts'),
  getContact: (id: string) => denchclawRaw.get<unknown>(`/api/v1/contacts/${id}`),
  createContact: (data: unknown) => denchclawRaw.post<unknown>('/api/v1/contacts', data),
  updateContact: (id: string, data: unknown) => denchclawRaw.put<unknown>(`/api/v1/contacts/${id}`, data),
  deleteContact: (id: string) => denchclawRaw.delete<unknown>(`/api/v1/contacts/${id}`),

  // Deals
  getDeals: () => denchclawRaw.get<{ deals: unknown[] }>('/api/v1/deals'),
  getDeal: (id: string) => denchclawRaw.get<unknown>(`/api/v1/deals/${id}`),
  createDeal: (data: unknown) => denchclawRaw.post<unknown>('/api/v1/deals', data),
  updateDealStage: (id: string, stage: string) =>
    denchclawRaw.patch<unknown>(`/api/v1/deals/${id}/stage`, { stage }),
  deleteDeal: (id: string) => denchclawRaw.delete<unknown>(`/api/v1/deals/${id}`),

  // Pipeline
  getPipeline: () => denchclawRaw.get<{ pipeline: unknown[] }>('/api/v1/pipeline'),

  // Sequences (outreach automation)
  getSequences: () => denchclawRaw.get<unknown[]>('/api/v1/sequences'),
  createSequence: (data: unknown) => denchclawRaw.post<unknown>('/api/v1/sequences', data),

  // Leads
  getLeads: () => denchclawRaw.get<unknown[]>('/api/v1/leads'),
  createLead: (data: unknown) => denchclawRaw.post<unknown>('/api/v1/leads', data),
};

// ─── HCOM API (agent communication, messages, collisions) ───────────────────

export const hcomApi = {
  health: () => checkHealth(HCOM_URL),

  // Agents
  getAgents: () => hcomRaw.get<unknown[]>('/agents'),
  getAgent: (id: string) => hcomRaw.get<unknown>(`/agents/${id}`),
  createAgent: (data: unknown) => hcomRaw.post<unknown>('/agents', data),
  getAgentStatus: (id: string) => hcomRaw.get<unknown>(`/agents/${id}/status`),

  // Messages
  getMessages: (agentId: string) => hcomRaw.get<unknown[]>(`/agents/${agentId}/messages`),
  sendMessage: (agentId: string, data: unknown) =>
    hcomRaw.post<unknown>(`/agents/${agentId}/message`, data),
  getInbox: (agentId: string) => hcomRaw.get<unknown[]>(`/agents/${agentId}/inbox`),

  // Collisions
  getCollisions: () => hcomRaw.get<unknown[]>('/collisions'),

  // Dashboard
  getDashboard: () => hcomRaw.get<unknown>('/dashboard'),
};

// ─── Gbrain API (knowledge pages, graph, search) ────────────────────────────

export const gbrainApi = {
  health: () => checkHealth(GBRAIN_URL),

  // Pages
  getPages: (params?: { source?: string; type?: string; scope?: string }) => {
    const qs = new URLSearchParams();
    if (params?.source) qs.set('source', params.source);
    if (params?.type) qs.set('type', params.type);
    if (params?.scope) qs.set('scope', params.scope);
    const query = qs.toString();
    return gbrainRaw.get<{ pages: unknown[] }>(`/api/v1/pages${query ? `?${query}` : ''}`);
  },
  getPage: (id: string) => gbrainRaw.get<unknown>(`/api/v1/pages/${id}`),
  createPage: (data: unknown) => gbrainRaw.post<unknown>('/api/v1/pages', data),

  // Search
  search: (query: string, role?: string) => {
    const qs = new URLSearchParams({ q: query });
    if (role) qs.set('role', role);
    return gbrainRaw.get<{ results: unknown[]; count: number }>(`/api/v1/query?${qs}`);
  },

  // Graph
  getGraph: () => gbrainRaw.get<{ nodes: unknown[]; edges: unknown[] }>('/api/v1/graph'),
};

// ─── AEGIS API (audits, findings, domains) ──────────────────────────────────

export const aegisApi = {
  health: () => checkHealth(AEGIS_URL),

  getAudits: () => aegisRaw.get<unknown[]>('/api/v1/audits'),
  getAudit: (id: string) => aegisRaw.get<unknown>(`/api/v1/audits/${id}`),
  triggerAudit: (data: unknown) => aegisRaw.post<unknown>('/api/v1/audits', data),
  getDomains: () => aegisRaw.get<unknown[]>('/api/v1/domains'),
};

// ─── Plannotator API (plans, annotations) ───────────────────────────────────

export const plannotatorApi = {
  health: () => checkHealth(PLANNOTATOR_URL),

  getPlans: (source?: string) => {
    const qs = source ? `?source=${source}` : '';
    return plannotatorRaw.get<{ plans: unknown[] }>(`/api/v1/plans${qs}`);
  },
  getPlan: (id: string, role?: string) => {
    const qs = role ? `?role=${role}` : '';
    return plannotatorRaw.get<unknown>(`/api/v1/plans/${id}${qs}`);
  },
  approvePlan: (id: string) => plannotatorRaw.post<unknown>(`/api/v1/plans/${id}/approve`, {}),
  rejectPlan: (id: string) => plannotatorRaw.post<unknown>(`/api/v1/plans/${id}/reject`, {}),
  addAnnotation: (planId: string, data: unknown) =>
    plannotatorRaw.post<unknown>(`/api/v1/plans/${planId}/annotations`, data),
};

// ─── Skills API ─────────────────────────────────────────────────────────────

export const skillsApi = {
  health: () => checkHealth(SKILLS_URL),

  getSkills: () => skillsRaw.get<unknown[]>('/api/v1/skills'),
  getSkill: (id: string) => skillsRaw.get<unknown>(`/api/v1/skills/${id}`),
  installSkill: (id: string) => skillsRaw.post<unknown>(`/api/v1/skills/${id}/install`, {}),
};

// ─── Unified health check ───────────────────────────────────────────────────

export interface ServiceHealth {
  name: string;
  url: string;
  status: 'up' | 'down' | 'unreachable';
}

export async function checkAllServices(): Promise<ServiceHealth[]> {
  const services = [
    { name: 'Paperclip', url: PAPERCLIP_URL, api: paperclipApi },
    { name: 'DenchClaw', url: DENCHCLAW_URL, api: denchclawApi },
    { name: 'HCOM', url: HCOM_URL, api: hcomApi },
    { name: 'Gbrain', url: GBRAIN_URL, api: gbrainApi },
    { name: 'AEGIS', url: AEGIS_URL, api: aegisApi },
    { name: 'Plannotator', url: PLANNOTATOR_URL, api: plannotatorApi },
    { name: 'Skills', url: SKILLS_URL, api: skillsApi },
  ];

  const results = await Promise.allSettled(services.map((s) => s.api.health()));
  return services.map((s, i) => ({
    name: s.name,
    url: s.url,
    status: results[i].status === 'fulfilled' && results[i].value ? 'up' as const : 'down' as const,
  }));
}
