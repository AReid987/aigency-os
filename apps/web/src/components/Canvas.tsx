// ─── Infinite Canvas Container ───────────────────────────────────────────────

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { useAuthStore } from '../stores/authStore';
import { useWebSocket } from '../hooks/useWebSocket';
import {
  calculateZoomFromDelta,
  zoomTowardsPoint,
  screenToCanvas,
} from '../utils/canvasMath';
import { Grid } from './Grid';
import { Zone } from './Zone';
import { Cursors } from './Cursors';
import { Minimap } from './Minimap';
import { Toolbar } from './Toolbar';

const CANVAS_WIDTH = 2400;
const CANVAS_HEIGHT = 1600;

export function Canvas() {
  const {
    zoom,
    pan,
    zones,
    cards,
    setZoom,
    setPan,
    deselectAll,
  } = useCanvasStore();

  const { user } = useAuthStore();
  const { emitCursorMove, emitCardMove } = useWebSocket(user?.id, user?.name);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ mouseX: number; mouseY: number; panX: number; panY: number } | null>(null);

  // ─── Wheel Zoom ─────────────────────────────────────────────────────────
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();

      if (e.ctrlKey || e.metaKey) {
        // Zoom with Ctrl/Cmd + scroll
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const newZoom = calculateZoomFromDelta(zoom, e.deltaY);
        const newPan = zoomTowardsPoint(pan, zoom, newZoom, { x: mouseX, y: mouseY });

        setZoom(newZoom);
        setPan(newPan);
      } else {
        // Pan with scroll
        setPan({
          x: pan.x - e.deltaX,
          y: pan.y - e.deltaY,
        });
      }
    },
    [zoom, pan, setZoom, setPan],
  );

  // ─── Drag-to-Pan ──────────────────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Pan on middle click or left-click on empty canvas background
      if (
        e.button === 1 ||
        (e.button === 0 && (e.target as HTMLElement).closest('[data-canvas-bg]'))
      ) {
        e.preventDefault();
        setIsPanning(true);
        panStartRef.current = {
          mouseX: e.clientX,
          mouseY: e.clientY,
          panX: pan.x,
          panY: pan.y,
        };
      } else if (e.button === 0) {
        // Click on empty area — deselect cards
        if ((e.target as HTMLElement).closest('[data-canvas-bg]')) {
          deselectAll();
        }
      }
    },
    [pan, deselectAll],
  );

  useEffect(() => {
    if (!isPanning) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panStartRef.current) return;
      const dx = e.clientX - panStartRef.current.mouseX;
      const dy = e.clientY - panStartRef.current.mouseY;
      setPan({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      });
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      panStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, setPan]);

  // ─── Mouse move for multiplayer cursors ────────────────────────────────
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;
      const canvasPos = screenToCanvas({ x: screenX, y: screenY }, pan, zoom);
      emitCursorMove(canvasPos);
    },
    [pan, zoom, emitCursorMove],
  );

  // ─── Minimap navigation ───────────────────────────────────────────────
  const handleMinimapNavigate = useCallback(
    (x: number, y: number) => {
      setPan({ x, y });
    },
    [setPan],
  );

  // ─── Card move callback ───────────────────────────────────────────────
  const handleCardMove = useCallback(
    (id: string, position: { x: number; y: number }) => {
      emitCardMove(id, position);
    },
    [emitCardMove],
  );

  // ─── Keyboard shortcuts ───────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when typing in inputs
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      if (e.key === '=' || e.key === '+') {
        const newZoom = Math.min(zoom * 1.2, 3);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const center = { x: rect.width / 2, y: rect.height / 2 };
          setPan(zoomTowardsPoint(pan, zoom, newZoom, center));
        }
        setZoom(newZoom);
      }
      if (e.key === '-') {
        const newZoom = Math.max(zoom / 1.2, 0.1);
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const center = { x: rect.width / 2, y: rect.height / 2 };
          setPan(zoomTowardsPoint(pan, zoom, newZoom, center));
        }
        setZoom(newZoom);
      }
      if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
      if (e.key === 'Escape') deselectAll();
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Delete selected cards
        const { selectedCards, deleteCard } = useCanvasStore.getState();
        selectedCards.forEach((id) => deleteCard(id));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoom, pan, setZoom, setPan, deselectAll]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      {/* Background grid */}
      <Grid zoom={zoom} panX={pan.x} panY={pan.y} />

      {/* Transformable canvas layer — CSS transform handles pan + zoom */}
      <div
        data-canvas-bg
        className="absolute"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        }}
      >
        {/* Zones */}
        {zones.map((zone) => (
          <Zone
            key={zone.id}
            zone={zone}
            zoom={zoom}
            onCardMove={handleCardMove}
          />
        ))}

        {/* Multiplayer cursors */}
        <Cursors />
      </div>

      {/* Minimap */}
      <Minimap
        cards={cards}
        zones={zones}
        zoom={zoom}
        panX={pan.x}
        panY={pan.y}
        viewportWidth={typeof window !== 'undefined' ? window.innerWidth : 1920}
        viewportHeight={typeof window !== 'undefined' ? window.innerHeight : 1080}
        canvasWidth={CANVAS_WIDTH}
        canvasHeight={CANVAS_HEIGHT}
        onNavigate={handleMinimapNavigate}
      />

      {/* Floating toolbar — bottom center */}
      <Toolbar />
    </div>
  );
}
