import React from 'react';
import type { Agent } from '@vscp/shared-types';
import { Avatar, Badge } from '@vscp/ui';

interface OrgChartProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
}

const statusColors = {
  active: 'bg-primary',
  paused: 'bg-warning',
  terminated: 'bg-error',
  thinking: 'bg-warning',
  blocked: 'bg-error',
};

export function OrgChart({ agents, onAgentClick }: OrgChartProps) {
  // Build hierarchy tree
  const rootAgents = agents.filter((a) => !a.reportingTo);
  const childrenOf = (parentId: string) => agents.filter((a) => a.reportingTo === parentId);

  function renderNode(agent: Agent, depth: number = 0) {
    const children = childrenOf(agent.id);
    const budgetPercent = agent.budgetLimit > 0
      ? Math.round((agent.budgetSpent / agent.budgetLimit) * 100)
      : 0;

    return (
      <div key={agent.id} className="flex flex-col items-center">
        <div
          onClick={() => onAgentClick?.(agent)}
          className={`
            relative flex flex-col items-center gap-2 p-4 rounded-md border border-border bg-surface/70
            backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-border-hover
            transition-colors cursor-pointer min-w-[160px]
            ${agent.status === 'terminated' ? 'opacity-50' : ''}
          `}
        >
          <Avatar name={agent.name} status={agent.status as 'active' | 'thinking' | 'blocked' | 'idle'} size="lg" />
          <div className="text-center">
            <p className="font-semibold text-sm">{agent.name}</p>
            <p className="text-xs text-fg-muted">{agent.role}</p>
            <p className="text-xs text-fg-muted">{agent.adapter}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${statusColors[agent.status] ?? 'bg-fg-muted'}`} />
            <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'blocked' ? 'danger' : 'warning'}>
              {agent.status}
            </Badge>
          </div>
          {agent.budgetLimit > 0 && (
            <div className="w-full">
              <div className="flex justify-between text-xs text-fg-muted mb-1">
                <span>${agent.budgetSpent.toFixed(2)}</span>
                <span>${agent.budgetLimit.toFixed(2)}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-hover/60 backdrop-blur-sm">
                <div
                  className={`h-full rounded-full transition-all ${
                    budgetPercent >= 90 ? 'bg-error' : budgetPercent >= 70 ? 'bg-warning' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {children.length > 0 && (
          <div className="relative mt-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-border-hover" />
            <div className="flex gap-6 pt-4">
              {children.map((child) => renderNode(child, depth + 1))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-fg-muted">
        No agents hired yet. Click "Hire Agent" to get started.
      </div>
    );
  }

  return (
    <div className="overflow-auto p-6">
      <div className="flex gap-8 justify-center">
        {rootAgents.map((agent) => renderNode(agent))}
      </div>
    </div>
  );
}
