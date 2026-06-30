import React from 'react';
import type { Card, Agent, AgentStatus } from '@aigency-os/shared-types';
import { Users } from 'lucide-react';

interface AgentStatusCardProps {
  card: Card;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}

const statusColors: Record<AgentStatus, string> = {
  active: 'bg-success',
  thinking: 'bg-primary',
  paused: 'bg-warning',
  blocked: 'bg-error',
  terminated: 'bg-fg-muted',
};

const statusTextColors: Record<AgentStatus, string> = {
  active: 'text-success',
  thinking: 'text-primary',
  paused: 'text-warning',
  blocked: 'text-error',
  terminated: 'text-fg-muted',
};

const DEFAULT_AGENTS: Agent[] = [
  { id: 'a1', name: 'Atlas', role: 'CEO', reportingTo: null, budgetLimit: 500, budgetSpent: 120, heartbeatSchedule: '4h', status: 'active', skills: [], adapter: 'claude' },
  { id: 'a2', name: 'Nova', role: 'CTO', reportingTo: 'a1', budgetLimit: 800, budgetSpent: 340, heartbeatSchedule: '4h', status: 'thinking', skills: [], adapter: 'hermes' },
  { id: 'a3', name: 'Echo', role: 'CMO', reportingTo: 'a1', budgetLimit: 400, budgetSpent: 90, heartbeatSchedule: '8h', status: 'active', skills: [], adapter: 'gemini' },
  { id: 'a4', name: 'Forge', role: 'Engineer', reportingTo: 'a2', budgetLimit: 600, budgetSpent: 510, heartbeatSchedule: 'continuous', status: 'blocked', skills: [], adapter: 'codex' },
  { id: 'a5', name: 'Lens', role: 'QA', reportingTo: 'a2', budgetLimit: 300, budgetSpent: 45, heartbeatSchedule: '8h', status: 'paused', skills: [], adapter: 'hermes' },
];

export const AgentStatusCard = React.memo(function AgentStatusCard({ card }: AgentStatusCardProps) {
  const rawContent = card.content as Record<string, unknown>;
  const title = typeof rawContent.title === 'string' ? rawContent.title : 'Agent Status';
  const agents = Array.isArray(rawContent.agents) ? rawContent.agents as Agent[] : DEFAULT_AGENTS;

  const activeCount = agents.filter((a) => a.status === 'active').length;

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Users size={14} className="text-primary" />
          <span className="text-xs font-semibold text-fg">{title}</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
          {activeCount}/{agents.length}
        </span>
      </div>

      {/* Agent grid */}
      <div className="space-y-2">
        {agents.map((agent) => {
          const budgetPct = agent.budgetLimit > 0 ? (agent.budgetSpent / agent.budgetLimit) * 100 : 0;
          const isOverBudget = budgetPct > 90;

          return (
            <div
              key={agent.id}
              className="flex items-center gap-2 p-1.5 rounded border border-border bg-hover/30"
            >
              {/* Status dot */}
              <div className={`w-2 h-2 rounded-full shrink-0 ${statusColors[agent.status]}`} />

              {/* Name + role */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-fg truncate">{agent.name}</span>
                  <span className="text-[9px] text-fg-muted">{agent.role}</span>
                </div>

                {/* Mini budget bar */}
                <div className="mt-1 h-1 w-full bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      isOverBudget ? 'bg-error' : budgetPct > 70 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${Math.min(budgetPct, 100)}%` }}
                  />
                </div>
              </div>

              {/* Status label */}
              <span className={`text-[9px] font-medium shrink-0 ${statusTextColors[agent.status]}`}>
                {agent.status}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
