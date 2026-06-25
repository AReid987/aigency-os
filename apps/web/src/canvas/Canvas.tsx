// ─── Main Canvas Component ──────────────────────────────────────────────────

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { useCanvasStore } from '../stores/canvasStore';
import { useUserStore } from '../stores/userStore';
import { useWebSocket } from '../hooks/useWebSocket';
import { calculateZoomFromDelta, zoomTowardsPoint, screenToCanvas } from '../utils/canvasMath';
import { Grid } from './Grid';
import { Zone } from './Zone';
import { MultiplayerCursors } from './MultiplayerCursors';
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

  const { user } = useUserStore();
  const { emitCursorMove, emitCardMove } = useWebSocket(
    user?.id,
    user?.name,
  );

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

  // ─── Middle-click or Space+Drag Pan ────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only pan on middle click or when clicking empty canvas area
      if (e.button === 1 || (e.button === 0 && (e.target as HTMLElement).closest('[data-canvas-bg]'))) {
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

  // ─── Zoom controls ────────────────────────────────────────────────────
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom * 1.2, 3);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const center = { x: rect.width / 2, y: rect.height / 2 };
      setPan(zoomTowardsPoint(pan, zoom, newZoom, center));
    }
    setZoom(newZoom);
  }, [zoom, pan, setZoom, setPan]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const center = { x: rect.width / 2, y: rect.height / 2 };
      setPan(zoomTowardsPoint(pan, zoom, newZoom, center));
    }
    setZoom(newZoom);
  }, [zoom, pan, setZoom, setPan]);

  const handleResetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [setZoom, setPan]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '=' || e.key === '+') handleZoomIn();
      if (e.key === '-') handleZoomOut();
      if (e.key === '0' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleResetView();
      }
      if (e.key === 'Escape') deselectAll();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleZoomIn, handleZoomOut, handleResetView, deselectAll]);

  const handleMinimapNavigate = useCallback(
    (x: number, y: number) => {
      setPan({ x, y });
    },
    [setPan],
  );

  const handleCardMove = useCallback(
    (_id: string, _position: { x: number; y: number }) => {
      // Card move is already handled in the Card component via canvasStore
      // This callback could trigger WebSocket sync in the future
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-50 dark:bg-gray-900"
      style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      {/* Background grid */}
      <Grid zoom={zoom} panX={pan.x} panY={pan.y} />

      {/* Transformable canvas layer */}
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
        <MultiplayerCursors />
      </div>

      {/* Zoom controls */}
      <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-1">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-sm"
          aria-label="Zoom in"
        >
          +
        </button>
        <div className="w-8 h-6 bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 flex items-center justify-center">
          <span className="text-[9px] font-mono text-gray-500 dark:text-gray-400">
            {Math.round(zoom * 100)}%
          </span>
        </div>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono text-sm"
          aria-label="Zoom out"
        >
          −
        </button>
        <button
          onClick={handleResetView}
          className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
          aria-label="Reset view"
          title="Reset view (Ctrl+0)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
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

      {/* Floating toolbar */}
      <Toolbar />
    </div>
  );
}
