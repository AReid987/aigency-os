import React from 'react';
import type { Card } from '@vscp/shared-types';
import { LayoutGrid } from 'lucide-react';

interface BMCCardProps {
  card: Card;
  isEditing: boolean;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
  onEditDone: () => void;
}

const BMC_SECTIONS = [
  { key: 'partners', label: 'Key Partners', color: 'text-accent' },
  { key: 'activities', label: 'Key Activities', color: 'text-accent' },
  { key: 'resources', label: 'Key Resources', color: 'text-accent' },
  { key: 'value', label: 'Value Propositions', color: 'text-primary' },
  { key: 'relationships', label: 'Customer Relationships', color: 'text-amber' },
  { key: 'channels', label: 'Channels', color: 'text-amber' },
  { key: 'segments', label: 'Customer Segments', color: 'text-amber' },
  { key: 'cost', label: 'Cost Structure', color: 'text-error' },
  { key: 'revenue', label: 'Revenue Streams', color: 'text-success' },
];

export const BMCCard = React.memo(function BMCCard({ card, editable, onUpdate }: BMCCardProps) {
  const content = card.content as Record<string, string>;

  const handleCellEdit = (key: string, value: string) => {
    onUpdate({ [key]: value });
  };

  return (
    <div className="p-2">
      <div className="flex items-center gap-1.5 mb-2 px-1">
        <LayoutGrid size={14} className="text-primary" />
        <span className="text-xs font-semibold text-fg">
          {content.title || 'Business Model Canvas'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1 text-[9px]">
        {BMC_SECTIONS.map((section) => (
          <div
            key={section.key}
            className="p-1.5 rounded border border-border bg-hover/30 min-h-[40px]"
          >
            <p className={`font-semibold ${section.color} mb-0.5`}>{section.label}</p>
            {editable ? (
              <textarea
                className="w-full bg-transparent text-fg-muted resize-none focus:outline-none text-[9px]"
                rows={2}
                defaultValue={content[section.key] || ''}
                onBlur={(e) => handleCellEdit(section.key, e.target.value)}
                placeholder="..."
              />
            ) : (
              <p className="text-fg-muted">{content[section.key] || '—'}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
