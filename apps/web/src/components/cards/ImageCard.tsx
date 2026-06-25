// ─── Image Card Component ─────────────────────────────────────────────────────

import React from 'react';
import type { Card } from '@vscp/shared-types';
import { Image as ImageIcon } from 'lucide-react';

interface ImageCardProps {
  card: Card;
  isEditing: boolean;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
  onEditDone: () => void;
}

export const ImageCard = React.memo(function ImageCard({
  card,
  isEditing,
  editable,
  onUpdate,
  onEditDone,
}: ImageCardProps) {
  const content = card.content as Record<string, string>;

  if (isEditing && editable) {
    return (
      <div className="space-y-2 p-3">
        <input
          autoFocus
          className="w-full text-sm font-semibold bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none focus:border-blue-500 px-0 py-1"
          defaultValue={content.title || ''}
          placeholder="Image title"
          onBlur={(e) => onUpdate({ title: e.target.value })}
        />
        <input
          className="w-full text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded p-1.5 focus:outline-none focus:border-blue-500"
          defaultValue={content.src || ''}
          placeholder="Image URL"
          onBlur={(e) => onUpdate({ src: e.target.value })}
        />
        <input
          className="w-full text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded p-1.5 focus:outline-none focus:border-blue-500"
          defaultValue={content.caption || ''}
          placeholder="Caption (optional)"
          onBlur={(e) => onUpdate({ caption: e.target.value })}
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
    <div className="p-2">
      {content.src ? (
        <img
          src={content.src}
          alt={content.alt || 'Card image'}
          className="w-full h-32 object-cover rounded"
        />
      ) : (
        <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
          <ImageIcon size={24} className="text-gray-400" />
        </div>
      )}
      {content.title && (
        <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mt-1.5 px-1">
          {content.title}
        </p>
      )}
      {content.caption && (
        <p className="text-xs text-gray-500 mt-0.5 px-1">{content.caption}</p>
      )}
    </div>
  );
});
