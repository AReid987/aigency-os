import React from 'react';
import type { HCOMAgent } from '@vscp/shared-types';
import { Badge } from '@vscp/ui';

interface AgentListProps {
  agents: HCOMAgent[];
  selectedAgentId?: string;
  onAgentSelect?: (agent: HCOMAgent) => void;
}

const statusIcons: Record<string, string> = {
  active: '🟢',
  thinking: '🟡',
  blocked: '🔴',
  idle: '⚪',
  paused: '⏸️',
  terminated: '💀',
};

export function AgentList({ agents, selectedAgentId, onAgentSelect }: AgentListProps) {
  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50 dark:bg-gray-800">
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
                cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors
                ${selectedAgentId === agent.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
              `}
            >
              <td className="px-3 py-2 font-medium">
                {statusIcons[agent.status] ?? '⚪'} {agent.name}
              </td>
              <td className="px-3 py-2 text-gray-500">{agent.adapter}</td>
              <td className="px-3 py-2">
                <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'blocked' ? 'danger' : 'warning'}>
                  {agent.status}
                </Badge>
              </td>
              <td className="px-3 py-2 text-gray-500 truncate max-w-[200px]">
                {agent.activeTask ?? '—'}
              </td>
              <td className="px-3 py-2 text-gray-400 text-xs">{agent.sessionId}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {agents.length === 0 && (
        <div className="p-8 text-center text-gray-400">
          No agents registered. Run <code>hcom {'<agent>'} --install-hooks</code> to add one.
        </div>
      )}
    </div>
  );
}
