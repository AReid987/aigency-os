import { useState } from 'react';
import { Plus, Terminal as TerminalIcon, X } from 'lucide-react';

const WTERM_URL = import.meta.env.VITE_WTERM_URL;

export function TerminalPage() {
  const [tabs, setTabs] = useState([{ id: 1, label: 'Terminal 1' }]);
  const [activeTab, setActiveTab] = useState(1);

  const addTab = () => {
    const nextId = tabs.length + 1;
    setTabs([...tabs, { id: nextId, label: `Terminal ${nextId}` }]);
    setActiveTab(nextId);
  };

  const removeTab = (id: number) => {
    if (tabs.length === 1) return;
    const filtered = tabs.filter((t) => t.id !== id);
    setTabs(filtered);
    if (activeTab === id) setActiveTab(filtered[filtered.length - 1].id);
  };

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 bg-surface/70 backdrop-blur-md rounded-md border border-border px-2 py-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${
              activeTab === tab.id
                ? 'bg-elevated/60 text-fg'
                : 'text-fg-muted hover:text-fg hover:bg-elevated/30'
            }`}
          >
            <TerminalIcon size={14} />
            {tab.label}
            {tabs.length > 1 && (
              <X
                size={12}
                className="ml-1 opacity-50 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
              />
            )}
          </button>
        ))}
        <button
          onClick={addTab}
          className="p-1.5 rounded text-fg-muted hover:text-fg hover:bg-elevated/30 transition-colors"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Terminal Area */}
      <div className="flex-1 bg-surface/70 backdrop-blur-md rounded-md border border-border overflow-hidden">
        {WTERM_URL ? (
          <iframe
            src={`${WTERM_URL}?tab=${activeTab}`}
            className="w-full h-full border-0"
            title={`Terminal ${activeTab}`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-fg-muted">
            <TerminalIcon size={48} className="opacity-40" />
            <div className="text-center">
              <p className="text-lg text-fg">Terminal — connect via wterm at localhost:3000</p>
              <p className="text-sm mt-1">
                Set <code className="bg-elevated/60 px-1.5 py-0.5 rounded text-fg">VITE_WTERM_URL</code> to embed the terminal directly.
              </p>
            </div>
            <button
              onClick={() => window.open(WTERM_URL || 'http://localhost:3000', '_blank')}
              className="mt-2 px-4 py-2 bg-elevated/60 border border-border rounded-md text-fg hover:bg-elevated transition-colors text-sm"
            >
              Connect Terminal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
