import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge, ProgressBar } from '@aigency-os/ui';
import {
  Network, Users, DollarSign, Plus, Play, Pause, UserPlus,
  ChevronDown, Cpu, Zap, Terminal,
} from 'lucide-react';
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

// ─── CLI Providers ───────────────────────────────────────────────────────────

const CLI_PROVIDERS = [
  { id: 'hermes', name: 'Hermes Agent', desc: 'Nous Research — general purpose', icon: '🧠' },
  { id: 'claude', name: 'Claude Code', desc: 'Anthropic — reasoning + code', icon: '🔮' },
  { id: 'codex', name: 'OpenAI Codex', desc: 'OpenAI — code generation', icon: '⚡' },
  { id: 'opencode', name: 'OpenCode', desc: 'Go-based coding agent', icon: '🔓' },
  { id: 'mimo', name: 'Mimo Code', desc: 'MiniMax coding agent', icon: '🎯' },
  { id: 'gemini', name: 'Gemini CLI', desc: 'Google — multimodal agent', icon: '💎' },
  { id: 'antigravity', name: 'Antigravity CLI', desc: 'Zero-gravity coding', icon: '🚀' },
  { id: 'kimi', name: 'Kimi', desc: 'Moonshot — long context', icon: '🌙' },
  { id: 'qwen', name: 'Qwen Coder', desc: 'Alibaba — code specialist', icon: '🏗️' },
  { id: 'cursor', name: 'Cursor', desc: 'AI-native editor agent', icon: '✏️' },
  { id: 'copilot', name: 'GitHub Copilot', desc: 'GitHub — pair programming', icon: '🐙' },
  { id: 'blackbox', name: 'Blackbox AI', desc: 'Code generation + search', icon: '📦' },
];

const statusDot: Record<string, string> = { active: 'bg-primary', thinking: 'bg-warning', blocked: 'bg-error', paused: 'bg-fg-muted' };
const statusBadge: Record<string, 'success' | 'warning' | 'danger' | 'neutral'> = { active: 'success', thinking: 'warning', blocked: 'danger', paused: 'neutral' };

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <Network size={32} className="text-fg-muted mb-3 opacity-50" />
      <p className="text-sm text-fg-muted">{message}</p>
    </div>
  );
}

// ─── Org Chart with SVG Tree ─────────────────────────────────────────────────

