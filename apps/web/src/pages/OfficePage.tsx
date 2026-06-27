import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, ProgressBar } from '@vscp/ui';
import {
  Terminal, Ticket, Radio, Brain, Users, DollarSign,
  Clock, Activity, ArrowRight, Layers, CheckSquare, Zap,
  RefreshCw,
} from 'lucide-react';
import { paperclipApi, denchclawApi, gbrainApi, checkAllServices } from '../api/services';

// ─── Summary Card Component ──────────────────────────────────────────────────

function SummaryCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-4 text-left hover:border-border-hover transition-colors group"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
        <ArrowRight size={14} className="text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <p className="text-2xl font-bold font-display">{value}</p>
      <p className="text-xs text-fg-muted mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-fg-muted mt-1">{sub}</p>}
    </button>
  );
}

// ─── Service Status Row ──────────────────────────────────────────────────────

function ServiceStatusRow({ name, status }: { name: string; status: 'up' | 'down' | 'unreachable' }) {
  const colors = { up: 'bg-success', down: 'bg-error', unreachable: 'bg-warning' };
  const labels = { up: 'Online', down: 'Offline', unreachable: 'Unreachable' };
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-medium">{name}</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
        <span className="text-[10px] text-fg-muted">{labels[status]}</span>
      </div>
    </div>
  );
}

// ─── Office Page ─────────────────────────────────────────────────────────────

