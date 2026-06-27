import React, { useState } from 'react';
import { Badge } from '@vscp/ui';
import { Radio, Plus, Play, CheckCircle, Clock, X, Loader } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paperclipApi } from '../api/services';

interface Mission {
  id: string;
  title: string;
  agentCount: number;
  progress: number;
  status: 'running' | 'complete' | 'failed';
  elapsed: string;
  costEstimate: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const DEMO_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'MVP Auth System',
    agentCount: 2,
    progress: 75,
    status: 'running',
    elapsed: '2h 14m',
    costEstimate: '$12.40',
    description: 'Implement JWT-based auth with role-based access control',
    priority: 'high',
  },
  {
    id: 'm2',
    title: 'Market Research Report',
    agentCount: 1,
    progress: 45,
    status: 'running',
    elapsed: '45m',
    costEstimate: '$4.20',
    description: 'Competitive analysis and market sizing for SaaS vertical',
    priority: 'medium',
  },
  {
    id: 'm3',
    title: 'Revenue Dashboard Build',
    agentCount: 1,
    progress: 100,
    status: 'complete',
    elapsed: '3h 2m',
    costEstimate: '$18.60',
    description: 'Build MRR/ARR tracking dashboard with Chart.js visualizations',
    priority: 'high',
  },
  {
    id: 'm4',
    title: 'Security Audit Sprint',
    agentCount: 3,
    progress: 30,
    status: 'running',
    elapsed: '1h 8m',
    costEstimate: '$8.90',
    description: 'Run OWASP checklist, dependency audit, and penetration testing',
    priority: 'critical',
  },
];

const statusConfig: Record<Mission['status'], { variant: 'info' | 'success' | 'danger'; icon: typeof Play; label: string }> = {
  running: { variant: 'info', icon: Loader, label: 'Running' },
  complete: { variant: 'success', icon: CheckCircle, label: 'Complete' },
  failed: { variant: 'danger', icon: X, label: 'Failed' },
};

const priorityColors: Record<Mission['priority'], string> = {
  low: 'bg-fg-muted/20 text-fg-muted',
  medium: 'bg-info/20 text-info',
  high: 'bg-warning/20 text-warning',
  critical: 'bg-error/20 text-error',
};

export function ConductorPage() {
  const queryClient = useQueryClient();
  const { data: goalsData } = useQuery({
    queryKey: ['paperclip', 'goals', 'default'],
    queryFn: () => paperclipApi.getGoals('default'),
    retry: 0,
    staleTime: 30_000,
  });

  const missions: Mission[] = Array.isArray(goalsData)
    ? (goalsData as Mission[]).map((g) => ({
        id: g.id ?? String(Math.random()),
        title: g.title ?? '',
        agentCount: g.agentCount ?? 1,
        progress: g.progress ?? 0,
        status: g.status ?? 'running',
        elapsed: g.elapsed ?? '0m',
        costEstimate: g.costEstimate ?? '$0.00',
        description: g.description ?? '',
        priority: g.priority ?? 'medium',
      }))
    : DEMO_MISSIONS;

  const [showModal, setShowModal] = useState(false);
  const [newMission, setNewMission] = useState({ description: '', priority: 'medium' as Mission['priority'] });

  const createGoalMutation = useMutation({
    mutationFn: (data: unknown) => paperclipApi.createGoal('default', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paperclip', 'goals', 'default'] });
    },
  });

  const handleCreateMission = () => {
    if (!newMission.description.trim()) return;
    createGoalMutation.mutate({
      title: newMission.description.slice(0, 40) + (newMission.description.length > 40 ? '...' : ''),
      description: newMission.description,
      priority: newMission.priority,
    });
    setNewMission({ description: '', priority: 'medium' });
    setShowModal(false);
  };

  const runningCount = missions.filter((m) => m.status === 'running').length;
  const totalAgents = missions.reduce((sum, m) => sum + (m.status === 'running' ? m.agentCount : 0), 0);
  const totalCost = missions.reduce((sum, m) => sum + parseFloat(m.costEstimate.replace('$', '')), 0);

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Radio size={20} className="text-primary" />
          <h1 className="text-xl font-bold">Conductor</h1>
          <Badge variant="info">{runningCount} active</Badge>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-fg-inverse font-medium text-sm hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} />
          New Mission
        </button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Running Missions', value: runningCount, icon: Play, color: 'text-info' },
          { label: 'Active Agents', value: totalAgents, icon: Loader, color: 'text-primary' },
          { label: 'Total Cost', value: `$${totalCost.toFixed(2)}`, icon: Clock, color: 'text-warning' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface/70 backdrop-blur-md rounded-md border border-border px-4 py-3 flex items-center gap-3">
            <stat.icon size={18} className={stat.color} />
            <div>
              <p className="text-xs text-fg-muted">{stat.label}</p>
              <p className="text-lg font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mission Grid */}
      <div className="grid grid-cols-2 gap-4">
        {missions.map((mission) => {
          const { variant, icon: StatusIcon, label } = statusConfig[mission.status];
          return (
            <div
              key={mission.id}
              className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-4 hover:border-border-hover transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-sm">{mission.title}</h3>
                  <p className="text-xs text-fg-muted mt-0.5">{mission.description}</p>
                </div>
                <Badge variant={variant}>
                  <span className="flex items-center gap-1">
                    <StatusIcon size={12} className={mission.status === 'running' ? 'animate-spin' : ''} />
                    {label}
                  </span>
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-fg-muted">Progress</span>
                  <span className="text-xs font-medium">{mission.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-hover/60 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      mission.status === 'complete' ? 'bg-success' : mission.status === 'failed' ? 'bg-error' : 'bg-primary'
                    }`}
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
              </div>

              {/* Meta Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-sm font-medium ${priorityColors[mission.priority]}`}>
                    {mission.priority}
                  </span>
                  <span className="text-xs text-fg-muted flex items-center gap-1">
                    <Radio size={12} />
                    {mission.agentCount} agent{mission.agentCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-fg-muted">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {mission.elapsed}
                  </span>
                  <span>{mission.costEstimate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Mission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-surface border border-border rounded-lg w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Play size={18} className="text-primary" />
                New Mission
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded hover:bg-hover/60 text-fg-muted">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Mission Description</label>
                <textarea
                  value={newMission.description}
                  onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                  className="w-full h-28 px-3 py-2 rounded-md bg-elevated border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Describe what the agents should accomplish..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewMission({ ...newMission, priority: p })}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors border ${
                        newMission.priority === p
                          ? `${priorityColors[p]} border-current`
                          : 'border-border hover:border-border-hover text-fg-secondary'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateMission}
                disabled={!newMission.description.trim()}
                className="w-full py-2.5 rounded-md bg-primary text-fg-inverse font-medium text-sm hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Launch Mission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
