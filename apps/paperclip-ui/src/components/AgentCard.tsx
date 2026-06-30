import React from 'react';
import type { Agent } from '@aigency-os/shared-types';
import { Avatar, Badge } from '@aigency-os/ui';

interface AgentCardProps {
  agent: Agent;
  onClick?: () => void;
  compact?: boolean;
}

export function AgentCard({ agent, onClick, compact = false }: AgentCardProps) {
  const budgetPercent = agent.budgetLimit > 0
    ? Math.round((agent.budgetSpent / agent.budgetLimit) * 100)
    : 0;

  if (compact) {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-3 p-2 rounded-md hover:bg-elevated/70 hover:backdrop-blur-sm cursor-pointer"
      >
        <Avatar name={agent.name} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{agent.name}</p>
          <p className="text-xs text-fg-muted">{agent.role}</p>
        </div>
        <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'blocked' ? 'danger' : 'warning'}>
          {agent.status}
        </Badge>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="p-4 rounded-md border border-border bg-surface/70 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] hover:border-border-hover transition-colors cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <Avatar name={agent.name} status={agent.status as 'active' | 'thinking' | 'blocked' | 'idle'} size="md" />
        <div className="flex-1">
          <h3 className="font-semibold">{agent.name}</h3>
          <p className="text-sm text-fg-muted">{agent.role} • {agent.adapter}</p>
        </div>
        <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'blocked' ? 'danger' : 'warning'}>
          {agent.status}
        </Badge>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-fg-muted mb-1">
          <span>Budget</span>
          <span>${agent.budgetSpent.toFixed(2)} / ${agent.budgetLimit.toFixed(2)} ({budgetPercent}%)</span>
        </div>
        <div className="h-2 w-full rounded-full bg-hover/60 backdrop-blur-sm">
          <div
            className={`h-full rounded-full transition-all ${
              budgetPercent >= 90 ? 'bg-error' : budgetPercent >= 70 ? 'bg-warning' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(budgetPercent, 100)}%` }}
          />
        </div>
      </div>
      <div className="mt-2 flex gap-2 text-xs text-fg-muted">
        <span>Heartbeat: {agent.heartbeatSchedule}</span>
        {agent.skills.length > 0 && <span>• {agent.skills.length} skills</span>}
      </div>
    </div>
  );
}
