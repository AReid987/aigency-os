// ─── Unified API Client Configuration ────────────────────────────────────────
// This variant is used when all backend services run in a single process.
// All APIs share the same base URL with path prefixes.
//
// To use: set VITE_UNIFIED_MODE=true in your build environment.
// The frontend will automatically point all services to the same origin.
// ─────────────────────────────────────────────────────────────────────────────

import { createAPIClient } from '@vscp/api-client';

// ─── Base URL ────────────────────────────────────────────────────────────────
// In unified mode, all services are served from the same origin.

const isUnified = import.meta.env.VITE_UNIFIED_MODE === 'true' || import.meta.env.VITE_UNIFIED_MODE === '1';
const API_BASE = isUnified
  ? (import.meta.env.VITE_API_URL || window.location.origin)
  : (import.meta.env.VITE_PAPERCLIP_URL || 'http://localhost:3001');

// In unified mode, all service paths are prefixed under the same base URL.
const PAPERCLIP_URL = API_BASE;
const DENCHCLAW_URL = API_BASE;  // routes: /api/denchclaw/...
const HCOM_URL = API_BASE;       // routes: /api/hcom/...
const GBRAIN_URL = API_BASE;     // routes: /api/gbrain/...
const AEGIS_URL = API_BASE;      // routes: /api/aegis/...
const PLANNOTATOR_URL = API_BASE; // routes: /api/plannotator/...
const SKILLS_URL = API_BASE;     // routes: /api/skills/...
const BMAD_URL = API_BASE;       // routes: /api/bmad/...
const PAUL_URL = API_BASE;       // routes: /api/paul/...
const GSTACK_URL = API_BASE;     // routes: /api/gstack/...

// ─── Raw API clients ────────────────────────────────────────────────────────

const paperclipRaw = createAPIClient({ baseUrl: PAPERCLIP_URL, timeout: 10000 });
const denchclawRaw = createAPIClient({ baseUrl: DENCHCLAW_URL, timeout: 10000 });
const hcomRaw = createAPIClient({ baseUrl: HCOM_URL, timeout: 10000 });
const gbrainRaw = createAPIClient({ baseUrl: GBRAIN_URL, timeout: 10000 });
const aegisRaw = createAPIClient({ baseUrl: AEGIS_URL, timeout: 10000 });
const plannotatorRaw = createAPIClient({ baseUrl: PLANNOTATOR_URL, timeout: 10000 });
const skillsRaw = createAPIClient({ baseUrl: SKILLS_URL, timeout: 10000 });
const bmadRaw = createAPIClient({ baseUrl: BMAD_URL, timeout: 10000 });
const paulRaw = createAPIClient({ baseUrl: PAUL_URL, timeout: 10000 });
const gstackRaw = createAPIClient({ baseUrl: GSTACK_URL, timeout: 10000 });

// ─── Health check helper ───────────────────────────────────────────────────

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

  getCompanies: () => paperclipRaw.get<unknown[]>('/api/v1/companies'),
  getCompany: (id: string) => paperclipRaw.get<unknown>(`/api/v1/companies/${id}`),
  createCompany: (data: unknown) => paperclipRaw.post<unknown>('/api/v1/companies', data),

  getAgents: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/agents`),
  createAgent: (companyId: string, data: unknown) =>
    paperclipRaw.post<unknown>(`/api/v1/companies/${companyId}/agents`, data),
  getAgent: (companyId: string, agentId: string) =>
    paperclipRaw.get<unknown>(`/api/v1/companies/${companyId}/agents/${agentId}`),
  updateAgentStatus: (companyId: string, agentId: string, status: string) =>
    paperclipRaw.put<unknown>(`/api/v1/companies/${companyId}/agents/${agentId}/status`, { status }),

  getGoals: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/goals`),
  createGoal: (companyId: string, data: unknown) =>
    paperclipRaw.post<unknown>(`/api/v1/companies/${companyId}/goals`, data),

  getTasks: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/tasks`),
  createTask: (companyId: string, data: unknown) =>
    paperclipRaw.post<unknown>(`/api/v1/companies/${companyId}/tasks`, data),
  updateTaskStatus: (taskId: string, status: string) =>
    paperclipRaw.put<unknown>(`/api/v1/tasks/${taskId}/status`, { status }),

  getTickets: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/tickets`),
  createTicket: (companyId: string, data: unknown) =>
    paperclipRaw.post<unknown>(`/api/v1/companies/${companyId}/tickets`, data),

  getBudgets: (companyId: string) => paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/budgets`),

  getHeartbeats: (companyId: string) =>
    paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/heartbeats`),

  getBoardActions: (companyId: string) =>
    paperclipRaw.get<unknown[]>(`/api/v1/companies/${companyId}/board`),

  getDashboard: (companyId: string) =>
    paperclipRaw.get<unknown>(`/api/v1/companies/${companyId}/dashboard`),
};

