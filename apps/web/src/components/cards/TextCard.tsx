// ─── Text Card Component ─────────────────────────────────────────────────────

import React from 'react';
import type { Card } from '@aigency-os/shared-types';
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
          className="w-full text-sm font-semibold bg-transparent border-b border-border border-border-hover focus:outline-none focus:border-primary px-0 py-1"
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
          className="w-full text-xs bg-transparent border border-border rounded p-1.5 focus:outline-none focus:border-primary resize-none"
          rows={4}
          defaultValue={content.text || ''}
          onBlur={(e) => onUpdate({ text: e.target.value })}
        />
        <button
          className="text-xs text-primary hover:underline"
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
        <FileText size={14} className="text-primary-light" />
        <h4 className="text-sm font-semibold text-fg truncate">
          {content.title || 'Untitled'}
        </h4>
      </div>
      <p className="text-xs text-fg-secondary leading-relaxed">
        {content.text || 'Double-click to edit...'}
      </p>
    </div>
  );
});
