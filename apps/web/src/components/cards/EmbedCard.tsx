// ─── Embed Card Component ─────────────────────────────────────────────────────

import React from 'react';
import type { Card } from '@vscp/shared-types';
import { Code, AlertTriangle } from 'lucide-react';

interface EmbedCardProps {
  card: Card;
  isEditing: boolean;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
  onEditDone: () => void;
}

export const EmbedCard = React.memo(function EmbedCard({
  card,
  isEditing,
  editable,
  onUpdate,
  onEditDone,
}: EmbedCardProps) {
  const content = card.content as Record<string, string>;

  if (isEditing && editable) {
    return (
      <div className="space-y-2 p-3">
        <input
          autoFocus
          className="w-full text-sm font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 px-0 py-1"
          defaultValue={content.title || ''}
          placeholder="Embed title"
          onBlur={(e) => onUpdate({ title: e.target.value })}
        />
        <input
          className="w-full text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded p-1.5 focus:outline-none focus:border-blue-500"
          defaultValue={content.src || ''}
          placeholder="https://... (iframe URL)"
          onBlur={(e) => onUpdate({ src: e.target.value })}
        />
        <div className="flex items-center gap-1.5 text-[10px] text-amber-600 dark:text-amber-400">
          <AlertTriangle size={10} />
          <span>Only embed trusted URLs</span>
        </div>
        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={onEditDone}
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center gap-1.5 mb-1.5 px-1">
        <Code size={14} className="text-orange-500" />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
          {content.title || 'Embed'}
        </span>
      </div>
      {content.src ? (
        <iframe
          src={content.src}
          className="w-full rounded border border-gray-200 dark:border-gray-700"
          style={{ height: 'calc(100% - 28px)', minHeight: 160 }}
          sandbox="allow-scripts allow-same-origin"
          title={content.title || 'Embedded content'}
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center gap-2">
          <Code size={20} className="text-gray-400" />
          <span className="text-xs text-gray-400">Double-click to configure</span>
        </div>
      )}
    </div>
  );
});
