import React from 'react';

interface TerminalPreviewProps {
  agentName: string;
  sessionId: string;
  output?: string[];
}

export function TerminalPreview({ agentName, sessionId, output = [] }: TerminalPreviewProps) {
  return (
    <div className="rounded-md border border-border bg-surface/70 backdrop-blur-md text-fg overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-elevated/70 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-error" />
            <span className="h-3 w-3 rounded-full bg-warning" />
            <span className="h-3 w-3 rounded-full bg-success" />
          </div>
          <span className="text-xs text-fg-muted">{agentName}: {sessionId}</span>
        </div>
      </div>
      <div className="p-3 font-mono text-xs leading-relaxed h-48 overflow-auto">
        {output.length > 0 ? (
          output.map((line, i) => (
            <div key={i} className={line.startsWith('$') ? 'text-success' : 'text-fg-secondary'}>
              {line}
            </div>
          ))
        ) : (
          <div className="text-fg-muted">Waiting for output...</div>
        )}
        <span className="animate-pulse text-primary">▊</span>
      </div>
    </div>
  );
}
