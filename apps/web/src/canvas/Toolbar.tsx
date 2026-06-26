// ─── Floating Toolbar ───────────────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import type { CardType, ZoneType } from '@vscp/shared-types';
import { useCanvasStore } from '../stores/canvasStore';
import { useUserStore } from '../stores/userStore';
import { Button } from '@vscp/ui';
import {
  Plus,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Code,
  LayoutGrid,
  X,
  DollarSign,
  Shield,
  FileCode,
} from 'lucide-react';

interface ToolbarProps {
  onAddCard?: (type: CardType, zoneId: string) => void;
}

const CARD_TYPES: { type: CardType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text', icon: <FileText size={16} /> },
  { type: 'image', label: 'Image', icon: <ImageIcon size={16} /> },
  { type: 'link', label: 'Link', icon: <ExternalLink size={16} /> },
  { type: 'embed', label: 'Embed', icon: <Code size={16} /> },
  { type: 'bmc', label: 'Business Canvas', icon: <LayoutGrid size={16} className="text-primary" /> },
  { type: 'revenue', label: 'Revenue Calc', icon: <DollarSign size={16} className="text-success" /> },
  { type: 'gate', label: 'Milestone Gate', icon: <Shield size={16} className="text-accent" /> },
  { type: 'spec', label: 'TECH-SPEC', icon: <FileCode size={16} className="text-info" /> },
];

export function Toolbar({ onAddCard }: ToolbarProps) {
  const [expanded, setExpanded] = useState(false);
  const { zones, createCard, createZone, pan, zoom } = useCanvasStore();
  const { role } = useUserStore();

  const handleAddCard = useCallback(
    (type: CardType) => {
      // Find the first editable zone, or default to business
      const editableZone =
        zones.find((z) => {
          if (role === 'technical_founder') return true;
          if (role === 'domain_expert') return z.type === 'business' || z.type === 'shared';
          return false;
        }) || zones[0];

      if (!editableZone) return;

      // Place new card at center of current viewport
      const centerX = (-pan.x / zoom + 400) + Math.random() * 100;
      const centerY = (-pan.y / zoom + 300) + Math.random() * 100;

      createCard(type, editableZone.id, { x: centerX, y: centerY });
      onAddCard?.(type, editableZone.id);
      setExpanded(false);
    },
    [zones, role, pan, zoom, createCard, onAddCard],
  );

  const handleAddZone = useCallback(
    (type: ZoneType) => {
      const name = type === 'business' ? 'New Business Zone' : type === 'engineering' ? 'New Engineering Zone' : 'Shared Zone';
      createZone(type, name, { x: 0, y: 0 });
      setExpanded(false);
    },
    [createZone],
  );

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-surface/70 backdrop-blur-md rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] border border-border p-1.5 flex items-center gap-1">
        {/* Add Card button */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 rounded-md"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <X size={16} /> : <Plus size={16} />}
            <span className="text-xs font-medium">Card</span>
          </Button>

          {/* Card type dropdown */}
          {expanded && (
            <div className="absolute bottom-full left-0 mb-2 bg-surface/70 backdrop-blur-md rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] border border-border p-2 min-w-[160px]">
              <p className="text-[10px] uppercase tracking-wider text-fg-muted px-2 mb-1.5 font-medium">
                Add Card
              </p>
              {CARD_TYPES.map(({ type, label, icon }) => (
                <button
                  key={type}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-hover/60 text-fg-secondary transition-colors"
                  onClick={() => handleAddCard(type)}
                >
                  {icon}
                  {label}
                </button>
              ))}

              <div className="border-t border-border my-1.5" />

              <p className="text-[10px] uppercase tracking-wider text-fg-muted px-2 mb-1.5 font-medium">
                Add Zone
              </p>
              <button
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-hover/60 text-fg-secondary transition-colors"
                onClick={() => handleAddZone('business')}
              >
                <LayoutGrid size={16} className="text-amber" />
                Business Zone
              </button>
              <button
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-hover/60 text-fg-secondary transition-colors"
                onClick={() => handleAddZone('engineering')}
              >
                <LayoutGrid size={16} className="text-primary" />
                Engineering Zone
              </button>
            </div>
          )}
        </div>

        {/* Quick action: add zone */}
        <div className="w-px h-6 bg-border" />
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 rounded-md"
          onClick={() => handleAddZone('business')}
        >
          <LayoutGrid size={14} />
          <span className="text-xs font-medium">Zone</span>
        </Button>
      </div>
    </div>
  );
}
