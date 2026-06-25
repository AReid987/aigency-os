// ─── Canvas Math Utilities ──────────────────────────────────────────────────

import type { Position, Size } from '@vscp/shared-types';

const GRID_SIZE = 20;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3.0;

/**
 * Snap a position to the nearest grid point.
 */
export function snapToGrid(position: Position, gridSize: number = GRID_SIZE): Position {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
}

/**
 * Clamp zoom value between min and max bounds.
 */
export function clampZoom(zoom: number, min: number = MIN_ZOOM, max: number = MAX_ZOOM): number {
  return Math.min(Math.max(zoom, min), max);
}

/**
 * Calculate new zoom from a wheel delta.
 */
export function calculateZoomFromDelta(currentZoom: number, deltaY: number, sensitivity: number = 0.001): number {
  const newZoom = currentZoom * (1 - deltaY * sensitivity);
  return clampZoom(newZoom);
}

/**
 * Zoom towards a specific point (e.g., mouse position).
 * Returns the new pan offset so the point stays fixed.
 */
export function zoomTowardsPoint(
  currentPan: Position,
  currentZoom: number,
  newZoom: number,
  point: Position,
): Position {
  const scale = newZoom / currentZoom;
  return {
    x: point.x - (point.x - currentPan.x) * scale,
    y: point.y - (point.y - currentPan.y) * scale,
  };
}

/**
 * Convert screen coordinates to canvas coordinates.
 */
export function screenToCanvas(screenPos: Position, pan: Position, zoom: number): Position {
  return {
    x: (screenPos.x - pan.x) / zoom,
    y: (screenPos.y - pan.y) / zoom,
  };
}

/**
 * Convert canvas coordinates to screen coordinates.
 */
export function canvasToScreen(canvasPos: Position, pan: Position, zoom: number): Position {
  return {
    x: canvasPos.x * zoom + pan.x,
    y: canvasPos.y * zoom + pan.y,
  };
}

/**
 * Check if a point is inside a rectangle.
 */
export function isPointInRect(
  point: Position,
  rectPos: Position,
  rectSize: Size,
): boolean {
  return (
    point.x >= rectPos.x &&
    point.x <= rectPos.x + rectSize.width &&
    point.y >= rectPos.y &&
    point.y <= rectPos.y + rectSize.height
  );
}

/**
 * Get the bounding box of the visible viewport in canvas coordinates.
 */
export function getViewportBounds(
  pan: Position,
  zoom: number,
  viewportWidth: number,
  viewportHeight: number,
): { x: number; y: number; width: number; height: number } {
  const topLeft = screenToCanvas({ x: 0, y: 0 }, pan, zoom);
  const bottomRight = screenToCanvas({ x: viewportWidth, y: viewportHeight }, pan, zoom);
  return {
    x: topLeft.x,
    y: topLeft.y,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y,
  };
}

export { GRID_SIZE, MIN_ZOOM, MAX_ZOOM };
