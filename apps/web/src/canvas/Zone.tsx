// ─── Zone Container — Draggable, Resizable, Scrollable ──────────────────────

import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import type { Zone as ZoneType } from '@vscp/shared-types';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
import { CanvasCard } from './Card';
import { canEditZone, getZonePermissionLabel } from '../utils/permissions';
import { Badge } from '@vscp/ui';
import { Shield, Lock, Unlock, GripHorizontal } from 'lucide-react';

interface ZoneProps {
  zone: ZoneType;
  zoom: number;
  onCardMove?: (id: string, position: { x: number; y: number }) => void;
}

const ZONE_STYLES: Record<string, { border: string; headerText: string; icon: string; headerBg: string }> = {
  business: {
    border: 'border-amber/30',
    headerText: 'text-amber',
    icon: 'text-amber',
    headerBg: 'bg-amber/5',
  },
  engineering: {
    border: 'border-primary/30',
    headerText: 'text-primary',
    icon: 'text-primary',
    headerBg: 'bg-primary/5',
  },
  shared: {
    border: 'border-accent/30',
    headerText: 'text-accent',
    icon: 'text-accent',
    headerBg: 'bg-accent/5',
  },
};

// ─── Resize Handle ──────────────────────────────────────────────────────────

function ResizeHandle({
  position,
  onResize,
}: {
  position: 'se' | 'e' | 's';
  onResize: (dx: number, dy: number) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const startRef = useRef<{ x: number; y: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!startRef.current) return;
      const dx = (e.clientX - startRef.current.x);
      const dy = (e.clientY - startRef.current.y);
      startRef.current = { x: e.clientX, y: e.clientY };
      onResize(dx, dy);
    };

    const handleMouseUp = () => {
      setDragging(false);
      startRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, onResize]);

  const positionStyles: Record<string, string> = {
    se: 'bottom-0 right-0 w-4 h-4 cursor-se-resize',
    e: 'top-12 right-0 w-2 h-8 cursor-e-resize -translate-y-1/2',
    s: 'bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 cursor-s-resize',
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`absolute z-20 ${positionStyles[position]} ${dragging ? 'bg-primary/20' : 'hover:bg-primary/10'} rounded-sm transition-colors`}
    />
  );
}

// ─── Zone Component ─────────────────────────────────────────────────────────

