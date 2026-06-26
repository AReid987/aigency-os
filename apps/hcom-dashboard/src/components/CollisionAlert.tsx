import React from 'react';
import type { Collision } from '@vscp/shared-types';
import { AlertTriangle } from 'lucide-react';

interface CollisionAlertProps {
  collisions: Collision[];
  onResolve?: (id: string) => void;
}

export function CollisionAlert({ collisions, onResolve }: CollisionAlertProps) {
  const unresolved = collisions.filter((c) => !c.resolved);

  if (unresolved.length === 0) return null;

  return (
    <div className="space-y-2">
      {unresolved.map((collision) => (
        <div
          key={collision.id}
          className="flex items-center gap-3 p-3 rounded-md bg-error-muted border border-error/30 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
        >
          <AlertTriangle size={20} className="text-error shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-fg">
              Collision detected
            </p>
            <p className="text-xs text-fg-secondary">
              <strong>{collision.agent1}</strong> and <strong>{collision.agent2}</strong> both edited{' '}
              <code className="bg-error/20 px-1 rounded">{collision.filePath}</code>{' '}
              within 30s
            </p>
            <p className="text-xs text-fg-muted mt-1">
              {new Date(collision.timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => onResolve?.(collision.id)}
            className="px-3 py-1 text-xs rounded-md bg-error text-fg-inverse hover:bg-error/80 transition-colors"
          >
            Resolve
          </button>
        </div>
      ))}
    </div>
  );
}