// ─── DenchClaw CRM API ───────────────────────────────────────────────────────

export const denchclawApi = {
  health: () => checkHealth(DENCHCLAW_URL),

  getContacts: () => denchclawRaw.get<{ contacts: unknown[] }>('/api/denchclaw/contacts'),
  getContact: (id: string) => denchclawRaw.get<unknown>(`/api/denchclaw/contacts/${id}`),
  createContact: (data: unknown) => denchclawRaw.post<unknown>('/api/denchclaw/contacts', data),
  updateContact: (id: string, data: unknown) => denchclawRaw.put<unknown>(`/api/denchclaw/contacts/${id}`, data),
  deleteContact: (id: string) => denchclawRaw.delete<unknown>(`/api/denchclaw/contacts/${id}`),

  getDeals: () => denchclawRaw.get<{ deals: unknown[] }>('/api/denchclaw/deals'),
  getDeal: (id: string) => denchclawRaw.get<unknown>(`/api/denchclaw/deals/${id}`),
  createDeal: (data: unknown) => denchclawRaw.post<unknown>('/api/denchclaw/deals', data),
  updateDealStage: (id: string, stage: string) =>
    denchclawRaw.patch<unknown>(`/api/denchclaw/deals/${id}/stage`, { stage }),
  deleteDeal: (id: string) => denchclawRaw.delete<unknown>(`/api/denchclaw/deals/${id}`),

  getPipeline: () => denchclawRaw.get<{ pipeline: unknown[] }>('/api/denchclaw/pipeline'),
  getSequences: () => denchclawRaw.get<unknown[]>('/api/denchclaw/sequences'),
  createSequence: (data: unknown) => denchclawRaw.post<unknown>('/api/denchclaw/sequences', data),
  getLeads: () => denchclawRaw.get<unknown[]>('/api/denchclaw/leads'),
  createLead: (data: unknown) => denchclawRaw.post<unknown>('/api/denchclaw/leads', data),
};

// ─── HCOM API ────────────────────────────────────────────────────────────────

export const hcomApi = {
  health: () => checkHealth(HCOM_URL),

  getAgents: () => hcomRaw.get<unknown[]>('/api/hcom/agents'),
  getAgent: (id: string) => hcomRaw.get<unknown>(`/api/hcom/agents/${id}`),
  createAgent: (data: unknown) => hcomRaw.post<unknown>('/api/hcom/agents', data),
  getAgentStatus: (id: string) => hcomRaw.get<unknown>(`/api/hcom/agents/${id}/status`),

  getMessages: (agentId: string) => hcomRaw.get<unknown[]>(`/api/hcom/agents/${agentId}/messages`),
  sendMessage: (agentId: string, data: unknown) =>
    hcomRaw.post<unknown>(`/api/hcom/agents/${agentId}/message`, data),
  getInbox: (agentId: string) => hcomRaw.get<unknown[]>(`/api/hcom/agents/${agentId}/inbox`),

  getCollisions: () => hcomRaw.get<unknown[]>('/api/hcom/collisions'),
  getDashboard: () => hcomRaw.get<unknown>('/api/hcom/dashboard'),
};

// ─── Gbrain API ──────────────────────────────────────────────────────────────

export const gbrainApi = {
  health: () => checkHealth(GBRAIN_URL),

  getPages: (params?: { source?: string; type?: string; scope?: string }) => {
    const qs = new URLSearchParams();
    if (params?.source) qs.set('source', params.source);
    if (params?.type) qs.set('type', params.type);
    if (params?.scope) qs.set('scope', params.scope);
    const query = qs.toString();
    return gbrainRaw.get<{ pages: unknown[] }>(`/api/gbrain/pages${query ? `?${query}` : ''}`);
  },
  getPage: (id: string) => gbrainRaw.get<unknown>(`/api/gbrain/pages/${id}`),
  createPage: (data: unknown) => gbrainRaw.post<unknown>('/api/gbrain/pages', data),

  search: (query: string, role?: string) => {
    const qs = new URLSearchParams({ q: query });
    if (role) qs.set('role', role);
    return gbrainRaw.get<{ results: unknown[]; count: number }>(`/api/gbrain/query?${qs}`);
  },

  getGraph: () => gbrainRaw.get<{ nodes: unknown[]; edges: unknown[] }>('/api/gbrain/graph'),
};

