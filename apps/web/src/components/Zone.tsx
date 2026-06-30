// ─── Zone Container ─────────────────────────────────────────────────────────

import React, { useMemo, useState, useRef, useEffect } from 'react';
import type { Zone as ZoneData } from '@aigency-os/shared-types';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
import { Card } from './Card';
import { canEditZone, getZonePermissionLabel } from '../utils/permissions';
import { Badge } from '@aigency-os/ui';
import { Shield, Lock, Unlock, Move, Maximize2 } from 'lucide-react';

interface ZoneProps {
  zone: ZoneData;
  zoom: number;
  onCardMove?: (id: string, position: { x: number; y: number }) => void;
}

const ZONE_STYLES: Record<string, { border: string; headerText: string; icon: string; tint: string }> = {
  business: {
    border: 'border-amber/30',
    headerText: 'text-amber',
    icon: 'text-amber',
    tint: 'bg-amber/5',
  },
  engineering: {
    border: 'border-primary/30',
    headerText: 'text-primary',
    icon: 'text-primary',
    tint: 'bg-primary/5',
  },
  shared: {
    border: 'border-accent/30',
    headerText: 'text-accent',
    icon: 'text-accent',
    tint: 'bg-accent/5',
  },
};

const MIN_ZONE_WIDTH = 360;
const MIN_ZONE_HEIGHT = 240;

export const Zone = React.memo(function Zone({ zone, zoom, onCardMove }: ZoneProps) {
  const { cards, activeZone, setActiveZone, zoneLayouts, moveZone, resizeZone, createCard, pan } = useCanvasStore();
  const role = useAuthStore((s) => s.user?.role ?? 'domain_expert');

  const editable = canEditZone(role, zone.type);
  const permLabel = getZonePermissionLabel(role, zone.type);
  const styles = ZONE_STYLES[zone.type] || ZONE_STYLES.business;
  const layout = zoneLayouts[zone.id] || { x: 0, y: 0, width: 1200, height: 500 };
  const isActive = activeZone === zone.id;

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; zoneX: number; zoneY: number } | null>(null);
  const resizeStartRef = useRef<{ mouseX: number; mouseY: number; width: number; height: number } | null>(null);

  const zoneCards = useMemo(
    () => cards.filter((c) => c.zoneId === zone.id),
    [cards, zone.id],
  );

  // Drag handlers
  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (!editable || e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      zoneX: layout.x,
      zoneY: layout.y,
    };
  };

  // Resize handlers
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (!editable || e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    setHasDragged(false);
    resizeStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      width: layout.width,
      height: layout.height,
    };
  };

  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragStartRef.current) {
        const dx = (e.clientX - dragStartRef.current.mouseX) / zoom;
        const dy = (e.clientY - dragStartRef.current.mouseY) / zoom;
        if (Math.abs(dx) + Math.abs(dy) > 0) setHasDragged(true);
        moveZone(zone.id, {
          x: dragStartRef.current.zoneX + dx,
          y: dragStartRef.current.zoneY + dy,
        });
      }
      if (isResizing && resizeStartRef.current) {
        const dw = (e.clientX - resizeStartRef.current.mouseX) / zoom;
        const dh = (e.clientY - resizeStartRef.current.mouseY) / zoom;
        if (Math.abs(dw) + Math.abs(dh) > 0) setHasDragged(true);
        resizeZone(zone.id, {
          width: Math.max(MIN_ZONE_WIDTH, resizeStartRef.current.width + dw),
          height: Math.max(MIN_ZONE_HEIGHT, resizeStartRef.current.height + dh),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      dragStartRef.current = null;
      resizeStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, zoom, moveZone, resizeZone, zone.id]);

  const handleClick = () => {
    if (!hasDragged) setActiveZone(zone.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!editable || isDragging || isResizing) return;
    e.stopPropagation();

    // Canvas coordinate of the click
    const canvasX = (e.clientX - pan.x) / zoom;
    const canvasY = (e.clientY - pan.y) / zoom;

    // Position relative to zone, clamped inside
    const localX = Math.max(20, Math.min(layout.width - 280, canvasX - layout.x));
    const localY = Math.max(60, Math.min(layout.height - 160, canvasY - layout.y));

    createCard('text', zone.id, { x: localX, y: localY }, { title: 'New card', text: '' });
  };

  return (
    <div
      data-testid={`${zone.type}-zone`}
      data-readonly={!editable}
      className={`absolute rounded-md border-2 ${styles.border} ${styles.tint} bg-surface/40 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)] overflow-hidden transition-shadow duration-200
        ${isActive ? 'shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.06)]' : ''}
        ${isDragging ? 'cursor-grabbing z-30' : editable ? 'cursor-default' : 'cursor-default'}
      `}
      style={{
        left: layout.x,
        top: layout.y,
        width: layout.width,
        height: layout.height,
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* Zone header (drag handle) */}
      <div
        className={`flex items-center justify-between px-3 py-2 bg-elevated/40 backdrop-blur-sm border-b ${styles.border} ${editable ? 'cursor-grab active:cursor-grabbing' : ''}`}
        onMouseDown={handleHeaderMouseDown}
      >
        <div className="flex items-center gap-2 select-none">
          <Move size={14} className={`${styles.icon} opacity-70`} />
          <Shield size={14} className={styles.icon} />
          <h3 className={`text-sm font-bold uppercase tracking-wider ${styles.headerText}`}>
            {zone.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={editable ? 'success' : 'warning'}>
            <span className="flex items-center gap-1">
              {editable ? <Unlock size={10} /> : <Lock size={10} />}
              {permLabel}
            </span>
          </Badge>
        </div>
      </div>

      {/* Zone canvas area */}
      <div className="relative w-full" style={{ height: layout.height - 44 }}>
        {zoneCards.map((card) => (
          <Card
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

      {/* Resize handle */}
      {editable && (
        <div
          className="absolute bottom-1 right-1 p-1 cursor-nwse-resize text-fg-muted hover:text-fg transition-colors"
          onMouseDown={handleResizeMouseDown}
          title="Resize zone"
        >
          <Maximize2 size={12} />
        </div>
      )}
    </div>
  );
});
