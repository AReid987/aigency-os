import React from 'react';
import { EmbedShell, getEmbedConfig, registerEmbed } from './components/EmbedShell';

// Re-export for use by other packages
export { EmbedShell, getEmbedConfig, registerEmbed };
export type { EmbedConfig } from './components/EmbedShell';

export default function App() {
  const embedConfig = getEmbedConfig('paperclip');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Embed Shell</h1>
        <p className="text-gray-500 text-sm">Micro-frontend sandbox for Aigency OS service UIs</p>
      </header>

      {embedConfig ? (
        <EmbedShell
          config={embedConfig}
          onMessage={(data) => console.log('[EmbedShell] Received:', data)}
        />
      ) : (
        <div className="text-center text-gray-400 py-12">
          No embeds registered. Use <code>registerEmbed()</code> to add one.
        </div>
      )}
    </div>
  );
}
