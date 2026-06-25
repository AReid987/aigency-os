import React from 'react';
import type { Agent } from '@vscp/shared-types';
import { Avatar, Badge } from '@vscp/ui';

interface OrgChartProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
}

const statusColors = {
  active: 'bg-green-500',
  paused: 'bg-yellow-500',
  terminated: 'bg-red-500',
  thinking: 'bg-yellow-400',
  blocked: 'bg-red-400',
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
            relative flex flex-col items-center gap-2 p-4 rounded-md border bg-surface bg-elevated
            shadow-sm hover:shadow-md transition-shadow cursor-pointer min-w-[160px]
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
            <span className={`h-2 w-2 rounded-full ${statusColors[agent.status] ?? 'bg-gray-400'}`} />
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
              <div className="h-1.5 w-full rounded-full bg-border bg-hover">
                <div
                  className={`h-full rounded-full transition-all ${
                    budgetPercent >= 90 ? 'bg-red-500' : budgetPercent >= 70 ? 'bg-yellow-500' : 'bg-primary'
                  }`}
                  style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        {children.length > 0 && (
          <div className="relative mt-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-4 bg-gray-300" />
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
