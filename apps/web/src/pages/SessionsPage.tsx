import { useState, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@aigency-os/ui';
import { Bot, Clock, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { hcomApi } from '../api/services';

interface Session {
  id: number;
  agent: string;
  startTime: string;
  duration: string;
  task: string;
  status: 'active' | 'complete' | 'failed';
  tokens: string;
  transcript: string[];
}

const statusVariant: Record<string, 'success' | 'info' | 'danger'> = {
  active: 'info',
  complete: 'success',
  failed: 'danger',
};

export function SessionsPage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  // Fetch agents from HCOM API
  const { data: agentsData } = useQuery({
    queryKey: ['hcom', 'agents'],
    queryFn: () => hcomApi.getAgents().then((r) => r as unknown[]),
    staleTime: 30_000,
  });

  // Map API agents to sessions
  const sessions: Session[] = agentsData && agentsData.length > 0
    ? (agentsData as Record<string, unknown>[]).map((agent, i) => ({
        id: Number(agent.id ?? i),
        agent: String(agent.name ?? `Agent ${i + 1}`),
        startTime: agent.lastSeen ? String(agent.lastSeen) : '—',
        duration: agent.duration ? String(agent.duration) : '—',
        task: String(agent.currentTask ?? agent.status ?? '—'),
        status: (agent.status === 'active' ? 'active' : agent.status === 'error' ? 'failed' : 'complete') as 'active' | 'complete' | 'failed',
        tokens: agent.tokens ? String(agent.tokens) : '—',
        transcript: Array.isArray(agent.transcript) ? (agent.transcript as string[]) : [],
      }))
    : [];

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-surface/70 backdrop-blur-md rounded-md border border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-fg" />
          <h2 className="text-lg font-semibold text-fg">Agent Sessions</h2>
        </div>
        <Badge variant="info">{sessions.filter((s) => s.status === 'active').length} active</Badge>
      </div>

      {/* Table */}
      <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-elevated/60 text-fg-muted text-left">
              <th className="px-4 py-2.5 font-medium">Agent</th>
              <th className="px-4 py-2.5 font-medium">Start Time</th>
              <th className="px-4 py-2.5 font-medium">Duration</th>
              <th className="px-4 py-2.5 font-medium">Task</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Tokens</th>
              <th className="px-4 py-2.5 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sessions.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-fg-muted">No sessions recorded</td>
              </tr>
            )}
            {sessions.map((session) => (
              <Fragment key={session.id}>
                <tr
                  className="hover:bg-elevated/30 cursor-pointer transition-colors"
                  onClick={() => setExpanded(expanded === session.id ? null : session.id)}
                >
                  <td className="px-4 py-2.5 text-fg font-medium capitalize">{session.agent}</td>
                  <td className="px-4 py-2.5 text-fg-muted">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {session.startTime}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-fg-muted">{session.duration}</td>
                  <td className="px-4 py-2.5 text-fg">{session.task}</td>
                  <td className="px-4 py-2.5">
                    <Badge variant={statusVariant[session.status]}>{session.status}</Badge>
                  </td>
                  <td className="px-4 py-2.5 text-fg-muted">
                    <span className="flex items-center gap-1">
                      <Zap size={12} />
                      {session.tokens}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-fg-muted">
                    {expanded === session.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </td>
                </tr>
                {expanded === session.id && (
                  <tr key={`${session.id}-detail`}>
                    <td colSpan={7} className="px-4 py-3 bg-elevated/30">
                      <div className="font-mono text-xs space-y-1 text-fg-muted">
                        {session.transcript.length > 0 ? session.transcript.map((line, i) => (
                          <div key={i}>{line}</div>
                        )) : <div>No transcript available.</div>}
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
