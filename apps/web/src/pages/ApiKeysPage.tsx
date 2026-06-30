import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@vscp/ui';
import {
  Key, Plus, Trash2, Eye, EyeOff, Copy, Check, X, Shield,
} from 'lucide-react';

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

// ─── Demo Data ───────────────────────────────────────────────────────────────

const DEMO_KEYS: ApiKeyEntry[] = [
  { id: 'k1', providerId: 'openai', label: 'Primary OpenAI', maskedKey: 'sk-...a8f3b2', configured: true, lastUsed: '2 hours ago', createdAt: '2025-01-15' },
  { id: 'k2', providerId: 'anthropic', label: 'Claude Production', maskedKey: 'sk-ant-...9c1d4e', configured: true, lastUsed: '30 min ago', createdAt: '2025-02-01' },
  { id: 'k3', providerId: 'google', label: 'Gemini Key', maskedKey: 'AIza...f7e2a1', configured: true, lastUsed: '1 day ago', createdAt: '2025-03-10' },
  { id: 'k4', providerId: 'minimax', label: 'MiniMax Inference', maskedKey: 'mm-...b4c8d2', configured: true, lastUsed: '5 hours ago', createdAt: '2025-04-20' },
  { id: 'k5', providerId: 'nous', label: 'Hermes Cloud', maskedKey: 'ns-...e5f9a3', configured: true, lastUsed: '10 min ago', createdAt: '2025-05-01' },
  { id: 'k6', providerId: 'deepseek', label: EMPTY, maskedKey: EMPTY, configured: false, lastUsed: null, createdAt: EMPTY },
];

// ─── Mask Key Utility ────────────────────────────────────────────────────────

function maskKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  const prefix = key.slice(0, key.indexOf('-') > 0 ? key.indexOf('-') + 3 : 4);
  const suffix = key.slice(-5);
  return `${prefix}...${suffix}`;
}

// ─── Add Key Modal ───────────────────────────────────────────────────────────

function AddKeyModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (form: AddKeyForm) => void;
}) {
  const [form, setForm] = useState<AddKeyForm>({ ...EMPTY_FORM });

  if (!open) return null;

  const selectedProvider = INFERENCE_PROVIDERS.find((p) => p.id === form.providerId);
  const isCustom = form.providerId === 'custom';

  const handleSubmit = () => {
    if (!form.providerId || !form.inferenceKey) return;
    onAdd(form);
    setForm({ ...EMPTY_FORM });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-lg shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-display">Add Inference API Key</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-hover/60 text-fg-muted hover:text-fg">
            <X size={16} />
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
              <option value={EMPTY}>Select provider...</option>
              {INFERENCE_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name} — {p.models}
                </option>
              ))}
            </select>
          </div>

          {selectedProvider && (
            <div className="flex items-center gap-2 px-3 py-2 bg-primary-muted/20 border border-primary/20 rounded-md">
              <span className="text-lg">{selectedProvider.icon}</span>
              <div>
                <p className="text-xs font-medium">{selectedProvider.name}</p>
                <p className="text-[10px] text-fg-muted">{selectedProvider.models}</p>
              </div>
            </div>
          )}

          {isCustom && (
            <div>
              <label className="block text-xs font-medium mb-1.5">Base URL</label>
              <input
                type="text"
                value={form.baseUrl}
                onChange={(e) => setForm({ ...form, baseUrl: e.target.value })}
                placeholder="https://api.example.com/v1"
                className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none font-mono"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-1.5">API Key</label>
            <input
              type="password"
              value={form.inferenceKey}
              onChange={(e) => setForm({ ...form, inferenceKey: e.target.value })}
              placeholder="sk-..."
              className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5">Label (optional)</label>
            <input
              type="text"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g., Production, Development"
              className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-fg-muted hover:text-fg border border-border rounded-md hover:bg-hover/60 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.providerId || !form.inferenceKey}
            className="px-4 py-2 text-sm bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Key size={14} /> Add Key
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
}: {
  entry: ApiKeyEntry;
  onDelete: (id: string) => void;
}) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const provider = INFERENCE_PROVIDERS.find((p) => p.id === entry.providerId);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(entry.maskedKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [entry.maskedKey]);

  return (
    <div className={`bg-elevated/70 border rounded-lg p-4 transition-colors ${entry.configured ? 'border-border hover:border-border-hover' : 'border-dashed border-border/60'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{provider?.icon || '🔑'}</span>
          <div>
            <p className="text-sm font-semibold">{provider?.name || entry.providerId}</p>
            {entry.label && <p className="text-[10px] text-fg-muted">{entry.label}</p>}
          </div>
        </div>
        <Badge variant={entry.configured ? 'success' : 'warning'}>
          {entry.configured ? 'configured' : 'not set'}
        </Badge>
      </div>

      {entry.configured ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 bg-surface/80 border border-border rounded-md">
              <Key size={12} className="text-fg-muted shrink-0" />
              <span className="text-xs font-mono text-fg-muted truncate">
                {showKey ? entry.maskedKey : '••••••••••••'}
              </span>
            </div>
            <button
              onClick={() => setShowKey(!showKey)}
              className="p-1.5 rounded hover:bg-hover/60 text-fg-muted hover:text-fg transition-colors"
              title={showKey ? 'Hide key' : 'Show key'}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:bg-hover/60 text-fg-muted hover:text-fg transition-colors"
              title="Copy key"
            >
              {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] text-fg-muted">
              {entry.lastUsed ? `Last used ${entry.lastUsed}` : 'Never used'}
            </span>
            <button
              onClick={() => onDelete(entry.id)}
              className="p-1 rounded hover:bg-error/10 text-fg-muted hover:text-error transition-colors"
              title="Delete key"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs text-fg-muted">No API key configured for this provider.</p>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function ApiKeysPage() {
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);

  // TODO: Connect to backend API
  const { data: keysData } = useQuery({
    queryKey: ['api-keys'],
    queryFn: () => Promise.resolve(DEMO_KEYS),
    staleTime: 30_000,
  });

  const addKeyMutation = useMutation({
    mutationFn: (form: AddKeyForm) => {
      // TODO: POST to /api/api-keys
      const newKey: ApiKeyEntry = {
        id: `k${Date.now()}`,
        providerId: form.providerId,
        label: form.label,
        maskedKey: maskKey(form.inferenceKey),
        configured: true,
        lastUsed: null,
        createdAt: new Date().toISOString().split('T')[0],
      };
      return Promise.resolve(newKey);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] }),
  });

  const deleteKeyMutation = useMutation({
    mutationFn: (id: string) => {
      // TODO: DELETE /api/api-keys/:id
      return Promise.resolve(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['api-keys'] }),
  });

  const keys: ApiKeyEntry[] = keysData ?? [];
  const configuredCount = keys.filter((k) => k.configured).length;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-3">
          <Key size={20} className="text-primary" />
          <h1 className="text-xl font-bold font-display">Inference API Keys</h1>
          <Badge variant="info">{configuredCount} configured</Badge>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Key
        </button>
      </div>

      {/* Security notice */}
      <div className="mx-6 mt-4 flex items-center gap-2 px-3 py-2 bg-primary-muted/10 border border-primary/10 rounded-md">
        <Shield size={14} className="text-primary shrink-0" />
        <p className="text-[11px] text-fg-muted">
          API keys are shared across the platform. When a key is added, it becomes available for agents to use during inference.
          Keys are encrypted at rest and never displayed in full.
        </p>
      </div>

      {/* Key Grid */}
      <div className="flex-1 min-h-0 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keys.map((entry) => (
            <KeyCard
              key={entry.id}
              entry={entry}
              onDelete={(id) => deleteKeyMutation.mutate(id)}
            />
          ))}
        </div>
      </div>

      {/* Add Key Modal */}
      <AddKeyModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(form) => addKeyMutation.mutate(form)}
      />
    </div>
  );
}
