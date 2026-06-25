import React from 'react';

interface TerminalPreviewProps {
  agentName: string;
  sessionId: string;
  output?: string[];
}

export function TerminalPreview({ agentName, sessionId, output = [] }: TerminalPreviewProps) {
  return (
    <div className="rounded-md border bg-bg text-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-elevated border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-500" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <span className="text-xs text-fg-muted">{agentName}: {sessionId}</span>
        </div>
      </div>
      <div className="p-3 font-mono text-xs leading-relaxed h-48 overflow-auto">
        {output.length > 0 ? (
          output.map((line, i) => (
            <div key={i} className={line.startsWith('$') ? 'text-green-400' : 'text-fg-secondary'}>
              {line}
            </div>
          ))
        ) : (
          <div className="text-fg-muted">Waiting for output...</div>
        )}
        <span className="animate-pulse">▊</span>
      </div>
    </div>
  );
}
