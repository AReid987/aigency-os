import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge, ProgressBar } from '@vscp/ui';
import { Network, Users, DollarSign, Plus, Play, Pause, UserPlus } from 'lucide-react';
import { paperclipApi } from '../api/services';

type Tab = 'org' | 'agents' | 'budgets' | 'hire';

interface Agent {
  id: string;
  name: string;
  role: string;
  adapter: string;
  status: string;
  task?: string;
  budget?: { limit: number; spent: number };
  heartbeat?: string;
  reportsTo?: string | null;
}

const statusDot: Record<string, string> = { active: 'bg-primary', thinking: 'bg-warning', blocked: 'bg-error', paused: 'bg-fg-muted' };
const statusBadge: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = { active: 'success', thinking: 'warning', blocked: 'danger', paused: 'neutral' };

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-12">
      <p className="text-sm text-fg-muted">{message}</p>
    </div>
  );
}

// ─── Org Chart Tab ───────────────────────────────────────────────────────────

function OrgChartTab({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) return <EmptyState message="No agents deployed yet. Hire your first agent." />;

  const ceo = agents.find((a) => a.role === 'CEO');
  if (!ceo) return <EmptyState message="No CEO agent found." />;

  const reports = agents.filter((a) => a.reportsTo === ceo.id);

  const OrgNode = ({ agent, level = 0 }: { agent: Agent; level?: number }) => (
    <div className={level > 0 ? 'ml-8' : ''}>
      {level > 0 && <div className="w-px h-4 bg-border ml-[-16px] mb-1" />}
      <div className="flex items-center gap-3 p-3 rounded-md bg-hover/40 border border-border mb-2 w-fit min-w-[200px]">
        <div className="w-8 h-8 rounded-sm bg-primary-muted text-primary flex items-center justify-center text-xs font-bold">
          {agent.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs font-medium">{agent.name}</p>
          <p className="text-[10px] text-fg-muted">{agent.role} • {agent.adapter}</p>
        </div>
        <span className={`w-2 h-2 rounded-full ${statusDot[agent.status] || 'bg-fg-muted'}`} />
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <OrgNode agent={ceo} />
      {reports.map((r) => (
        <div key={r.id}>
          <div className="ml-8 w-px h-4 bg-border" />
          <div className="ml-8">
            <OrgNode agent={r} level={1} />
            {agents.filter((a) => a.reportsTo === r.id).map((e) => (
              <div key={e.id}>
                <div className="ml-8 w-px h-4 bg-border" />
                <OrgNode agent={e} level={2} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Agents Tab ──────────────────────────────────────────────────────────────

function AgentsTab({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) return <EmptyState message="No agents deployed yet." />;

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-elevated/70">
            <th className="px-4 py-2.5 text-left font-medium text-xs">Name</th>
            <th className="px-4 py-2.5 text-left font-medium text-xs">Role</th>
            <th className="px-4 py-2.5 text-left font-medium text-xs">Adapter</th>
            <th className="px-4 py-2.5 text-left font-medium text-xs">Status</th>
            <th className="px-4 py-2.5 text-left font-medium text-xs">Task</th>
            <th className="px-4 py-2.5 text-left font-medium text-xs">Budget</th>
            <th className="px-4 py-2.5 text-left font-medium text-xs">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => {
            const budget = agent.budget || { limit: 100, spent: 0 };
            const pct = Math.round((budget.spent / budget.limit) * 100);
            return (
              <tr key={agent.id} className="border-b border-border/50 hover:bg-hover/30">
                <td className="px-4 py-2.5 font-medium flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusDot[agent.status] || 'bg-fg-muted'}`} />
                  {agent.name}
                </td>
                <td className="px-4 py-2.5 text-fg-muted">{agent.role}</td>
                <td className="px-4 py-2.5"><Badge variant="neutral">{agent.adapter}</Badge></td>
                <td className="px-4 py-2.5"><Badge variant={statusBadge[agent.status] || 'neutral'}>{agent.status}</Badge></td>
                <td className="px-4 py-2.5 text-fg-muted truncate max-w-[120px]">{agent.task || '—'}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-hover">
                      <div className={`h-full rounded-full ${pct >= 80 ? 'bg-error' : pct >= 60 ? 'bg-warning' : 'bg-primary'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="text-[10px] text-fg-muted font-mono">{pct}%</span>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-hover/60 text-fg-muted hover:text-fg"><Play size={12} /></button>
                    <button className="p-1 rounded hover:bg-hover/60 text-fg-muted hover:text-fg"><Pause size={12} /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Budgets Tab ─────────────────────────────────────────────────────────────

function BudgetsTab({ agents }: { agents: Agent[] }) {
  const totalLimit = agents.reduce((s, a) => s + (a.budget?.limit || 0), 0);
  const totalSpent = agents.reduce((s, a) => s + (a.budget?.spent || 0), 0);
  const totalPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

  if (agents.length === 0) return <EmptyState message="No agents to track budgets for." />;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-elevated/70 rounded-md border border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Total Budget</span>
          <span className="text-sm font-mono">${totalSpent.toFixed(0)} / ${totalLimit.toFixed(0)}</span>
        </div>
        <ProgressBar value={totalPct} className="h-2" />
      </div>
      <div className="space-y-3">
        {agents.map((agent) => {
          const budget = agent.budget || { limit: 100, spent: 0 };
          const pct = Math.round((budget.spent / budget.limit) * 100);
          return (
            <div key={agent.id} className="bg-hover/40 border border-border rounded-md p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusDot[agent.status] || 'bg-fg-muted'}`} />
                  <span className="text-xs font-medium">{agent.name}</span>
                  <Badge variant="neutral">{agent.role}</Badge>
                </div>
                <span className="text-xs font-mono text-fg-muted">${budget.spent.toFixed(0)} / ${budget.limit.toFixed(0)}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-hover">
                <div className={`h-full rounded-full ${pct >= 100 ? 'bg-error' : pct >= 80 ? 'bg-warning' : 'bg-primary'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Hire Tab ────────────────────────────────────────────────────────────────

function HireTab({ agents }: { agents: Agent[] }) {
  const [form, setForm] = useState({ name: '', role: 'Engineer', adapter: 'claude', budgetLimit: '100', reportsTo: '', heartbeat: '8h' });

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-lg font-bold mb-4">Hire New Agent</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5">Agent Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., engineer-3" className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none">
              {['CEO', 'CTO', 'CMO', 'Sales', 'Engineer', 'QA', 'Designer', 'Content'].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Adapter</label>
            <select value={form.adapter} onChange={(e) => setForm({ ...form, adapter: e.target.value })} className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none">
              {['hermes', 'claude', 'codex', 'kimi', 'qwen', 'gemini', 'cursor', 'copilot'].map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Budget Limit ($)</label>
            <input type="number" value={form.budgetLimit} onChange={(e) => setForm({ ...form, budgetLimit: e.target.value })} className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none font-mono" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Heartbeat</label>
            <select value={form.heartbeat} onChange={(e) => setForm({ ...form, heartbeat: e.target.value })} className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none">
              {['4h', '8h', '12h', '24h'].map((h) => <option key={h} value={h}>Every {h}</option>)}
            </select>
          </div>
        </div>
        {agents.length > 0 && (
          <div>
            <label className="block text-xs font-medium mb-1.5">Reports To</label>
            <select value={form.reportsTo} onChange={(e) => setForm({ ...form, reportsTo: e.target.value })} className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none">
              <option value="">None (top level)</option>
              {agents.map((a) => <option key={a.id} value={a.id}>{a.name} ({a.role})</option>)}
            </select>
          </div>
        )}
        <button className="px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2">
          <UserPlus size={16} /> Hire Agent
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function OrchestratorPage() {
  const [tab, setTab] = useState<Tab>('org');

  const { data: agentsData } = useQuery({
    queryKey: ['paperclip', 'agents', 'default'],
    queryFn: () => paperclipApi.getAgents('default'),
    retry: 0,
    staleTime: 30_000,
  });

  const agents: Agent[] = Array.isArray(agentsData) ? agentsData as Agent[] : [];

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'org', label: 'Org Chart', icon: Network },
    { key: 'agents', label: 'Agents', icon: Users },
    { key: 'budgets', label: 'Budgets', icon: DollarSign },
    { key: 'hire', label: 'Hire', icon: Plus },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-3">
          <Network size={20} className="text-primary" />
          <h1 className="text-xl font-bold font-display">Orchestrator</h1>
          <Badge variant="info">{agents.length} agents</Badge>
        </div>
      </div>
      <div className="px-6 pt-4 flex gap-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${tab === t.key ? 'bg-elevated/70 text-fg' : 'text-fg-muted hover:bg-hover/60'}`}>
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="bg-surface/70 backdrop-blur-md mx-6 mt-4 mb-6 rounded-md border border-border overflow-hidden">
          {tab === 'org' && <OrgChartTab agents={agents} />}
          {tab === 'agents' && <AgentsTab agents={agents} />}
          {tab === 'budgets' && <BudgetsTab agents={agents} />}
          {tab === 'hire' && <HireTab agents={agents} />}
        </div>
      </div>
    </div>
  );
}
