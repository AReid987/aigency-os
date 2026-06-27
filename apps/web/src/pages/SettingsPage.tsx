import { useState, type ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@vscp/ui';
import { Settings, Server, Key, Monitor, Moon, Sun, Globe } from 'lucide-react';
import { checkAllServices } from '../api/services';

type Tab = 'general' | 'mcp' | 'services' | 'api-keys';

const tabs: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'general', label: 'General', icon: <Monitor size={14} /> },
  { id: 'mcp', label: 'MCP', icon: <Server size={14} /> },
  { id: 'services', label: 'Services', icon: <Globe size={14} /> },
  { id: 'api-keys', label: 'API Keys', icon: <Key size={14} /> },
];

// ─── MCP Servers ────────────────────────────────────────────────────────────

interface McpServer {
  name: string;
  transport: 'stdio' | 'http';
  status: 'up' | 'down';
  url: string;
}

const mcpServers: McpServer[] = [
  { name: 'gbrain', transport: 'stdio', status: 'up', url: 'stdio://local' },
  { name: 'paperclip', transport: 'http', status: 'up', url: 'http://localhost:3100' },
  { name: 'skills', transport: 'http', status: 'down', url: 'http://localhost:3200' },
];

// ─── Service Health ─────────────────────────────────────────────────────────

interface ServiceHealth {
  name: string;
  status: 'up' | 'down' | 'unreachable';
}

const demoServices: ServiceHealth[] = [
  { name: 'API Gateway', status: 'up' },
  { name: 'PostgreSQL', status: 'up' },
  { name: 'Redis', status: 'up' },
  { name: 'MCP Broker', status: 'up' },
  { name: 'Agent Runner', status: 'down' },
  { name: 'wterm', status: 'unreachable' },
];

function ServiceStatusRow({ name, status }: { name: string; status: 'up' | 'down' | 'unreachable' }) {
  const colors = { up: 'bg-success', down: 'bg-error', unreachable: 'bg-warning' };
  const labels = { up: 'Online', down: 'Offline', unreachable: 'Unreachable' };
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-medium text-fg">{name}</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${colors[status]}`} />
        <span className="text-[10px] text-fg-muted">{labels[status]}</span>
      </div>
    </div>
  );
}

// ─── API Keys ───────────────────────────────────────────────────────────────

const apiKeys = [
  { name: 'FAL_API_KEY', configured: true },
  { name: 'OPENAI_API_KEY', configured: true },
  { name: 'ANTHROPIC_API_KEY', configured: false },
  { name: 'GROQ_API_KEY', configured: true },
  { name: 'TOGETHER_API_KEY', configured: false },
];

// ─── Settings Page ──────────────────────────────────────────────────────────

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [darkMode, setDarkMode] = useState(true);

  // Real service health from API (fallback to demo data)
  const { data: servicesData } = useQuery({
    queryKey: ['services', 'health'],
    queryFn: checkAllServices,
    staleTime: 60_000,
    retry: 0,
  });

  const services = servicesData ?? demoServices;

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <div className="flex items-center gap-2 bg-surface/70 backdrop-blur-md rounded-md border border-border px-4 py-3">
        <Settings size={20} className="text-fg" />
        <h2 className="text-lg font-semibold text-fg">Settings</h2>
      </div>

      <div className="flex gap-4 flex-1">
        {/* Tab Sidebar */}
        <div className="w-48 bg-surface/70 backdrop-blur-md rounded-md border border-border p-2 space-y-0.5 shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors text-left ${
                activeTab === tab.id
                  ? 'bg-elevated/60 text-fg'
                  : 'text-fg-muted hover:text-fg hover:bg-elevated/30'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-surface/70 backdrop-blur-md rounded-md border border-border p-4">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold text-fg">General</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg">Theme</p>
                  <p className="text-xs text-fg-muted">Switch between dark and light mode</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-elevated/60 border border-border rounded-md text-sm text-fg hover:bg-elevated transition-colors"
                >
                  {darkMode ? <Moon size={14} /> : <Sun size={14} />}
                  {darkMode ? 'Dark' : 'Light'}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-fg">Language</p>
                  <p className="text-xs text-fg-muted">Select interface language</p>
                </div>
                <select className="bg-elevated/60 border border-border rounded-md px-3 py-1.5 text-sm text-fg focus:outline-none focus:border-fg-muted">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>Japanese</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'mcp' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-fg">MCP Servers</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-elevated/60 text-fg-muted text-left">
                    <th className="px-3 py-2 font-medium rounded-l">Name</th>
                    <th className="px-3 py-2 font-medium">Transport</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium rounded-r">URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mcpServers.map((server) => (
                    <tr key={server.name} className="hover:bg-elevated/30 transition-colors">
                      <td className="px-3 py-2 text-fg font-medium">{server.name}</td>
                      <td className="px-3 py-2">
                        <code className="text-xs bg-elevated/60 px-1.5 py-0.5 rounded text-fg-muted">{server.transport}</code>
                      </td>
                      <td className="px-3 py-2">
                        <Badge variant={server.status === 'up' ? 'success' : 'danger'}>{server.status}</Badge>
                      </td>
                      <td className="px-3 py-2 text-fg-muted font-mono text-xs">{server.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-fg">Service Health</h3>
              <div className="bg-elevated/30 rounded-md border border-border px-4 py-2 divide-y divide-border">
                {services.map((svc) => (
                  <ServiceStatusRow key={svc.name} name={svc.name} status={svc.status} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'api-keys' && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-fg">API Keys</h3>
              <p className="text-xs text-fg-muted">Keys are stored securely and never displayed in full.</p>
              <div className="space-y-3">
                {apiKeys.map((key) => (
                  <div key={key.name} className="flex items-center justify-between">
                    <label className="text-sm text-fg font-mono">{key.name}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        readOnly
                        value={key.configured ? '••••••••••••' : ''}
                        placeholder="not set"
                        className="w-48 bg-elevated/60 border border-border rounded-md px-3 py-1.5 text-sm text-fg-muted font-mono focus:outline-none"
                      />
                      <Badge variant={key.configured ? 'success' : 'warning'}>
                        {key.configured ? 'configured' : 'not set'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
