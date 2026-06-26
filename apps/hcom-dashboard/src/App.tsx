import React, { useState } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { AgentList } from './components/AgentList';
import { MessageFeed } from './components/MessageFeed';
import { TerminalPreview } from './components/TerminalPreview';
import { CollisionAlert } from './components/CollisionAlert';
import type { HCOMAgent, HCOMMessage, Collision } from '@vscp/shared-types';

// Demo data
const DEMO_AGENTS: HCOMAgent[] = [
  { id: '1', name: 'hermes', adapter: 'hermes', status: 'active', activeTask: 'Architecture', lastHeartbeat: new Date().toISOString(), sessionId: 'tmux:0' },
  { id: '2', name: 'claude', adapter: 'claude', status: 'active', activeTask: 'API dev', lastHeartbeat: new Date().toISOString(), sessionId: 'tmux:1' },
  { id: '3', name: 'kimi', adapter: 'kimi', status: 'thinking', activeTask: 'UI dev', lastHeartbeat: new Date().toISOString(), sessionId: 'tmux:2' },
  { id: '4', name: 'qwen', adapter: 'codex', status: 'blocked', activeTask: 'Waiting', lastHeartbeat: new Date().toISOString(), sessionId: 'tmux:3' },
];

const DEMO_MESSAGES: HCOMMessage[] = [
  { id: '1', senderId: 'hermes', recipientId: 'claude', intent: 'task', content: 'Design the auth middleware, then ask kimi for the UI', contextBundle: {}, timestamp: new Date().toISOString(), deliveryStatus: 'delivered' },
  { id: '2', senderId: 'claude', recipientId: 'hermes', intent: 'status', content: 'Auth middleware done. JWT-based, 15min expiry.', contextBundle: {}, timestamp: new Date().toISOString(), deliveryStatus: 'delivered' },
  { id: '3', senderId: 'kimi', recipientId: 'claude', intent: 'request', content: 'UI components ready. Need API endpoint for /login', contextBundle: {}, timestamp: new Date().toISOString(), deliveryStatus: 'delivered' },
];

export default function App() {
  const [selectedAgent, setSelectedAgent] = useState<HCOMAgent | undefined>();

  return (
    <div className="relative min-h-screen text-fg z-10">
      <Atmosphere />
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-md border-b border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold">HCOM Agent Monitor</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm rounded-md bg-surface/70 backdrop-blur-sm border border-border hover:bg-hover/60 transition-colors">
            Refresh
          </button>
          <button className="px-3 py-1.5 text-sm rounded-md bg-surface/70 backdrop-blur-sm border border-border hover:bg-hover/60 transition-colors">
            Settings
          </button>
        </div>
      </header>

      <main className="pt-16 p-6 space-y-6">
        {/* Collision Alerts */}
        <CollisionAlert collisions={[]} />

        {/* Agent Table */}
        <section className="bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
          <div className="px-4 py-3 border-b border-border bg-elevated/60 backdrop-blur-sm">
            <h2 className="font-semibold text-sm">Agents ({DEMO_AGENTS.length})</h2>
          </div>
          <AgentList agents={DEMO_AGENTS} selectedAgentId={selectedAgent?.id} onAgentSelect={setSelectedAgent} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Messages */}
          <section className="bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div className="px-4 py-3 border-b border-border bg-elevated/60 backdrop-blur-sm">
              <h2 className="font-semibold text-sm">Messages</h2>
            </div>
            <MessageFeed messages={DEMO_MESSAGES} />
          </section>

          {/* Terminal Preview */}
          <section className="bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div className="px-4 py-3 border-b border-border bg-elevated/60 backdrop-blur-sm">
              <h2 className="font-semibold text-sm">Terminal Preview</h2>
            </div>
            <div className="p-4">
              <TerminalPreview
                agentName={selectedAgent?.name ?? 'claude'}
                sessionId={selectedAgent?.sessionId ?? 'tmux:1'}
                output={['$ npm test', '45 tests passed', '', '$ npm run dev', '[vite] ready on :3000']}
              />
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-sm rounded-md bg-primary text-fg-inverse hover:bg-primary-dark transition-colors">
            Attach
          </button>
          <button className="px-3 py-1.5 text-sm rounded-md bg-surface/70 backdrop-blur-sm border border-border hover:bg-hover/60 transition-colors">
            Kill
          </button>
          <button className="px-3 py-1.5 text-sm rounded-md bg-surface/70 backdrop-blur-sm border border-border hover:bg-hover/60 transition-colors">
            Fork
          </button>
          <button className="px-3 py-1.5 text-sm rounded-md bg-surface/70 backdrop-blur-sm border border-border hover:bg-hover/60 transition-colors">
            Message
          </button>
          <button className="px-3 py-1.5 text-sm rounded-md bg-surface/70 backdrop-blur-sm border border-border hover:bg-hover/60 transition-colors">
            View Transcript
          </button>
        </div>
      </main>
    </div>
  );
}
