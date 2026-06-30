// ─── Service API Clients ─────────────────────────────────────────────────────
// Dual-mode: supports both microservices (dev) and unified monolith (prod).
// Set VITE_UNIFIED_MODE=true for unified deployment (single backend).
// All pages import from this file — no code changes needed across modes.

import { createAPIClient } from '@aigency-os/api-client';

// ─── Mode Detection ──────────────────────────────────────────────────────────

const isUnified = import.meta.env.VITE_UNIFIED_MODE === 'true' || import.meta.env.VITE_UNIFIED_MODE === '1';

// ─── Base URLs ───────────────────────────────────────────────────────────────
// In unified mode, all services share the same origin.
// In microservices mode, each service has its own port.

const PAPERCLIP_URL = isUnified
  ? (import.meta.env.VITE_API_URL || window.location.origin)
  : (import.meta.env.VITE_PAPERCLIP_URL || 'http://localhost:3001');

const DENCHCLAW_URL = isUnified ? PAPERCLIP_URL : (import.meta.env.VITE_DENCHCLAW_URL || 'http://localhost:3015');
const HCOM_URL = isUnified ? PAPERCLIP_URL : (import.meta.env.VITE_HCOM_URL || 'http://localhost:3006');
const GBRAIN_URL = isUnified ? PAPERCLIP_URL : (import.meta.env.VITE_GBRAIN_URL || 'http://localhost:3005');
const AEGIS_URL = isUnified ? PAPERCLIP_URL : (import.meta.env.VITE_AEGIS_URL || 'http://localhost:3007');
const PLANNOTATOR_URL = isUnified ? PAPERCLIP_URL : (import.meta.env.VITE_PLANNOTATOR_URL || 'http://localhost:3008');
const SKILLS_URL = isUnified ? PAPERCLIP_URL : (import.meta.env.VITE_SKILLS_URL || 'http://localhost:3010');
const BMAD_URL = isUnified ? PAPERCLIP_URL : (import.meta.env.VITE_BMAD_URL || 'http://localhost:3010');
const PAUL_URL = isUnified ? PAPERCLIP_URL : (import.meta.env.VITE_PAUL_URL || 'http://localhost:3011');
const GSTACK_URL = isUnified ? PAPERCLIP_URL : (import.meta.env.VITE_GSTACK_URL || 'http://localhost:3012');

// ─── Path Prefix Helpers ─────────────────────────────────────────────────────
// In unified mode, prepend the service prefix to routes.

const p = (_service: string, path: string) => path;

// ─── Raw API Clients ─────────────────────────────────────────────────────────

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

// ─── Health Check Helper ─────────────────────────────────────────────────────

async function checkHealth(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}

// ─── Paperclip API (Core) ────────────────────────────────────────────────────

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

// ─── DenchClaw CRM API ─────────────────────────────────────────────────────────

export const denchclawApi = {
  health: () => checkHealth(DENCHCLAW_URL),

  getContacts: () => denchclawRaw.get<{ contacts: unknown[] }>(p('denchclaw', '/contacts')),
  getContact: (id: string) => denchclawRaw.get<unknown>(p('denchclaw', `/contacts/${id}`)),
  createContact: (data: unknown) => denchclawRaw.post<unknown>(p('denchclaw', '/contacts'), data),
  updateContact: (id: string, data: unknown) => denchclawRaw.put<unknown>(p('denchclaw', `/contacts/${id}`), data),
  deleteContact: (id: string) => denchclawRaw.delete<unknown>(p('denchclaw', `/contacts/${id}`)),

  getDeals: () => denchclawRaw.get<{ deals: unknown[] }>(p('denchclaw', '/deals')),
  getDeal: (id: string) => denchclawRaw.get<unknown>(p('denchclaw', `/deals/${id}`)),
  createDeal: (data: unknown) => denchclawRaw.post<unknown>(p('denchclaw', '/deals'), data),
  updateDealStage: (id: string, stage: string) =>
    denchclawRaw.patch<unknown>(p('denchclaw', `/deals/${id}/stage`), { stage }),
  deleteDeal: (id: string) => denchclawRaw.delete<unknown>(p('denchclaw', `/deals/${id}`)),

  getPipeline: () => denchclawRaw.get<{ pipeline: unknown[] }>(p('denchclaw', '/pipeline')),
  getSequences: () => denchclawRaw.get<unknown[]>(p('denchclaw', '/sequences')),
  createSequence: (data: unknown) => denchclawRaw.post<unknown>(p('denchclaw', '/sequences'), data),
  getLeads: () => denchclawRaw.get<unknown[]>(p('denchclaw', '/leads')),
  createLead: (data: unknown) => denchclawRaw.post<unknown>(p('denchclaw', '/leads'), data),
};

// ─── HCOM API ────────────────────────────────────────────────────────────────

