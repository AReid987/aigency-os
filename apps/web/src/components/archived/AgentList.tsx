import React from 'react';
import type { HCOMAgent } from '@aigency-os/shared-types';
import { Badge } from '@aigency-os/ui';

interface AgentListProps {
  agents: HCOMAgent[];
  selectedAgentId?: string;
  onAgentSelect?: (agent: HCOMAgent) => void;
}

const statusDot: Record<string, string> = {
  active: 'bg-primary',
  thinking: 'bg-warning',
  blocked: 'bg-error',
  idle: 'bg-fg-muted',
  paused: 'bg-fg-muted',
  terminated: 'bg-error',
};

export function AgentList({ agents, selectedAgentId, onAgentSelect }: AgentListProps) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-elevated/70 backdrop-blur-sm">
            <th className="px-3 py-2 text-left font-medium">Name</th>
            <th className="px-3 py-2 text-left font-medium">Adapter</th>
            <th className="px-3 py-2 text-left font-medium">Status</th>
            <th className="px-3 py-2 text-left font-medium">Task</th>
            <th className="px-3 py-2 text-left font-medium">Session</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr
              key={agent.id}
              onClick={() => onAgentSelect?.(agent)}
              className={`
                cursor-pointer hover:bg-hover/60 transition-colors
                ${selectedAgentId === agent.id ? 'bg-primary-muted/70' : ''}
              `}
            >
              <td className="px-3 py-2 font-medium">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${statusDot[agent.status] ?? 'bg-fg-muted'}`} />
                {agent.name}
              </td>
              <td className="px-3 py-2 text-fg-muted">{agent.adapter}</td>
              <td className="px-3 py-2">
                <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'blocked' ? 'danger' : 'warning'}>
                  {agent.status}
                </Badge>
              </td>
              <td className="px-3 py-2 text-fg-muted truncate max-w-[200px]">
                {agent.activeTask ?? '—'}
              </td>
              <td className="px-3 py-2 text-fg-muted text-xs">{agent.sessionId}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {agents.length === 0 && (
        <div className="p-8 text-center text-fg-muted">
          No agents registered. Run <code>hcom {'<agent>'} --install-hooks</code> to add one.
        </div>
      )}
    </div>
  );
}
