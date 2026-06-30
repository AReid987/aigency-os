import React, { useState } from 'react';
import { Atmosphere } from './components/Atmosphere';
import { Badge } from '@aigency-os/ui';
import { Users, DollarSign, Mail, Plus, ChevronRight, TrendingUp } from 'lucide-react';

const PIPELINE_STAGES = [
  { key: 'lead', label: 'Lead', color: 'neutral' },
  { key: 'qualified', label: 'Qualified', color: 'info' },
  { key: 'proposal', label: 'Proposal', color: 'warning' },
  { key: 'negotiation', label: 'Negotiation', color: 'accent' },
  { key: 'closed_won', label: 'Won', color: 'success' },
  { key: 'closed_lost', label: 'Lost', color: 'danger' },
] as const;

const DEMO_CONTACTS = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@startup.io', company: 'StartupIO', tags: ['founder', 'ai'], source: 'linkedin' },
  { id: '2', name: 'Marcus Johnson', email: 'marcus@enterprise.com', company: 'Enterprise Corp', tags: ['enterprise', 'cto'], source: 'referral' },
  { id: '3', name: 'Priya Patel', email: 'priya@devtools.co', company: 'DevTools Co', tags: ['developer', 'open-source'], source: 'github' },
  { id: '4', name: 'Alex Rivera', email: 'alex@vc.fund', company: 'VC Fund', tags: ['investor', 'seed'], source: 'event' },
  { id: '5', name: 'Jordan Lee', email: 'jordan@agency.ai', company: 'Agency AI', tags: ['agency', 'marketing'], source: 'cold-email' },
];

const DEMO_DEALS = [
  { id: '1', contactId: '1', contactName: 'Sarah Chen', stage: 'proposal', value: 50000, currency: 'USD', notes: 'Enterprise plan for 20 seats' },
  { id: '2', contactId: '2', contactName: 'Marcus Johnson', stage: 'negotiation', value: 120000, currency: 'USD', notes: 'Annual contract with custom integration' },
  { id: '3', contactId: '4', contactName: 'Alex Rivera', stage: 'qualified', value: 25000, currency: 'USD', notes: 'Seed investment interest' },
];

export default function App() {
  const [tab, setTab] = useState<'pipeline' | 'contacts' | 'outreach'>('pipeline');

  return (
    <div className="relative min-h-screen text-fg z-10">
      <Atmosphere />
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface/70 backdrop-blur-md border-b border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-primary" />
          <h1 className="text-lg font-bold">DenchClaw CRM</h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex gap-1 mr-4">
            {(['pipeline', 'contacts', 'outreach'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                  tab === t ? 'bg-elevated/70 text-fg' : 'text-fg-muted hover:bg-hover/60'
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
          <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-fg-inverse hover:bg-primary-dark transition-colors">
            <Plus size={14} className="inline mr-1" /> Add
          </button>
        </div>
      </header>

      <main className="pt-16 p-6">
        {tab === 'pipeline' && (
          <div className="grid grid-cols-6 gap-3 h-[calc(100vh-5rem)]">
            {PIPELINE_STAGES.map((stage) => {
              const stageDeals = DEMO_DEALS.filter((d) => d.stage === stage.key);
              const totalValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
              return (
                <div key={stage.key} className="bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-auto">
                  <div className="px-3 py-2.5 border-b border-border bg-elevated/60 sticky top-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-semibold">{stage.label}</h3>
                      <Badge variant={stage.color as any}>{stageDeals.length}</Badge>
                    </div>
                    {totalValue > 0 && (
                      <p className="text-[10px] text-fg-muted font-mono">${(totalValue / 1000).toFixed(0)}k</p>
                    )}
                  </div>
                  <div className="p-2 space-y-2">
                    {stageDeals.map((deal) => (
                      <div key={deal.id} className="p-2.5 rounded-md bg-hover/40 border border-border hover:border-border-hover cursor-pointer transition-colors">
                        <p className="text-xs font-medium">{deal.contactName}</p>
                        <p className="text-[10px] text-fg-muted mt-0.5 line-clamp-2">{deal.notes}</p>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[10px] font-mono text-success">${(deal.value / 1000).toFixed(0)}k</span>
                          <ChevronRight size={10} className="text-fg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'contacts' && (
          <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border">
            <div className="divide-y divide-border">
              {DEMO_CONTACTS.map((contact) => (
                <div key={contact.id} className="px-6 py-4 hover:bg-hover/30 transition-colors flex items-center gap-4">
                  <div className="w-10 h-10 rounded-sm bg-primary-muted text-primary flex items-center justify-center font-bold text-sm">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{contact.name}</p>
                    <p className="text-xs text-fg-muted">{contact.email} • {contact.company}</p>
                  </div>
                  <div className="flex gap-1">
                    {contact.tags.map((tag) => (
                      <Badge key={tag} variant="neutral">{tag}</Badge>
                    ))}
                  </div>
                  <Badge variant="info">{contact.source}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'outreach' && (
          <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border p-8 text-center">
            <Mail size={48} className="mx-auto text-fg-muted mb-4" />
            <h2 className="text-lg font-bold mb-2">Outreach Automation</h2>
            <p className="text-sm text-fg-muted mb-4">Configure LinkedIn, email, and cold campaign sequences.</p>
            <button className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-fg-inverse hover:bg-primary-dark transition-colors">
              Create Sequence
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
