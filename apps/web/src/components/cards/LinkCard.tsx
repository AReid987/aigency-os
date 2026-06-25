// ─── Link Card Component ──────────────────────────────────────────────────────

import React from 'react';
import type { Card } from '@vscp/shared-types';
import { ExternalLink, Globe } from 'lucide-react';

interface LinkCardProps {
  card: Card;
  isEditing: boolean;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
  onEditDone: () => void;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
}

export const LinkCard = React.memo(function LinkCard({
  card,
  isEditing,
  editable,
  onUpdate,
  onEditDone,
}: LinkCardProps) {
  const content = card.content as Record<string, string>;

  if (isEditing && editable) {
    return (
      <div className="space-y-2 p-3">
        <input
          autoFocus
          className="w-full text-sm font-semibold bg-transparent border-b border-border border-border-hover focus:outline-none focus:border-primary px-0 py-1"
          defaultValue={content.title || ''}
          placeholder="Link title"
          onBlur={(e) => onUpdate({ title: e.target.value })}
        />
        <input
          className="w-full text-xs bg-transparent border border-border border-border rounded p-1.5 focus:outline-none focus:border-primary"
          defaultValue={content.url || ''}
          placeholder="https://..."
          onBlur={(e) => onUpdate({ url: e.target.value })}
        />
        <textarea
          className="w-full text-xs bg-transparent border border-border border-border rounded p-1.5 focus:outline-none focus:border-primary resize-none"
          rows={2}
          defaultValue={content.description || ''}
          placeholder="Description (optional)"
          onBlur={(e) => onUpdate({ description: e.target.value })}
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
      <div className="flex items-start gap-2">
        <div className="shrink-0 mt-0.5">
          {content.url ? (
            <img
              src={getFaviconUrl(content.url)}
              alt=""
              className="w-4 h-4 rounded-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <Globe size={16} className="text-purple-500" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-fg text-fg truncate">
            {content.title || 'Link'}
          </h4>
          {content.url && (
            <a
              href={content.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-600 dark:text-purple-400 hover:underline truncate flex items-center gap-1 mt-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={10} />
              {getDomain(content.url)}
            </a>
          )}
          {content.description && (
            <p className="text-xs text-fg-muted text-fg-muted mt-1.5 leading-relaxed">
              {content.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});
