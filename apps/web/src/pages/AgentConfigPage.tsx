import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@vscp/ui';
import {
  Settings, Plus, Trash2, Edit3, X, Cpu, DollarSign, Heart,
} from 'lucide-react';

// ─── CLI Providers (mirror of OrchestratorPage) ──────────────────────────────

const CLI_PROVIDERS = [
  { id: 'hermes', name: 'Hermes Agent', desc: 'Nous Research — general purpose', icon: '🧠' },
  { id: 'claude', name: 'Claude Code', desc: 'Anthropic — reasoning + code', icon: '🔮' },
  { id: 'codex', name: 'OpenAI Codex', desc: 'OpenAI — code generation', icon: '⚡' },
  { id: 'opencode', name: 'OpenCode', desc: 'Go-based coding agent', icon: '🔓' },
  { id: 'mimo', name: 'Mimo Code', desc: 'MiniMax coding agent', icon: '🎯' },
  { id: 'gemini', name: 'Gemini CLI', desc: 'Google — multimodal agent', icon: '💎' },
  { id: 'antigravity', name: 'Antigravity CLI', desc: 'Zero-gravity coding', icon: '🚀' },
  { id: 'kimi', name: 'Kimi', desc: 'Moonshot — long context', icon: '🌙' },
  { id: 'qwen', name: 'Qwen Coder', desc: 'Alibaba — code specialist', icon: '🏗️' },
  { id: 'cursor', name: 'Cursor', desc: 'AI-native editor agent', icon: '✏️' },
  { id: 'copilot', name: 'GitHub Copilot', desc: 'GitHub — pair programming', icon: '🐙' },
  { id: 'blackbox', name: 'Blackbox AI', desc: 'Code generation + search', icon: '📦' },
  { id: 'deepseek', name: 'DeepSeek CLI', desc: 'DeepSeek — efficient inference', icon: '🌊' },
];

// ─── API Key Providers (mirrors ApiKeysPage) ─────────────────────────────────

