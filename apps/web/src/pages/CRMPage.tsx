import React, { useState } from 'react';
import { Badge } from '@vscp/ui';
import { Users, Plus, ChevronRight } from 'lucide-react';

const PIPELINE_STAGES = [
  { key: 'lead', label: 'Lead', color: 'neutral' },
  { key: 'qualified', label: 'Qualified', color: 'info' },
  { key: 'proposal', label: 'Proposal', color: 'warning' },
  { key: 'negotiation', label: 'Negotiation', color: 'accent' },
  { key: 'closed_won', label: 'Won', color: 'success' },
  { key: 'closed_lost', label: 'Lost', color: 'danger' },
] as const;

const DEMO_CONTACTS = [
  { id: '1', name: 'Sarah Chen', email: 'sarah@startup.io', company: 'StartupIO', tags: ['founder', 'ai'] },
  { id: '2', name: 'Marcus Johnson', email: 'marcus@enterprise.com', company: 'Enterprise Corp', tags: ['enterprise', 'cto'] },
  { id: '3', name: 'Priya Patel', email: 'priya@devtools.co', company: 'DevTools Co', tags: ['developer'] },
];

const DEMO_DEALS = [
  { id: '1', contactName: 'Sarah Chen', stage: 'proposal', value: 50000, notes: 'Enterprise plan for 20 seats' },
  { id: '2', contactName: 'Marcus Johnson', stage: 'negotiation', value: 120000, notes: 'Annual contract' },
  { id: '3', contactName: 'Priya Patel', stage: 'qualified', value: 25000, notes: 'Seed interest' },
];

export function CRMPage() {
  const [tab, setTab] = useState<'pipeline' | 'contacts'>('pipeline');

  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-primary" />
          <h1 className="text-xl font-bold">CRM</h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex gap-1 mr-4">
            {(['pipeline', 'contacts'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? 'bg-elevated/70 text-fg' : 'text-fg-muted hover:bg-hover/60'}`}>
                {t}
              </button>
            ))}
          </nav>
          <button className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-fg-inverse hover:bg-primary-dark transition-colors">
            <Plus size={14} className="inline mr-1" /> Add
          </button>
        </div>
      </div>

      {tab === 'pipeline' ? (
        <div className="grid grid-cols-6 gap-3 h-[calc(100%-5rem)]">
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
                  {totalValue > 0 && <p className="text-[10px] text-fg-muted font-mono">${(totalValue / 1000).toFixed(0)}k</p>}
                </div>
                <div className="p-2 space-y-2">
                  {stageDeals.map((deal) => (
                    <div key={deal.id} className="p-2.5 rounded-md bg-hover/40 border border-border hover:border-border-hover cursor-pointer">
                      <p className="text-xs font-medium">{deal.contactName}</p>
                      <p className="text-[10px] text-fg-muted mt-0.5 line-clamp-2">{deal.notes}</p>
                      <span className="text-[10px] font-mono text-success">${(deal.value / 1000).toFixed(0)}k</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border">
          <div className="divide-y divide-border">
            {DEMO_CONTACTS.map((c) => (
              <div key={c.id} className="px-6 py-4 hover:bg-hover/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-sm bg-primary-muted text-primary flex items-center justify-center font-bold text-sm">{c.name.charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-fg-muted">{c.email} • {c.company}</p>
                </div>
                <div className="flex gap-1">{c.tags.map((t) => <Badge key={t} variant="neutral">{t}</Badge>)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
