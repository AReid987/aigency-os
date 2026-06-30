import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@vscp/ui';
import {
  Key, Plus, Trash2, Eye, EyeOff, Copy, Check, X, Shield, Users,
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

// ─── Inference Providers ─────────────────────────────────────────────────────

interface InferenceProvider {
  id: string;
  name: string;
  models: string;
  icon: string;
}

const INFERENCE_PROVIDERS: InferenceProvider[] = [
  { id: 'openai', name: 'OpenAI', models: 'GPT-4, Codex', icon: '⚡' },
  { id: 'anthropic', name: 'Anthropic', models: 'Claude', icon: '🔮' },
  { id: 'google', name: 'Google', models: 'Gemini', icon: '💎' },
  { id: 'minimax', name: 'MiniMax', models: 'Mimo Code', icon: '🎯' },
  { id: 'deepseek', name: 'DeepSeek', models: 'DeepSeek V4 Flash', icon: '🌊' },
  { id: 'moonshot', name: 'Moonshot', models: 'Kimi', icon: '🌙' },
  { id: 'nous', name: 'Nous Research', models: 'Hermes', icon: '🧠' },
  { id: 'opencode', name: 'OpenCode', models: 'Go-based', icon: '🔓' },
  { id: 'antigravity', name: 'Antigravity', models: 'Antigravity', icon: '🚀' },
  { id: 'custom', name: 'Custom', models: 'User-defined', icon: '⚙️' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface ApiKeyEntry {
  id: string;
  providerId: string;
  label: string;
  maskedKey: string;
  configured: boolean;
  lastUsed: string | null;
  createdAt: string;
  ownerId: string;
  ownerName: string;
}

interface AddKeyForm {
  providerId: string;
  inferenceKey: string;
  label: string;
  baseUrl: string;
}

const EMPTY = String();

const EMPTY_FORM: AddKeyForm = {
  providerId: EMPTY,
  inferenceKey: EMPTY,
  label: EMPTY,
  baseUrl: EMPTY,
};

// ─── Mask Key Utility ────────────────────────────────────────────────────────

function maskKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  const prefix = key.slice(0, key.indexOf('-') > 0 ? key.indexOf('-') + 3 : 4);
  const suffix = key.slice(-5);
  return `${prefix}...${suffix}`;
}

// ─── Add Key Modal ───────────────────────────────────────────────────────────

function AddKeyModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (form: AddKeyForm) => void;
}) {
  const [form, setForm] = useState<AddKeyForm>({ ...EMPTY_FORM });

  const handleSubmit = () => {
    if (!form.providerId || !form.inferenceKey) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface/95 backdrop-blur-md rounded-lg border border-border p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold font-display">Add API Key</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-hover/60 text-fg-muted">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5">Provider</label>
            <select
              value={form.providerId}
              onChange={(e) => setForm({ ...form, providerId: e.target.value })}
              className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select provider...</option>
              {INFERENCE_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name} — {p.models}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">API Key</label>
            <input
              type="password"
              value={form.inferenceKey}
              onChange={(e) => setForm({ ...form, inferenceKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm font-mono focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Label (optional)</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g., Production OpenAI"
              className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
            />
          </div>

          {form.providerId === 'custom' && (
            <div>
              <label className="block text-xs font-medium mb-1.5">Base URL</label>
              <input
                type="text"
                value={form.baseUrl}
                onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                placeholder="https://api.example.com/v1"
                className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm font-mono focus:border-primary focus:outline-none"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            disabled={!form.providerId || !form.inferenceKey}
            className="flex-1 px-4 py-2.5 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            Add Key
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-fg-muted hover:text-fg border border-border rounded-md hover:bg-hover/60 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Key Card ────────────────────────────────────────────────────────────────

function KeyCard({
  entry,
  onDelete,
  showOwner,
}: {
  entry: ApiKeyEntry;
  onDelete: (id: string) => void;
  showOwner: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const provider = INFERENCE_PROVIDERS.find((p) => p.id === entry.providerId);

  const handleCopy = () => {
    navigator.clipboard.writeText(entry.maskedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface/70 backdrop-blur-md rounded-lg border border-border p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{provider?.icon || '🔑'}</span>
          <div>
            <p className="text-sm font-medium">{provider?.name || entry.providerId}</p>
            {entry.label && <p className="text-[10px] text-fg-muted">{entry.label}</p>}
          </div>
        </div>
        <Badge variant={entry.configured ? 'success' : 'warning'}>
          {entry.configured ? 'Configured' : 'Not Set'}
        </Badge>
      </div>

      {showOwner && (
        <div className="flex items-center gap-1.5 mb-2">
          <Users size={12} className="text-fg-muted" />
          <span className="text-[10px] text-fg-muted">Owner: {entry.ownerName}</span>
        </div>
      )}

      {entry.configured && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-elevated/50 rounded-md">
          <code className="flex-1 text-xs font-mono text-fg-muted">
            {visible ? entry.maskedKey : '••••••••••••'}
          </code>
          <button onClick={() => setVisible(!visible)} className="p-1 rounded hover:bg-hover/60 text-fg-muted">
            {visible ? <EyeOff size={12} /> : <Eye size={12} />}
          </button>
          <button onClick={handleCopy} className="p-1 rounded hover:bg-hover/60 text-fg-muted">
            {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-[10px] text-fg-muted">
          {entry.lastUsed ? `Last used: ${entry.lastUsed}` : 'Never used'}
        </span>
        <button
          onClick={() => onDelete(entry.id)}
          className="p-1 rounded hover:bg-error/20 text-fg-muted hover:text-error transition-colors"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ApiKeysPage() {
  const user = useAuthStore((s) => s.user);
  const isAdmin = user?.role === 'admin';
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

  // TODO: Connect to backend API
  const { data: keysData } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => Promise.resolve([] as ApiKeyEntry[]),
    staleTime: 30_000,
  });

  const addKeyMutation = useMutation({
    mutationFn: (form: AddKeyForm) => {
      const newKey: ApiKeyEntry = {
        id: `k${Date.now()}`,
        providerId: form.providerId,
        label: form.label,
        maskedKey: maskKey(form.inferenceKey),
        configured: true,
        lastUsed: null,
        createdAt: new Date().toISOString().split('T')[0],
        ownerId: user?.id || 'unknown',
        ownerName: user?.name || 'Unknown',
      };
      return Promise.resolve(newKey);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] }),
  });

  const deleteKeyMutation = useMutation({
    mutationFn: (id: string) => Promise.resolve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] }),
  });

  const allKeys: ApiKeyEntry[] = keysData ?? [];

  // Filter: domain experts see only their own keys, admin sees all
  const keys = isAdmin
    ? allKeys
    : allKeys.filter((k) => k.ownerId === user?.id);

  const myKeys = allKeys.filter((k) => k.ownerId === user?.id);
  const otherKeys = allKeys.filter((k) => k.ownerId !== user?.id);
  const configuredCount = keys.filter((k) => k.configured).length;

  return (
    <div className="p-6 h-full overflow-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Key size={24} className="text-amber" />
            <h1 className="text-2xl font-bold font-display">Inference API Keys</h1>
            <Badge variant="info">{configuredCount} configured</Badge>
            {isAdmin && <Badge variant="primary">Admin View</Badge>}
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Add Key
          </button>
        </div>

        {/* Security notice */}
        <div className="mb-6 p-3 bg-elevated/50 rounded-md border border-border flex items-start gap-2">
          <Shield size={16} className="text-warning mt-0.5 shrink-0" />
          <p className="text-xs text-fg-muted">
            {isAdmin
              ? 'Admin view: you can see all keys and assign them to agents. Domain expert keys are shown without exposing raw values.'
              : 'Your API keys are used by agents for LLM inference. Keys are shared across the platform — agents you collaborate with may use your keys.'}
          </p>
        </div>

        {/* Admin: My Keys section */}
        {isAdmin && (
          <>
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wider mb-3">My Keys</h2>
              {myKeys.length === 0 ? (
                <div className="flex items-center justify-center p-8 bg-surface/70 rounded-lg border border-border">
                  <p className="text-sm text-fg-muted">No API keys configured yet. Add your first key.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myKeys.map((key) => (
                    <KeyCard key={key.id} entry={key} onDelete={deleteKeyMutation.mutate} showOwner={false} />
                  ))}
                </div>
              )}
            </div>

            {otherKeys.length > 0 && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-fg-muted uppercase tracking-wider mb-3">
                  Domain Expert Keys ({otherKeys.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherKeys.map((key) => (
                    <KeyCard key={key.id} entry={key} onDelete={deleteKeyMutation.mutate} showOwner={true} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Domain Expert: own keys only */}
        {!isAdmin && (
          <>
            {keys.length === 0 ? (
              <div className="flex items-center justify-center p-12 bg-surface/70 rounded-lg border border-border">
                <div className="text-center">
                  <Key size={32} className="mx-auto mb-3 text-fg-muted opacity-50" />
                  <p className="text-sm text-fg-muted">No API keys configured yet.</p>
                  <p className="text-xs text-fg-muted mt-1">Add your keys to enable LLM inference for agents.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keys.map((key) => (
                  <KeyCard key={key.id} entry={key} onDelete={deleteKeyMutation.mutate} showOwner={false} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showAddModal && (
        <AddKeyModal
          onClose={() => setShowAddModal(false)}
          onAdd={(form) => addKeyMutation.mutate(form)}
        />
      )}
    </div>
  );
}