function OrgChartTab({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) return <EmptyState message="No agents deployed yet. Hire your first agent to build the org chart." />;

  const ceo = agents.find((a) => a.role === 'CEO');
  if (!ceo) {
    // Show all agents as a flat list if no CEO
    return (
      <div className="p-6">
        <div className="flex flex-wrap gap-3">
          {agents.map((agent) => (
            <AgentNode key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    );
  }

  const reports = agents.filter((a) => a.reportsTo === ceo.id);

  return (
    <div className="p-6 overflow-auto">
      <div className="flex flex-col items-center">
        {/* CEO at top */}
        <AgentNode agent={ceo} isCeo />

        {/* Connecting line down */}
        {reports.length > 0 && <div className="w-px h-6 bg-border" />}

        {/* Branching edges to reports */}
        {reports.length > 0 && (
          <div className="relative">
            {/* Horizontal connector */}
            <div className="absolute top-0 left-0 right-0 h-px bg-border" style={{ left: '100px', right: '100px' }} />
            <div className="flex gap-6">
              {reports.map((report) => {
                const subReports = agents.filter((a) => a.reportsTo === report.id);
                return (
                  <div key={report.id} className="flex flex-col items-center">
                    <div className="w-px h-6 bg-border" />
                    <AgentNode agent={report} />
                    {subReports.length > 0 && (
                      <>
                        <div className="w-px h-6 bg-border" />
                        <div className="flex gap-4">
                          {subReports.map((sub) => (
                            <div key={sub.id} className="flex flex-col items-center">
                              <div className="w-px h-6 bg-border" />
                              <AgentNode agent={sub} small />
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentNode({ agent, isCeo, small }: { agent: Agent; isCeo?: boolean; small?: boolean }) {
  const provider = CLI_PROVIDERS.find((p) => p.id === agent.adapter);
  return (
    <div className={`flex items-center gap-3 p-3 rounded-md bg-hover/40 border border-border ${isCeo ? 'border-primary/40 bg-primary-muted/20' : ''} ${small ? 'min-w-[160px]' : 'min-w-[200px]'}`}>
      <div className={`rounded-sm bg-primary-muted text-primary flex items-center justify-center font-bold ${small ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'}`}>
        {provider?.icon || agent.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className={`font-medium ${small ? 'text-[11px]' : 'text-xs'}`}>{agent.name}</p>
          <span className={`w-2 h-2 rounded-full ${statusDot[agent.status] || 'bg-fg-muted'}`} />
        </div>
        <p className="text-[10px] text-fg-muted">{agent.role} • {provider?.name || agent.adapter}</p>
        {agent.task && <p className="text-[10px] text-fg-muted truncate mt-0.5">Task: {agent.task}</p>}
      </div>
    </div>
  );
}

// ─── Agents Table Tab ────────────────────────────────────────────────────────

function AgentsTab({ agents }: { agents: Agent[] }) {
  if (agents.length === 0) return <EmptyState message="No agents deployed yet." />;

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-elevated/70">
            <th className="px-4 py-2.5 text-left font-medium text-xs">Name</th>
            <th className="px-4 py-2.5 text-left font-medium text-xs">Role</th>
            <th className="px-4 py-2.5 text-left font-medium text-xs">CLI Provider</th>
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
            const provider = CLI_PROVIDERS.find((p) => p.id === agent.adapter);
            return (
              <tr key={agent.id} className="border-b border-border/50 hover:bg-hover/30">
                <td className="px-4 py-2.5 font-medium flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${statusDot[agent.status] || 'bg-fg-muted'}`} />
                  {agent.name}
                </td>
                <td className="px-4 py-2.5 text-fg-muted">{agent.role}</td>
                <td className="px-4 py-2.5">
                  <Badge variant="neutral">{provider?.name || agent.adapter}</Badge>
                </td>
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
  if (agents.length === 0) return <EmptyState message="No agents to track budgets for." />;

  const totalLimit = agents.reduce((s, a) => s + (a.budget?.limit || 0), 0);
  const totalSpent = agents.reduce((s, a) => s + (a.budget?.spent || 0), 0);
  const totalPct = totalLimit > 0 ? Math.round((totalSpent / totalLimit) * 100) : 0;

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

// ─── Hire Tab with CLI Provider Selection ────────────────────────────────────

function HireTab({ agents }: { agents: Agent[] }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: '', role: 'Engineer', adapter: 'hermes', budgetLimit: '100', reportsTo: '', heartbeat: '8h',
  });
  const [showProviders, setShowProviders] = useState(false);

  const hireMutation = useMutation({
    mutationFn: (data: unknown) => paperclipApi.createAgent('default', data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['paperclip', 'agents'] }),
  });

  const selectedProvider = CLI_PROVIDERS.find((p) => p.id === form.adapter);

  const handleHire = () => {
    hireMutation.mutate({
      name: form.name,
      role: form.role,
      adapter: form.adapter,
      budget: Number(form.budgetLimit),
      reportsTo: form.reportsTo || undefined,
      heartbeatSchedule: form.heartbeat,
    });
    setForm({ ...form, name: '' });
  };

  return (
    <div className="p-6 max-w-xl">
      <h2 className="text-lg font-bold mb-4">Hire New Agent</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium mb-1.5">Agent Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., atlas-cto" className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none">
              {['CEO', 'CTO', 'CMO', 'Sales', 'Engineer', 'QA', 'Designer', 'Content'].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5">Heartbeat</label>
            <select value={form.heartbeat} onChange={(e) => setForm({ ...form, heartbeat: e.target.value })} className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none">
              {['4h', '8h', '12h', '24h'].map((h) => <option key={h} value={h}>Every {h}</option>)}
            </select>
          </div>
        </div>

        {/* CLI Provider Selector */}
        <div>
          <label className="block text-xs font-medium mb-1.5">CLI Provider</label>
          <button
            onClick={() => setShowProviders(!showProviders)}
            className="w-full flex items-center justify-between px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm hover:border-border-hover transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>{selectedProvider?.icon}</span>
              <span>{selectedProvider?.name || form.adapter}</span>
              <span className="text-[10px] text-fg-muted">— {selectedProvider?.desc}</span>
            </div>
            <ChevronDown size={14} className={`text-fg-muted transition-transform ${showProviders ? 'rotate-180' : ''}`} />
          </button>

          {showProviders && (
            <div className="mt-1 bg-elevated/90 border border-border rounded-md overflow-hidden max-h-60 overflow-y-auto">
              {CLI_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setForm({ ...form, adapter: p.id }); setShowProviders(false); }}
                  className={`w-full text-left px-3 py-2 text-xs hover:bg-hover/60 transition-colors flex items-center gap-2 ${form.adapter === p.id ? 'bg-primary-muted/30 text-primary' : 'text-fg-secondary'}`}
                >
                  <span className="text-base">{p.icon}</span>
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-[10px] text-fg-muted">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Budget Limit ($)</label>
            <input type="number" value={form.budgetLimit} onChange={(e) => setForm({ ...form, budgetLimit: e.target.value })} className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none font-mono" />
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
        </div>

        <button
          onClick={handleHire}
          disabled={!form.name.trim() || hireMutation.isPending}
          className="px-6 py-2.5 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <UserPlus size={16} /> {hireMutation.isPending ? 'Hiring...' : 'Hire Agent'}
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
    { key: 'hire', label: 'Hire', icon: UserPlus },
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