export const hcomApi = {
  health: () => checkHealth(HCOM_URL),

  getAgents: () => hcomRaw.get<unknown[]>(p('hcom', '/agents')),
  getAgent: (id: string) => hcomRaw.get<unknown>(p('hcom', `/agents/${id}`)),
  createAgent: (data: unknown) => hcomRaw.post<unknown>(p('hcom', '/agents'), data),
  getAgentStatus: (id: string) => hcomRaw.get<unknown>(p('hcom', `/agents/${id}/status`)),

  getMessages: (agentId: string) => hcomRaw.get<unknown[]>(p('hcom', `/agents/${agentId}/messages`)),
  sendMessage: (agentId: string, data: unknown) =>
    hcomRaw.post<unknown>(p('hcom', `/agents/${agentId}/message`), data),
  getInbox: (agentId: string) => hcomRaw.get<unknown[]>(p('hcom', `/agents/${agentId}/inbox`)),

  getCollisions: () => hcomRaw.get<unknown[]>(p('hcom', '/collisions')),
  getDashboard: () => hcomRaw.get<unknown>(p('hcom', '/dashboard')),
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
    return gbrainRaw.get<{ pages: unknown[] }>(p('gbrain', `/pages${query ? `?${query}` : ''}`));
  },
  getPage: (id: string) => gbrainRaw.get<unknown>(p('gbrain', `/pages/${id}`)),
  createPage: (data: unknown) => gbrainRaw.post<unknown>(p('gbrain', '/pages'), data),

  search: (query: string, role?: string) => {
    const qs = new URLSearchParams({ q: query });
    if (role) qs.set('role', role);
    return gbrainRaw.get<{ results: unknown[]; count: number }>(p('gbrain', `/query?${qs}`));
  },

  getGraph: () => gbrainRaw.get<{ nodes: unknown[]; edges: unknown[] }>(p('gbrain', '/graph')),
};

// ─── AEGIS API ───────────────────────────────────────────────────────────────

export const aegisApi = {
  health: () => checkHealth(AEGIS_URL),

  getAudits: () => aegisRaw.get<unknown[]>(p('aegis', '/audit')),
  getAudit: (id: string) => aegisRaw.get<unknown>(p('aegis', `/audit/${id}`)),
  triggerAudit: (data: unknown) => aegisRaw.post<unknown>(p('aegis', '/audit'), data),
  getDomains: () => aegisRaw.get<unknown[]>(p('aegis', '/domains')),
};

// ─── Plannotator API ─────────────────────────────────────────────────────────

export const plannotatorApi = {
  health: () => checkHealth(PLANNOTATOR_URL),

  getPlans: (source?: string) => {
    const qs = source ? `?source=${source}` : '';
    return plannotatorRaw.get<{ plans: unknown[] }>(p('plannotator', `/plans${qs}`));
  },
  getPlan: (id: string, role?: string) => {
    const qs = role ? `?role=${role}` : '';
    return plannotatorRaw.get<unknown>(p('plannotator', `/plans/${id}${qs}`));
  },
  approvePlan: (id: string) => plannotatorRaw.post<unknown>(p('plannotator', `/plans/${id}/approve`), {}),
  rejectPlan: (id: string) => plannotatorRaw.post<unknown>(p('plannotator', `/plans/${id}/reject`), {}),
  addAnnotation: (planId: string, data: unknown) =>
    plannotatorRaw.post<unknown>(p('plannotator', `/plans/${planId}/annotations`), data),
};

// ─── Skills API ───────────────────────────────────────────────────────────────

export const skillsApi = {
  health: () => checkHealth(SKILLS_URL),

  getSkills: () => skillsRaw.get<unknown[]>(p('skills', '/skills')),
  getSkill: (id: string) => skillsRaw.get<unknown>(p('skills', `/skills/${id}`)),
  installSkill: (id: string) => skillsRaw.post<unknown>(p('skills', `/skills/${id}/install`), {}),
};

// ─── BMAD API ─────────────────────────────────────────────────────────────────

export const bmadApi = {
  health: () => checkHealth(BMAD_URL),

  getCanvas: () => bmadRaw.get<unknown>(p('bmad', '/canvas')),
  getRevenue: () => bmadRaw.get<unknown>(p('bmad', '/revenue')),
  getMilestones: () => bmadRaw.get<unknown[]>(p('bmad', '/milestones')),
  getCompetitive: () => bmadRaw.get<unknown>(p('bmad', '/competitive')),
};

// ─── PAUL API ─────────────────────────────────────────────────────────────────

export const paulApi = {
  health: () => checkHealth(PAUL_URL),

  getPlans: () => paulRaw.get<unknown[]>(p('paul', '/plans')),
  applyPlan: (data: unknown) => paulRaw.post<unknown>(p('paul', '/apply'), data),
  unify: (data: unknown) => paulRaw.post<unknown>(p('paul', '/unify'), data),
  getCriteria: () => paulRaw.get<unknown[]>(p('paul', '/criteria')),
};

// ─── GStack API ─────────────────────────────────────────────────────────────────

export const gstackApi = {
  health: () => checkHealth(GSTACK_URL),

  getAutoplan: () => gstackRaw.get<unknown>(p('gstack', '/autoplan')),
  getShip: () => gstackRaw.get<unknown>(p('gstack', '/ship')),
  getQA: () => gstackRaw.get<unknown>(p('gstack', '/qa')),
  getDesign: () => gstackRaw.get<unknown>(p('gstack', '/design')),
  getJobs: () => gstackRaw.get<unknown[]>(p('gstack', '/jobs')),
};

// ─── Unified Health Check ───────────────────────────────────────────────────

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
