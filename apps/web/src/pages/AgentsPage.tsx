import React from 'react';
import { Badge } from '@aigency-os/ui';
import { Terminal, MessageSquare, Shield, Zap, Pause, Play } from 'lucide-react';

const DEMO_AGENTS = [
  { id: '1', name: 'hermes', adapter: 'hermes', status: 'active', activeTask: 'Architecture', sessionId: 'tmux:0', budget: { limit: 60, spent: 12 } },
  { id: '2', name: 'claude', adapter: 'claude', status: 'active', activeTask: 'API dev', sessionId: 'tmux:1', budget: { limit: 50, spent: 8 } },
  { id: '3', name: 'kimi', adapter: 'kimi', status: 'thinking', activeTask: 'UI dev', sessionId: 'tmux:2', budget: { limit: 30, spent: 15 } },
  { id: '4', name: 'qwen', adapter: 'codex', status: 'blocked', activeTask: 'Waiting for spec', sessionId: 'tmux:3', budget: { limit: 20, spent: 18 } },
];

const DEMO_MESSAGES = [
  { id: '1', from: 'hermes', to: 'claude', content: 'Design the auth middleware', intent: 'task', time: '2m ago' },
  { id: '2', from: 'claude', to: 'hermes', content: 'Auth middleware done. JWT-based, 15min expiry.', intent: 'status', time: '1m ago' },
  { id: '3', from: 'kimi', to: 'claude', content: 'UI components ready. Need API endpoint for /login', intent: 'request', time: '30s ago' },
];

const statusDot: Record<string, string> = { active: 'bg-primary', thinking: 'bg-warning', blocked: 'bg-error', paused: 'bg-fg-muted' };

export function AgentsPage() {
  return (
    <div className="p-6 h-full overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Terminal size={20} className="text-primary" />
          <h1 className="text-xl font-bold">Agent Monitor</h1>
          <Badge variant="info">{DEMO_AGENTS.length} agents</Badge>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm rounded-md bg-primary text-fg-inverse hover:bg-primary-dark">
            <Zap size={14} className="inline mr-1" /> Broadcast
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Agent table */}
        <div className="col-span-7 bg-surface/70 backdrop-blur-md rounded-md border border-border">
          <div className="px-4 py-3 border-b border-border bg-elevated/60">
            <h2 className="font-semibold text-sm">Agents</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-elevated/70">
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-left font-medium">Task</th>
                <th className="px-3 py-2 text-left font-medium">Budget</th>
                <th className="px-3 py-2 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_AGENTS.map((agent) => {
                const pct = Math.round((agent.budget.spent / agent.budget.limit) * 100);
                return (
                  <tr key={agent.id} className="border-b border-border/50 hover:bg-hover/30">
                    <td className="px-3 py-2 font-medium">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${statusDot[agent.status]}`} />
                      {agent.name}
                    </td>
                    <td className="px-3 py-2">
                      <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'blocked' ? 'danger' : 'warning'}>{agent.status}</Badge>
                    </td>
                    <td className="px-3 py-2 text-fg-muted truncate max-w-[150px]">{agent.activeTask}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-hover">
                          <div className={`h-full rounded-full ${pct >= 90 ? 'bg-error' : pct >= 70 ? 'bg-warning' : 'bg-primary'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                        </div>
                        <span className="text-[10px] text-fg-muted font-mono">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
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

        {/* Message feed */}
        <div className="col-span-5 bg-surface/70 backdrop-blur-md rounded-md border border-border">
          <div className="px-4 py-3 border-b border-border bg-elevated/60">
            <h2 className="font-semibold text-sm flex items-center gap-2">
              <MessageSquare size={14} /> Messages
            </h2>
          </div>
          <div className="divide-y divide-border">
            {DEMO_MESSAGES.map((msg) => (
              <div key={msg.id} className="px-4 py-2.5 hover:bg-hover/30">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-primary font-medium">{msg.from}</span>
                  <span className="text-fg-muted">→</span>
                  <span className="text-success font-medium">{msg.to}</span>
                  <span className="text-fg-muted bg-hover/60 px-1.5 py-0.5 rounded">{msg.intent}</span>
                  <span className="text-fg-muted ml-auto">{msg.time}</span>
                </div>
                <p className="text-xs text-fg-secondary mt-0.5">{msg.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
