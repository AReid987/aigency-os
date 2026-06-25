// ─── Zone Container ─────────────────────────────────────────────────────────

import React, { useMemo } from 'react';
import type { Zone as ZoneData } from '@vscp/shared-types';
import { useCanvasStore } from '../stores/canvasStore';
import { useUserStore } from '../stores/userStore';
import { Card } from './Card';
import { canEditZone, getZonePermissionLabel } from '../utils/permissions';
import { Badge } from '@vscp/ui';
import { Shield, Lock, Unlock } from 'lucide-react';

interface ZoneProps {
  zone: ZoneData;
  zoom: number;
  onCardMove?: (id: string, position: { x: number; y: number }) => void;
}

// Zone positions in canvas space
const ZONE_POSITIONS: Record<string, { x: number; y: number; width: number; height: number }> = {
  'zone-business-default': { x: 0, y: 0, width: 1200, height: 500 },
  'zone-engineering-default': { x: 0, y: 540, width: 1200, height: 500 },
};

const ZONE_STYLES: Record<string, { bg: string; border: string; headerBg: string; headerText: string }> = {
  business: {
    bg: 'bg-[#fef3c7]',
    border: 'border-amber-300',
    headerBg: 'bg-amber-100',
    headerText: 'text-amber-900',
  },
  engineering: {
    bg: 'bg-[#dbeafe]',
    border: 'border-blue-300',
    headerBg: 'bg-blue-100',
    headerText: 'text-blue-900',
  },
  shared: {
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    headerBg: 'bg-purple-100',
    headerText: 'text-purple-900',
  },
};

export const Zone = React.memo(function Zone({ zone, zoom, onCardMove }: ZoneProps) {
  const { cards, activeZone, setActiveZone } = useCanvasStore();
  const { role } = useUserStore();

  const editable = canEditZone(role, zone.type);
  const permLabel = getZonePermissionLabel(role, zone.type);
  const styles = ZONE_STYLES[zone.type] || ZONE_STYLES.business;
  const zonePos = ZONE_POSITIONS[zone.id] || { x: 0, y: 0, width: 1200, height: 500 };
  const isActive = activeZone === zone.id;

  // Cards belonging to this zone
  const zoneCards = useMemo(
    () => cards.filter((c) => c.zoneId === zone.id),
    [cards, zone.id],
  );

  return (
    <div
      data-testid={`${zone.type}-zone`}
      data-readonly={!editable}
      className={`absolute rounded-md border-2 ${styles.border} ${styles.bg} overflow-hidden transition-all duration-200
        ${isActive ? 'shadow-md' : 'shadow-sm'}
      `}
      style={{
        left: zonePos.x,
        top: zonePos.y,
        width: zonePos.width,
        height: zonePos.height,
      }}
      onClick={() => setActiveZone(zone.id)}
    >
      {/* Zone header */}
      <div
        className={`flex items-center justify-between px-4 py-2.5 ${styles.headerBg} border-b ${styles.border}`}
      >
        <div className="flex items-center gap-2">
          <Shield size={16} className={styles.headerText} />
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
      <div className="relative w-full" style={{ height: zonePos.height - 44 }}>
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
            <p className="text-sm text-fg-muted text-fg-muted">
              {editable ? 'Double-click or use toolbar to add cards' : 'No cards yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});
