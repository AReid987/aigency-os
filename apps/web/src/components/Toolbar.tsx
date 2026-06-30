// ─── Floating Toolbar ───────────────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import type { CardType, ZoneType } from '@aigency-os/shared-types';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
import { Button } from '@aigency-os/ui';
import {
  Plus,
  Minus,
  RotateCcw,
  FileText,
  Image as ImageIcon,
  ExternalLink,
  Code,
  LayoutGrid,
  X,
} from 'lucide-react';

interface ToolbarProps {
  onAddCard?: (type: CardType, zoneId: string) => void;
}

const CARD_TYPES: { type: CardType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text', icon: <FileText size={16} /> },
  { type: 'image', label: 'Image', icon: <ImageIcon size={16} /> },
  { type: 'link', label: 'Link', icon: <ExternalLink size={16} /> },
  { type: 'embed', label: 'Embed', icon: <Code size={16} /> },
];

export function Toolbar({ onAddCard }: ToolbarProps) {
  const [expanded, setExpanded] = useState(false);
  const { zones, zoneLayouts, createCard, createZone, zoom, setZoom, setPan } = useCanvasStore();
  const role = useAuthStore((s) => s.user?.role ?? 'domain_expert');

  const handleAddCard = useCallback(
    (type: CardType) => {
      // Find the first editable zone
      const editableZone =
        zones.find((z) => {
          if (role === 'technical_founder') return true;
          if (role === 'domain_expert') return z.type === 'business' || z.type === 'shared';
          return false;
        }) || zones[0];

      if (!editableZone) return;

      // Place new card inside the editable zone so it's always visible
      const layout = zoneLayouts[editableZone.id] || { width: 1200, height: 500 };
      const localX = Math.min(80 + Math.random() * 200, layout.width - 300);
      const localY = Math.min(80 + Math.random() * 120, layout.height - 200);

      createCard(type, editableZone.id, { x: localX, y: localY });
      onAddCard?.(type, editableZone.id);
      setExpanded(false);
    },
    [zones, zoneLayouts, role, createCard, onAddCard],
  );

  const handleAddZone = useCallback(
    (type: ZoneType) => {
      const name =
        type === 'business'
          ? 'New Business Zone'
          : type === 'engineering'
            ? 'New Engineering Zone'
            : 'Shared Zone';
      createZone(type, name, { x: 0, y: 0 });
      setExpanded(false);
    },
    [createZone],
  );

  const handleZoomIn = useCallback(() => {
    setZoom(Math.min(zoom * 1.2, 3));
  }, [zoom, setZoom]);

  const handleZoomOut = useCallback(() => {
    setZoom(Math.max(zoom / 1.2, 0.1));
  }, [zoom, setZoom]);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [setZoom, setPan]);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <div className="bg-surface/70 backdrop-blur-md rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] border border-border p-1.5 flex items-center gap-1">
        {/* Add Card button with dropdown */}
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

          {/* Card type + zone dropdown */}
          {expanded && (
            <div className="absolute bottom-full left-0 mb-2 bg-surface/70 backdrop-blur-md rounded-md shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)] border border-border p-2 min-w-[160px]">
              <p className="text-[11px] font-semibold text-fg-muted px-2 mb-1.5">
                Add card
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

              <p className="text-[11px] font-semibold text-fg-muted px-2 mb-1.5">
                Add zone
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

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Quick add zone */}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 rounded-md"
          onClick={() => handleAddZone('business')}
        >
          <LayoutGrid size={14} />
          <span className="text-xs font-medium">Zone</span>
        </Button>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* Zoom controls */}
        <Button
          variant="ghost"
          size="sm"
          className="rounded-md px-2"
          onClick={handleZoomOut}
          aria-label="Zoom out"
        >
          <Minus size={14} />
        </Button>

        <span className="text-[10px] font-mono text-fg-muted w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-md px-2"
          onClick={handleZoomIn}
          aria-label="Zoom in"
        >
          <Plus size={14} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="rounded-md px-2"
          onClick={handleResetView}
          aria-label="Reset view"
          title="Reset view (Ctrl+0)"
        >
          <RotateCcw size={14} />
        </Button>
      </div>
    </div>
  );
}