export function OfficePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Service health
  const { data: services } = useQuery({
    queryKey: ['services', 'health'],
    queryFn: checkAllServices,
    staleTime: 60_000,
  });

  // Demo data for summary cards (falls back when services are down)
  const { data: agents } = useQuery({
    queryKey: ['paperclip', 'agents'],
    queryFn: () => paperclipApi.getAgents('default'),
    retry: 0,
    staleTime: 30_000,
  });

  const { data: contacts } = useQuery({
    queryKey: ['denchclaw', 'contacts'],
    queryFn: () => denchclawApi.getContacts(),
    retry: 0,
    staleTime: 30_000,
  });

  const { data: pages } = useQuery({
    queryKey: ['gbrain', 'pages'],
    queryFn: () => gbrainApi.getPages(),
    retry: 0,
    staleTime: 30_000,
  });

  // Recent activity — derived from query cache state
  const recentActivity = React.useMemo(() => {
    const queries = queryClient.getQueryCache().getAll();
    return queries
      .filter((q) => q.state.dataUpdatedAt > 0)
      .sort((a, b) => b.state.dataUpdatedAt - a.state.dataUpdatedAt)
      .slice(0, 5)
      .map((q) => ({
        queryKey: q.queryKey.join(' / '),
        updatedAt: new Date(q.state.dataUpdatedAt),
        status: q.state.status,
      }));
  }, [queryClient, services, agents, contacts, pages]);

  const agentCount = Array.isArray(agents) ? agents.length : 4;
  // denchclaw returns { contacts: [...] }, gbrain returns { pages: [...] }
  const contactData = contacts as { contacts?: unknown[] } | undefined;
  const contactCount = contactData?.contacts?.length ?? 3;
  const pageData = pages as { pages?: unknown[] } | undefined;
  const brainCount = pageData?.pages?.length ?? 5;
  const onlineServices = services?.filter((s) => s.status === 'up').length ?? 0;
  const totalServices = services?.length ?? 7;

  return (
    <div className="p-6 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display">Office</h1>
          <p className="text-sm text-fg-muted mt-1">Your AI company at a glance</p>
        </div>
        <button
          onClick={() => navigate('/venture/new')}
          className="px-4 py-2 bg-primary text-fg-inverse text-sm font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Zap size={14} /> New Venture
        </button>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <SummaryCard
          icon={Terminal}
          label="Active Agents"
          value={agentCount}
          sub="3 online, 1 blocked"
          color="bg-primary-muted text-primary"
          onClick={() => navigate('/orchestrator')}
        />
        <SummaryCard
          icon={Ticket}
          label="Open Tickets"
          value={12}
          sub="3 high priority"
          color="bg-amber-muted text-amber"
          onClick={() => navigate('/tasks')}
        />
        <SummaryCard
          icon={Users}
          label="CRM Contacts"
          value={contactCount}
          sub="$195k pipeline"
          color="bg-success-muted text-success"
          onClick={() => navigate('/crm')}
        />
        <SummaryCard
          icon={Brain}
          label="Brain Pages"
          value={brainCount}
          sub="Last captured 2h ago"
          color="bg-accent-muted text-accent"
          onClick={() => navigate('/brain')}
        />
      </div>

      {/* Lower grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Active Missions */}
        <div className="col-span-4 bg-surface/70 backdrop-blur-md rounded-md border border-border">
          <div className="px-4 py-3 border-b border-border bg-elevated/60 flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Radio size={14} className="text-primary" /> Active Missions
            </h2>
            <button onClick={() => navigate('/conductor')} className="text-[10px] text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="p-3 space-y-2">
            {[
              { name: 'MVP Auth System', agents: 2, progress: 75, status: 'running' },
              { name: 'Market Research', agents: 1, progress: 45, status: 'running' },
              { name: 'Revenue Dashboard', agents: 1, progress: 100, status: 'complete' },
            ].map((m, i) => (
              <div key={i} className="p-3 rounded-md bg-hover/40 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium">{m.name}</span>
                  <Badge variant={m.status === 'complete' ? 'success' : 'info'}>{m.status}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <ProgressBar value={m.progress} className="flex-1 h-1.5" />
                  <span className="text-[10px] text-fg-muted font-mono">{m.progress}%</span>
                </div>
                <p className="text-[10px] text-fg-muted mt-1">{m.agents} agent{m.agents > 1 ? 's' : ''} assigned</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Brain Activity */}
        <div className="col-span-4 bg-surface/70 backdrop-blur-md rounded-md border border-border">
          <div className="px-4 py-3 border-b border-border bg-elevated/60 flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Brain size={14} className="text-accent" /> Recent Captures
            </h2>
            <button onClick={() => navigate('/brain')} className="text-[10px] text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="divide-y divide-border">
            {[
              { title: 'Pricing Decision: $49/mo Pro', type: 'decision', time: '2h ago' },
              { title: 'Auth Architecture Plan', type: 'plan', time: '5h ago' },
              { title: 'Security Audit: JWT', type: 'audit', time: '1d ago' },
              { title: 'Market TAM Assumption', type: 'assumption', time: '3d ago' },
            ].map((p, i) => (
              <div key={i} className="px-4 py-2.5 hover:bg-hover/30 cursor-pointer" onClick={() => navigate('/brain')}>
                <p className="text-xs font-medium">{p.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="neutral">{p.type}</Badge>
                  <span className="text-[10px] text-fg-muted">{p.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service Health */}
        <div className="col-span-4 bg-surface/70 backdrop-blur-md rounded-md border border-border">
          <div className="px-4 py-3 border-b border-border bg-elevated/60">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <Activity size={14} className="text-success" /> Services
              <Badge variant={onlineServices === totalServices ? 'success' : 'warning'}>
                {onlineServices}/{totalServices}
              </Badge>
            </h2>
          </div>
          <div className="px-4 py-2 divide-y divide-border">
            {(services ?? [
              { name: 'Paperclip', status: 'down' as const },
              { name: 'DenchClaw', status: 'down' as const },
              { name: 'HCOM', status: 'down' as const },
              { name: 'Gbrain', status: 'down' as const },
              { name: 'AEGIS', status: 'down' as const },
              { name: 'Plannotator', status: 'down' as const },
              { name: 'Skills', status: 'down' as const },
            ]).map((s) => (
              <ServiceStatusRow key={s.name} name={s.name} status={s.status} />
            ))}
          </div>
          {/* Quick Actions */}
          <div className="px-4 py-3 border-t border-border">
            <p className="text-[10px] text-fg-muted uppercase tracking-wider mb-2 font-semibold">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Canvas', path: '/canvas', icon: Layers },
                { label: 'Swarm', path: '/swarm', icon: Terminal },
                { label: 'Tasks', path: '/tasks', icon: CheckSquare },
                { label: 'Chat', path: '/chat', icon: Activity },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <button
                    key={a.path}
                    onClick={() => navigate(a.path)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm bg-hover/40 border border-border hover:border-border-hover text-xs text-fg-muted hover:text-fg transition-colors"
                  >
                    <Icon size={12} /> {a.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-surface/70 backdrop-blur-md rounded-md border border-border">
        <div className="px-4 py-3 border-b border-border bg-elevated/60 flex items-center justify-between">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <RefreshCw size={14} className="text-primary" /> Recent Activity
          </h2>
          <span className="text-[10px] text-fg-muted">Live from query cache</span>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.length > 0 ? (
            recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${a.status === 'success' ? 'bg-success' : a.status === 'error' ? 'bg-error' : 'bg-warning'}`} />
                  <span className="text-xs font-mono text-fg">{a.queryKey}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={a.status === 'success' ? 'success' : a.status === 'error' ? 'danger' : 'warning'}>
                    {a.status}
                  </Badge>
                  <span className="text-[10px] text-fg-muted">
                    {a.updatedAt.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-6 text-center text-xs text-fg-muted">
              No recent API activity
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
