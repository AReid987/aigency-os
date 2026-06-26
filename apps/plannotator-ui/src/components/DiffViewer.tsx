import React from 'react';

import { GitCompare, Plus, Minus, Equal } from 'lucide-react';

interface DiffViewerProps {
  plan: { id: string; title: string; version: number };
}

const DEMO_DIFF = [
  { type: 'keep' as const, line: '# Auth System Implementation', lineNum: 1 },
  { type: 'keep' as const, line: '', lineNum: 2 },
  { type: 'keep' as const, line: '## Business Requirements', lineNum: 3 },
  { type: 'keep' as const, line: '- JWT-based authentication', lineNum: 4 },
  { type: 'add' as const, line: '- OAuth2 social login (Google, GitHub)', lineNum: 5 },
  { type: 'keep' as const, line: '- Role-based access control', lineNum: 6 },
  { type: 'remove' as const, line: '- Session-based auth (deprecated)', lineNum: 7 },
  { type: 'keep' as const, line: '', lineNum: 8 },
  { type: 'keep' as const, line: '## Technical Architecture', lineNum: 9 },
  { type: 'add' as const, line: '- Fastify middleware with JWT + OAuth2', lineNum: 10 },
  { type: 'keep' as const, line: '- SQLite sessions store', lineNum: 11 },
  { type: 'modify' as const, line: '+ RBAC middleware with granular permissions', lineNum: 12, oldLine: '- RBAC middleware checks role permissions' },
  { type: 'keep' as const, line: '- Password hashing with bcrypt', lineNum: 13 },
  { type: 'add' as const, line: '- Rate limiting on auth endpoints', lineNum: 14 },
];

export function DiffViewer({ plan }: DiffViewerProps) {
  return (
    <div className="bg-surface/70 backdrop-blur-md rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] h-full overflow-auto">
      <div className="px-6 py-4 border-b border-border bg-elevated/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <GitCompare size={16} className="text-accent" />
          <h2 className="font-bold">Version Diff: v{plan.version - 1} → v{plan.version}</h2>
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-fg-muted">
          <span className="flex items-center gap-1"><Plus size={10} className="text-success" /> 4 additions</span>
          <span className="flex items-center gap-1"><Minus size={10} className="text-error" /> 1 removal</span>
          <span className="flex items-center gap-1"><Equal size={10} /> 1 modification</span>
        </div>
      </div>

      <div className="font-mono text-xs">
        {DEMO_DIFF.map((line, i) => (
          <div
            key={i}
            className={`flex items-stretch border-b border-border/50 ${
              line.type === 'add' ? 'bg-success/8' :
              line.type === 'remove' ? 'bg-error/8' :
              line.type === 'modify' ? 'bg-warning/8' :
              ''
            }`}
          >
            <span className="w-12 px-2 py-1.5 text-right text-fg-muted border-r border-border/50 select-none shrink-0">
              {line.lineNum}
            </span>
            <span className={`w-6 py-1.5 text-center shrink-0 ${
              line.type === 'add' ? 'text-success' :
              line.type === 'remove' ? 'text-error' :
              line.type === 'modify' ? 'text-warning' :
              'text-fg-muted'
            }`}>
              {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : line.type === 'modify' ? '~' : ' '}
            </span>
            <span className={`py-1.5 px-2 flex-1 ${
              line.type === 'remove' ? 'line-through text-fg-muted' : 'text-fg-secondary'
            }`}>
              {line.line}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