export const Zone = React.memo(function Zone({ zone, zoom, onCardMove }: ZoneProps) {
  const { cards, activeZone, setActiveZone, moveZone, resizeZone, zoneLayouts } = useCanvasStore();
  const role = useAuthStore((s) => s.user?.role ?? 'domain_expert');

  const editable = canEditZone(role, zone.type);
  const permLabel = getZonePermissionLabel(role, zone.type);
  const styles = ZONE_STYLES[zone.type] || ZONE_STYLES.business;
  const zoneLayout = zoneLayouts[zone.id] || { x: 0, y: 0, width: 1200, height: 500 };
  const isActive = activeZone === zone.id;

  // Cards belonging to this zone
  const zoneCards = useMemo(
    () => cards.filter((c) => c.zoneId === zone.id),
    [cards, zone.id],
  );

  // ── Drag to move zone (via header) ──────────────────────────────────────

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; zoneX: number; zoneY: number } | null>(null);

  const handleHeaderMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!editable) return;
      if ((e.target as HTMLElement).closest('[data-no-drag]')) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        zoneX: zoneLayout.x,
        zoneY: zoneLayout.y,
      };
    },
    [editable, zoneLayout.x, zoneLayout.y],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;
      const dx = (e.clientX - dragStartRef.current.mouseX) / zoom;
      const dy = (e.clientY - dragStartRef.current.mouseY) / zoom;
      moveZone(zone.id, {
        x: Math.round(dragStartRef.current.zoneX + dx),
        y: Math.round(dragStartRef.current.zoneY + dy),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, zoom, zone.id, moveZone]);

  // ── Resize handlers ─────────────────────────────────────────────────────

  const handleResizeSE = useCallback(
    (dx: number, dy: number) => {
      resizeZone(zone.id, {
        width: Math.max(400, zoneLayout.width + dx / zoom),
        height: Math.max(200, zoneLayout.height + dy / zoom),
      });
    },
    [zone.id, zoneLayout.width, zoneLayout.height, zoom, resizeZone],
  );

  const handleResizeE = useCallback(
    (dx: number) => {
      resizeZone(zone.id, {
        width: Math.max(400, zoneLayout.width + dx / zoom),
        height: zoneLayout.height,
      });
    },
    [zone.id, zoneLayout.width, zoneLayout.height, zoom, resizeZone],
  );

  const handleResizeS = useCallback(
    (_dx: number, dy: number) => {
      resizeZone(zone.id, {
        width: zoneLayout.width,
        height: Math.max(200, zoneLayout.height + dy / zoom),
      });
    },
    [zone.id, zoneLayout.width, zoneLayout.height, zoom, resizeZone],
  );

  // ── Compute content bounds for auto-sizing scroll area ──────────────────

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(zoneLayout.height - 44);

  useEffect(() => {
    if (!contentRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContentHeight(entry.target.scrollHeight);
      }
    });
    observer.observe(contentRef.current);
    return () => observer.disconnect();
  }, [zoneCards.length]);

  const needsScroll = contentHeight > zoneLayout.height - 44;

  return (
    <div
      data-testid={`${zone.type}-zone`}
      data-readonly={!editable}
      className={`absolute rounded-md border-2 ${styles.border} bg-surface/70 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] transition-all duration-200
        ${isActive ? 'shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]' : 'shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]'}
        ${isDragging ? 'z-50 opacity-90' : ''}
      `}
      style={{
        left: zoneLayout.x,
        top: zoneLayout.y,
        width: zoneLayout.width,
        height: zoneLayout.height,
      }}
      onClick={() => setActiveZone(zone.id)}
    >
      {/* Zone header — drag handle */}
      <div
        onMouseDown={handleHeaderMouseDown}
        className={`flex items-center justify-between px-4 py-2.5 backdrop-blur-sm border-b ${styles.border} ${styles.headerBg}
          ${editable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
        `}
      >
        <div className="flex items-center gap-2">
          {editable && <GripHorizontal size={14} className="text-fg-muted opacity-50" />}
          <Shield size={16} className={styles.icon} />
          <h3 className={`text-sm font-bold uppercase tracking-wider ${styles.headerText}`}>
            {zone.name}
          </h3>
          {zoneCards.length > 0 && (
            <span className="text-[10px] text-fg-muted font-mono bg-hover/60 px-1.5 py-0.5 rounded">
              {zoneCards.length} card{zoneCards.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2" data-no-drag>
          <Badge variant={editable ? 'success' : 'warning'}>
            <span className="flex items-center gap-1">
              {editable ? <Unlock size={10} /> : <Lock size={10} />}
              {permLabel}
            </span>
          </Badge>
        </div>
      </div>

      {/* Zone canvas area — scrollable when content overflows */}
      <div
        ref={contentRef}
        className="relative w-full"
        style={{
          height: zoneLayout.height - 44,
          overflow: needsScroll ? 'auto' : 'hidden',
        }}
      >
        {/* Inner wrapper that expands to fit all cards + margin */}
        <div
          className="relative"
          style={{
            minHeight: needsScroll ? contentHeight + 80 : '100%',
            minWidth: '100%',
          }}
        >
          {zoneCards.map((card) => (
            <CanvasCard
              key={card.id}
              card={card}
              zoneType={zone.type}
              zoom={zoom}
              onCardMove={onCardMove}
            />
          ))}

          {/* Empty state */}
          {zoneCards.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-sm text-fg-muted">
                {editable ? 'Double-click or use toolbar to add cards' : 'No cards yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resize handles — only for editable zones */}
      {editable && (
        <>
          <ResizeHandle position="se" onResize={handleResizeSE} />
          <ResizeHandle position="e" onResize={handleResizeE} />
          <ResizeHandle position="s" onResize={handleResizeS} />
        </>
      )}
    </div>
  );
});
