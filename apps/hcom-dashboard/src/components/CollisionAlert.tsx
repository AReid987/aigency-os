import React from 'react';
import type { Collision } from '@vscp/shared-types';

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
          className="flex items-center gap-3 p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
        >
          <span className="text-red-500 text-lg">⚠️</span>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Collision Detected
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              <strong>{collision.agent1}</strong> and <strong>{collision.agent2}</strong> both edited{' '}
              <code className="bg-red-100 dark:bg-red-800 px-1 rounded">{collision.filePath}</code>{' '}
              within 30s
            </p>
            <p className="text-xs text-fg-muted mt-1">
              {new Date(collision.timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => onResolve?.(collision.id)}
            className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Resolve
          </button>
        </div>
      ))}
    </div>
  );
}