// ─── AEGIS API ───────────────────────────────────────────────────────────────

export const aegisApi = {
  health: () => checkHealth(AEGIS_URL),

  getAudits: () => aegisRaw.get<unknown[]>('/api/aegis/audits'),
  getAudit: (id: string) => aegisRaw.get<unknown>(`/api/aegis/audits/${id}`),
  triggerAudit: (data: unknown) => aegisRaw.post<unknown>('/api/aegis/audits', data),
  getDomains: () => aegisRaw.get<unknown[]>('/api/aegis/domains'),
};

// ─── Plannotator API ──────────────────────────────────────────────────────────

export const plannotatorApi = {
  health: () => checkHealth(PLANNOTATOR_URL),

  getPlans: (source?: string) => {
    const qs = source ? `?source=${source}` : '';
    return plannotatorRaw.get<{ plans: unknown[] }>(`/api/plannotator/plans${qs}`);
  },
  getPlan: (id: string, role?: string) => {
    const qs = role ? `?role=${role}` : '';
    return plannotatorRaw.get<unknown>(`/api/plannotator/plans/${id}${qs}`);
  },
  approvePlan: (id: string) => plannotatorRaw.post<unknown>(`/api/plannotator/plans/${id}/approve`, {}),
  rejectPlan: (id: string) => plannotatorRaw.post<unknown>(`/api/plannotator/plans/${id}/reject`, {}),
  addAnnotation: (planId: string, data: unknown) =>
    plannotatorRaw.post<unknown>(`/api/plannotator/plans/${planId}/annotations`, data),
};

// ─── Skills API ───────────────────────────────────────────────────────────────

export const skillsApi = {
  health: () => checkHealth(SKILLS_URL),

  getSkills: () => skillsRaw.get<unknown[]>('/api/skills/skills'),
  getSkill: (id: string) => skillsRaw.get<unknown>(`/api/skills/skills/${id}`),
  installSkill: (id: string) => skillsRaw.post<unknown>(`/api/skills/skills/${id}/install`, {}),
};

// ─── BMAD API ─────────────────────────────────────────────────────────────────

export const bmadApi = {
  health: () => checkHealth(BMAD_URL),

  getCanvas: () => bmadRaw.get<unknown>('/api/bmad/canvas'),
  getRevenue: () => bmadRaw.get<unknown>('/api/bmad/revenue'),
  getMilestones: () => bmadRaw.get<unknown[]>('/api/bmad/milestones'),
  getCompetitive: () => bmadRaw.get<unknown>('/api/bmad/competitive'),
};

// ─── PAUL API ───────────────────────────────────────────────────────────────

export const paulApi = {
  health: () => checkHealth(PAUL_URL),

  getPlans: () => paulRaw.get<unknown[]>('/api/paul/plans'),
  applyPlan: (data: unknown) => paulRaw.post<unknown>('/api/paul/apply', data),
  unify: (data: unknown) => paulRaw.post<unknown>('/api/paul/unify', data),
  getCriteria: () => paulRaw.get<unknown[]>('/api/paul/criteria'),
};

// ─── GStack API ───────────────────────────────────────────────────────────────

export const gstackApi = {
  health: () => checkHealth(GSTACK_URL),

  getAutoplan: () => gstackRaw.get<unknown>('/api/gstack/autoplan'),
  getShip: () => gstackRaw.get<unknown>('/api/gstack/ship'),
  getQA: () => gstackRaw.get<unknown>('/api/gstack/qa'),
  getDesign: () => gstackRaw.get<unknown>('/api/gstack/design'),
  getJobs: () => gstackRaw.get<unknown[]>('/api/gstack/jobs'),
};

// ─── Unified health check ────────────────────────────────────────────────────

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
    { name: 'BMAD', url: BMAD_URL, api: bmadApi },
    { name: 'PAUL', url: PAUL_URL, api: paulApi },
    { name: 'GStack', url: GSTACK_URL, api: gstackApi },
  ];

  const results = await Promise.allSettled(services.map((s) => s.api.health()));
  return services.map((s, i) => ({
    name: s.name,
    url: s.url,
    status: results[i].status === 'fulfilled' && results[i].value ? 'up' as const : 'down' as const,
  }));
}
