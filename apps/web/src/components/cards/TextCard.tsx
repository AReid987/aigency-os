// ─── Text Card Component ─────────────────────────────────────────────────────

import React from 'react';
import type { Card } from '@vscp/shared-types';
import { FileText } from 'lucide-react';

interface TextCardProps {
  card: Card;
  isEditing: boolean;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
  onEditDone: () => void;
}

export const TextCard = React.memo(function TextCard({
  card,
  isEditing,
  editable,
  onUpdate,
  onEditDone,
}: TextCardProps) {
  const content = card.content as Record<string, string>;

  if (isEditing && editable) {
    return (
      <div className="space-y-2 p-3">
        <input
          autoFocus
          className="w-full text-sm font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 px-0 py-1"
          defaultValue={content.title || ''}
          onBlur={(e) => {
            onUpdate({ title: e.target.value });
            onEditDone();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onUpdate({ title: (e.target as HTMLInputElement).value });
              onEditDone();
            }
          }}
        />
        <textarea
          className="w-full text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded p-1.5 focus:outline-none focus:border-blue-500 resize-none"
          rows={4}
          defaultValue={content.text || ''}
          onBlur={(e) => onUpdate({ text: e.target.value })}
        />
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
    <div className="p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <FileText size={14} className="text-blue-400" />
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
          {content.title || 'Untitled'}
        </h4>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
        {content.text || 'Double-click to edit...'}
      </p>
    </div>
  );
});