const API_KEY_PROVIDERS = [
  { id: 'openai', name: 'OpenAI', icon: '⚡' },
  { id: 'anthropic', name: 'Anthropic', icon: '🔮' },
  { id: 'google', name: 'Google', icon: '💎' },
  { id: 'minimax', name: 'MiniMax', icon: '🎯' },
  { id: 'deepseek', name: 'DeepSeek', icon: '🌊' },
  { id: 'moonshot', name: 'Moonshot', icon: '🌙' },
  { id: 'nous', name: 'Nous Research', icon: '🧠' },
  { id: 'opencode', name: 'OpenCode', icon: '🔓' },
  { id: 'antigravity', name: 'Antigravity', icon: '🚀' },
  { id: 'custom', name: 'Custom', icon: '⚙️' },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface AgentTemplate {
  id: string;
  role: string;
  cliProviderId: string;
  apiKeyProviderId: string;
  budget: number;
  heartbeat: string;
}

interface TemplateForm {
  role: string;
  cliProviderId: string;
  apiKeyProviderId: string;
  budget: string;
  heartbeat: string;
}

// ─── Demo Data ───────────────────────────────────────────────────────────────

const DEMO_TEMPLATES: AgentTemplate[] = [
  { id: 't1', role: 'CEO', cliProviderId: 'hermes', apiKeyProviderId: 'nous', budget: 200, heartbeat: '8h' },
  { id: 't2', role: 'CTO', cliProviderId: 'opencode', apiKeyProviderId: 'deepseek', budget: 150, heartbeat: '4h' },
  { id: 't3', role: 'Engineer', cliProviderId: 'mimo', apiKeyProviderId: 'minimax', budget: 100, heartbeat: '4h' },
  { id: 't4', role: 'CMO', cliProviderId: 'claude', apiKeyProviderId: 'anthropic', budget: 80, heartbeat: '12h' },
  { id: 't5', role: 'Sales', cliProviderId: 'gemini', apiKeyProviderId: 'google', budget: 80, heartbeat: '8h' },
  { id: 't6', role: 'Plannotator', cliProviderId: 'gemini', apiKeyProviderId: 'google', budget: 50, heartbeat: '4h' },
];

const ROLES = ['CEO', 'CTO', 'CMO', 'CFO', 'COO', 'Engineer', 'Sales', 'QA', 'Designer', 'Content', 'Plannotator', 'DevOps'];
const HEARTBEATS = ['4h', '8h', '12h', '24h'];

// ─── Template Modal ──────────────────────────────────────────────────────────

function TemplateModal({
  open,
  onClose,
  onSave,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: TemplateForm) => void;
  editing?: AgentTemplate | null;
}) {
  const [form, setForm] = useState<TemplateForm>(
    editing
      ? {
          role: editing.role,
          cliProviderId: editing.cliProviderId,
          apiKeyProviderId: editing.apiKeyProviderId,
          budget: String(editing.budget),
          heartbeat: editing.heartbeat,
        }
      : {
          role: 'Engineer',
          cliProviderId: 'hermes',
          apiKeyProviderId: 'openai',
          budget: '100',
          heartbeat: '8h',
        }
  );

  if (!open) return null;

  const selectedCli = CLI_PROVIDERS.find((p) => p.id === form.cliProviderId);
  const selectedApiKey = API_KEY_PROVIDERS.find((p) => p.id === form.apiKeyProviderId);

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-border rounded-lg shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-display">
            {editing ? 'Edit Agent Template' : 'Add Agent Template'}
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-hover/60 text-fg-muted hover:text-fg">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Role */}
          <div>
            <label className="block text-xs font-medium mb-1.5">Agent Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* CLI Provider */}
          <div>
            <label className="block text-xs font-medium mb-1.5">Default CLI Provider</label>
            <select
              value={form.cliProviderId}
              onChange={(e) => setForm({ ...form, cliProviderId: e.target.value })}
              className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
            >
              {CLI_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name} — {p.desc}
                </option>
              ))}
            </select>
            {selectedCli && (
              <p className="text-[10px] text-fg-muted mt-1">
                {selectedCli.icon} {selectedCli.desc}
              </p>
            )}
          </div>

          {/* API Key Provider */}
          <div>
            <label className="block text-xs font-medium mb-1.5">API Key Provider</label>
            <select
              value={form.apiKeyProviderId}
              onChange={(e) => setForm({ ...form, apiKeyProviderId: e.target.value })}
              className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
            >
              {API_KEY_PROVIDERS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.icon} {p.name}
                </option>
              ))}
            </select>
            {selectedApiKey && (
              <p className="text-[10px] text-fg-muted mt-1">
                Uses the {selectedApiKey.name} key configured in API Keys settings
              </p>
            )}
          </div>

          {/* Budget + Heartbeat */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5">Default Budget ($)</label>
              <input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">Default Heartbeat</label>
              <select
                value={form.heartbeat}
                onChange={(e) => setForm({ ...form, heartbeat: e.target.value })}
                className="w-full px-3 py-2 bg-elevated/70 border border-border rounded-md text-sm focus:border-primary focus:outline-none"
              >
                {HEARTBEATS.map((h) => (
                  <option key={h} value={h}>Every {h}</option>
                ))}
              </select>
            </div>
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
            className="px-4 py-2 text-sm bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2"
          >
            <Settings size={14} /> {editing ? 'Save Changes' : 'Add Template'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export function AgentConfigPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<AgentTemplate | null>(null);

  // TODO: Connect to backend API
  const { data: templatesData } = useQuery({
    queryKey: ['agent-templates'],
    queryFn: () => Promise.resolve(DEMO_TEMPLATES),
    staleTime: 30_000,
  });

  const addMutation = useMutation({
    mutationFn: (form: TemplateForm) => {
      // TODO: POST to /api/agent-templates
      const newTemplate: AgentTemplate = {
        id: `t${Date.now()}`,
        role: form.role,
        cliProviderId: form.cliProviderId,
        apiKeyProviderId: form.apiKeyProviderId,
        budget: Number(form.budget),
        heartbeat: form.heartbeat,
      };
      return Promise.resolve(newTemplate);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agent-templates'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: TemplateForm }) => {
      // TODO: PUT /api/agent-templates/:id
      const updated: AgentTemplate = {
        id,
        role: form.role,
        cliProviderId: form.cliProviderId,
        apiKeyProviderId: form.apiKeyProviderId,
        budget: Number(form.budget),
        heartbeat: form.heartbeat,
      };
      return Promise.resolve(updated);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agent-templates'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      // TODO: DELETE /api/agent-templates/:id
      return Promise.resolve(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['agent-templates'] }),
  });

  const templates: AgentTemplate[] = templatesData ?? [];

  const handleSave = (form: TemplateForm) => {
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, form });
      setEditingTemplate(null);
    } else {
      addMutation.mutate(form);
    }
  };

  const handleEdit = (template: AgentTemplate) => {
    setEditingTemplate(template);
    setShowModal(true);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div className="flex items-center gap-3">
          <Cpu size={20} className="text-primary" />
          <h1 className="text-xl font-bold font-display">Agent Configuration</h1>
          <Badge variant="info">{templates.length} templates</Badge>
          <Badge variant="warning">Admin Only</Badge>
        </div>
        <button
          onClick={() => {
            setEditingTemplate(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-primary text-fg-inverse font-semibold rounded-md hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm"
        >
          <Plus size={16} /> Add Agent Template
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 min-h-0 overflow-auto p-6">
        <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-elevated/70">
                <th className="px-4 py-2.5 text-left font-medium text-xs">Role</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs">CLI Provider</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs">API Key</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs">Budget</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs">Heartbeat</th>
                <th className="px-4 py-2.5 text-left font-medium text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => {
                const cliProvider = CLI_PROVIDERS.find((p) => p.id === template.cliProviderId);
                const apiKeyProvider = API_KEY_PROVIDERS.find((p) => p.id === template.apiKeyProviderId);

                return (
                  <tr key={template.id} className="border-b border-border/50 hover:bg-hover/30">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-sm bg-primary-muted text-primary flex items-center justify-center font-bold text-[10px]">
                          {template.role.charAt(0)}
                        </div>
                        <span className="font-medium">{template.role}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span>{cliProvider?.icon}</span>
                        <Badge variant="neutral">{cliProvider?.name || template.cliProviderId}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <span>{apiKeyProvider?.icon}</span>
                        <span className="text-xs text-fg-muted">{apiKeyProvider?.name || template.apiKeyProviderId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} className="text-fg-muted" />
                        <span className="font-mono text-xs">{template.budget}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1">
                        <Heart size={12} className="text-fg-muted" />
                        <span className="text-xs">{template.heartbeat}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(template)}
                          className="p-1.5 rounded hover:bg-hover/60 text-fg-muted hover:text-fg transition-colors"
                          title="Edit template"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(template.id)}
                          className="p-1.5 rounded hover:bg-error/10 text-fg-muted hover:text-error transition-colors"
                          title="Delete template"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {templates.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12">
              <Cpu size={32} className="text-fg-muted mb-3 opacity-50" />
              <p className="text-sm text-fg-muted">No agent templates configured yet.</p>
              <p className="text-xs text-fg-muted mt-1">Add a template to define default settings for agent roles.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <TemplateModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTemplate(null);
        }}
        onSave={handleSave}
        editing={editingTemplate}
      />
    </div>
  );
}
