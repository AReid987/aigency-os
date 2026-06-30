import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@vscp/ui';
import { Users, Plus, Activity, X } from 'lucide-react';
import { denchclawApi } from '../api/services';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Contact {
  id: string;
  name: string;
  email: string;
  company: string;
  tags: string[];
}

interface Deal {
  id: string;
  contactName: string;
  stage: string;
  value: number;
  notes: string;
}

// ─── Pipeline Stages ─────────────────────────────────────────────────────────

const PIPELINE_STAGES = [
  { key: 'lead', label: 'Lead', color: 'neutral' },
  { key: 'qualified', label: 'Qualified', color: 'info' },
  { key: 'proposal', label: 'Proposal', color: 'warning' },
  { key: 'negotiation', label: 'Negotiation', color: 'accent' },
  { key: 'closed_won', label: 'Won', color: 'success' },
  { key: 'closed_lost', label: 'Lost', color: 'danger' },
] as const;

// ─── Modal Components ────────────────────────────────────────────────────────

function CreateContactModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: Omit<Contact, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    onSubmit({
      name,
      email,
      company,
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add Contact</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-hover/60 text-fg-muted"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1 block">Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md bg-elevated/60 border border-border focus:border-primary focus:outline-none" placeholder="Jane Doe" required />
          </div>
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1 block">Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md bg-elevated/60 border border-border focus:border-primary focus:outline-none" placeholder="jane@company.com" required />
          </div>
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1 block">Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md bg-elevated/60 border border-border focus:border-primary focus:outline-none" placeholder="Acme Corp" />
          </div>
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1 block">Tags (comma separated)</label>
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md bg-elevated/60 border border-border focus:border-primary focus:outline-none" placeholder="founder, ai, enterprise" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-border hover:bg-hover/60 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-fg-inverse hover:bg-primary-dark transition-colors">Create Contact</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CreateDealModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (data: Omit<Deal, 'id'>) => void }) {
  const [contactName, setContactName] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState('lead');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !value) return;
    onSubmit({
      contactName,
      value: Number(value),
      stage,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Add Deal</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-hover/60 text-fg-muted"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1 block">Contact Name *</label>
            <input value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md bg-elevated/60 border border-border focus:border-primary focus:outline-none" placeholder="Jane Doe" required />
          </div>
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1 block">Deal Value ($) *</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md bg-elevated/60 border border-border focus:border-primary focus:outline-none" placeholder="50000" required />
          </div>
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1 block">Stage</label>
            <select value={stage} onChange={(e) => setStage(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md bg-elevated/60 border border-border focus:border-primary focus:outline-none">
              {PIPELINE_STAGES.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-fg-muted mb-1 block">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full px-3 py-2 text-sm rounded-md bg-elevated/60 border border-border focus:border-primary focus:outline-none resize-none" rows={3} placeholder="Deal details..." />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-md border border-border hover:bg-hover/60 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-fg-inverse hover:bg-primary-dark transition-colors">Create Deal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main CRM Page ───────────────────────────────────────────────────────────

export function CRMPage() {
  const [tab, setTab] = useState<'pipeline' | 'contacts' | 'activity'>('pipeline');
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const queryClient = useQueryClient();

  // ─── Data fetching with TanStack Query + graceful fallback ─────────────────

  const { data: contactsData, isLoading: contactsLoading } = useQuery({
    queryKey: ['denchclaw', 'contacts'],
    queryFn: () => denchclawApi.getContacts(),
    retry: 0,
    staleTime: 30_000,
  });

  const { data: dealsData, isLoading: dealsLoading } = useQuery({
    queryKey: ['denchclaw', 'deals'],
    queryFn: () => denchclawApi.getDeals(),
    retry: 0,
    staleTime: 30_000,
  });

  // API returns { contacts: unknown[] }
  const rawContacts = (contactsData as { contacts?: Contact[] } | undefined)?.contacts;
  const contacts: Contact[] = rawContacts ?? [];

  const rawDeals = (dealsData as { deals?: Deal[] } | undefined)?.deals;
  const deals: Deal[] = rawDeals ?? [];

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const createContactMutation = useMutation({
    mutationFn: (data: Omit<Contact, 'id'>) => denchclawApi.createContact(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['denchclaw', 'contacts'] });
      setShowContactModal(false);
    },
  });

  const createDealMutation = useMutation({
    mutationFn: (data: Omit<Deal, 'id'>) => denchclawApi.createDeal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['denchclaw', 'deals'] });
      setShowDealModal(false);
    },
  });

  // ─── Add button handler ────────────────────────────────────────────────────

  const handleAdd = () => {
    if (tab === 'contacts') {
      setShowContactModal(true);
    } else if (tab === 'pipeline') {
      setShowDealModal(true);
    }
  };

  const isLoading = contactsLoading || dealsLoading;

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users size={20} className="text-primary" />
          <h1 className="text-xl font-bold">CRM</h1>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex gap-1 mr-4">
            {(['pipeline', 'contacts', 'activity'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${tab === t ? 'bg-elevated/70 text-fg' : 'text-fg-muted hover:bg-hover/60'}`}>
                {t === 'activity' ? 'Agent Activity' : t}
              </button>
            ))}
          </nav>
          {tab !== 'activity' && (
            <button onClick={handleAdd} className="px-3 py-1.5 text-sm font-medium rounded-md bg-primary text-fg-inverse hover:bg-primary-dark transition-colors">
              <Plus size={14} className="inline mr-1" /> Add
            </button>
          )}
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex items-center justify-center h-[calc(100%-5rem)]">
          <div className="text-sm text-fg-muted animate-pulse">Loading CRM data...</div>
        </div>
      )}

      {/* Pipeline Tab */}
      {!isLoading && tab === 'pipeline' && (
        deals.length === 0 ? (
          <div className="flex items-center justify-center h-[calc(100%-5rem)]">
            <p className="text-sm text-fg-muted">No deals yet</p>
          </div>
        ) : (
        <div className="grid grid-cols-6 gap-3 h-[calc(100%-5rem)]">
          {PIPELINE_STAGES.map((stage) => {
            const stageDeals = deals.filter((d) => d.stage === stage.key);
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
        )
      )}

      {/* Contacts Tab */}
      {!isLoading && tab === 'contacts' && (
        <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border">
          <div className="divide-y divide-border">
            {contacts.length === 0 && (
              <div className="flex items-center justify-center p-8">
                <p className="text-sm text-fg-muted">No contacts yet</p>
              </div>
            )}
            {contacts.map((c) => (
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

      {/* Agent Activity Tab */}
      {!isLoading && tab === 'activity' && (
        <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-auto h-[calc(100%-5rem)]">
          <div className="px-4 py-3 border-b border-border bg-elevated/60 sticky top-0 flex items-center gap-2">
            <Activity size={14} className="text-primary" />
            <h3 className="text-xs font-semibold">Autonomous CRM Actions</h3>
          </div>
          <div className="divide-y divide-border">
            <div className="flex items-center justify-center p-8">
              <p className="text-sm text-fg-muted">No agent activity yet</p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showContactModal && (
        <CreateContactModal
          onClose={() => setShowContactModal(false)}
          onSubmit={(data) => createContactMutation.mutate(data)}
        />
      )}
      {showDealModal && (
        <CreateDealModal
          onClose={() => setShowDealModal(false)}
          onSubmit={(data) => createDealMutation.mutate(data)}
        />
      )}
    </div>
  );
}
