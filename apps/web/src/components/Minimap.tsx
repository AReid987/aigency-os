// ─── Canvas Minimap ─────────────────────────────────────────────────────────

import React from 'react';
import type { Card, Zone } from '@vscp/shared-types';

interface MinimapProps {
  cards: Card[];
  zones: Zone[];
  zoom: number;
  panX: number;
  panY: number;
  viewportWidth: number;
  viewportHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  onNavigate?: (x: number, y: number) => void;
}

const MINIMAP_WIDTH = 180;
const MINIMAP_HEIGHT = 120;

const zoneColors: Record<string, string> = {
  business: '#fef3c7',
  engineering: '#dbeafe',
  shared: '#f3e8ff',
};

export const Minimap = React.memo(function Minimap({
  cards,
  zones,
  zoom,
  panX,
  panY,
  viewportWidth,
  viewportHeight,
  canvasWidth,
  canvasHeight,
  onNavigate,
}: MinimapProps) {
  const scaleX = MINIMAP_WIDTH / canvasWidth;
  const scaleY = MINIMAP_HEIGHT / canvasHeight;
  const scale = Math.min(scaleX, scaleY);

  // Viewport rectangle in minimap space
  const vpX = (-panX / zoom) * scale;
  const vpY = (-panY / zoom) * scale;
  const vpW = (viewportWidth / zoom) * scale;
  const vpH = (viewportHeight / zoom) * scale;

  // Zone positions (matching Zone.tsx layout)
  const zonePositions: Record<string, { x: number; y: number; w: number; h: number }> = {
    'zone-business-default': { x: 0, y: 0, w: 1200, h: 500 },
    'zone-engineering-default': { x: 0, y: 540, w: 1200, h: 500 },
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!onNavigate) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    // Navigate so the clicked point is centered in viewport
    const canvasX = mx / scale;
    const canvasY = my / scale;
    onNavigate(
      -(canvasX * zoom - viewportWidth / 2),
      -(canvasY * zoom - viewportHeight / 2),
    );
  };

  return (
    <div
      className="fixed bottom-4 right-4 bg-surface bg-elevated rounded-md shadow-md border border-border border-border overflow-hidden z-40"
      style={{ width: MINIMAP_WIDTH + 8, height: MINIMAP_HEIGHT + 8 }}
    >
      <div
        className="relative m-1 cursor-pointer"
        style={{ width: MINIMAP_WIDTH, height: MINIMAP_HEIGHT }}
        onClick={handleClick}
      >
        {/* Zone backgrounds */}
        {zones.map((zone) => {
          const pos = zonePositions[zone.id];
          if (!pos) return null;
          return (
            <div
              key={zone.id}
              className="absolute rounded-sm opacity-60"
              style={{
                left: pos.x * scale,
                top: pos.y * scale,
                width: pos.w * scale,
                height: pos.h * scale,
                backgroundColor: zoneColors[zone.type] || '#f3f4f6',
              }}
            />
          );
        })}

        {/* Cards as dots */}
        {cards.map((card) => (
          <div
            key={card.id}
            className="absolute rounded-sm bg-bg0 dark:bg-gray-400"
            style={{
              left: card.position.x * scale,
              top: card.position.y * scale,
              width: Math.max(card.size.width * scale, 3),
              height: Math.max(card.size.height * scale, 2),
            }}
          />
        ))}

        {/* Viewport rectangle */}
        <div
          className="absolute border-2 border-primary bg-primary/10 rounded-sm"
          style={{
            left: Math.max(0, vpX),
            top: Math.max(0, vpY),
            width: Math.min(vpW, MINIMAP_WIDTH),
            height: Math.min(vpH, MINIMAP_HEIGHT),
          }}
        />
      </div>

      {/* Zoom indicator */}
      <div className="absolute top-1 left-2 text-[9px] font-mono text-fg-muted text-fg-muted">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
});
