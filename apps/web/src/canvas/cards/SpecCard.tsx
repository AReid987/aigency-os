import React, { useState } from 'react';
import type { Card } from '@aigency-os/shared-types';
import { FileCode, ChevronDown, ChevronRight } from 'lucide-react';

interface SpecCardProps {
  card: Card;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}

const DEFAULT_SECTIONS = [
  { title: 'Overview', content: 'Technical specification overview' },
  { title: 'Architecture', content: 'System architecture and component design' },
  { title: 'API Design', content: 'REST API endpoints and data contracts' },
  { title: 'Data Model', content: 'Database schema and relationships' },
  { title: 'Testing Strategy', content: 'Unit, integration, and E2E test plans' },
];

export const SpecCard = React.memo(function SpecCard({ card, editable, onUpdate }: SpecCardProps) {
  const rawContent = card.content as Record<string, unknown>;
  const title = typeof rawContent.title === 'string' ? rawContent.title : 'TECH-SPEC';
  const planId = typeof rawContent.planId === 'string' ? rawContent.planId : null;
  const sections = Array.isArray(rawContent.sections) ? rawContent.sections as Array<{ title: string; content: string }> : DEFAULT_SECTIONS;
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center gap-1.5">
        <FileCode size={14} className="text-info" />
        <span className="text-xs font-semibold text-fg">
          {title}
        </span>
      </div>

      {planId && (
        <div className="text-[10px] text-fg-muted">
          Plan: <span className="text-fg-secondary">{planId}</span>
        </div>
      )}

      <div className="space-y-1">
        {sections.map((section, i) => (
          <div key={i} className="border border-border rounded-sm">
            <button
              onClick={() => setExpanded(expanded === section.title ? null : section.title)}
              className="w-full flex items-center gap-1.5 px-2 py-1.5 text-left text-[11px] hover:bg-hover/40 transition-colors"
            >
              {expanded === section.title ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              <span className="font-medium text-fg-secondary">{section.title}</span>
            </button>
            {expanded === section.title && (
              <div className="px-2 pb-2 text-[10px] text-fg-muted border-t border-border/50">
                <p className="pt-1.5 whitespace-pre-wrap">{section.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});
