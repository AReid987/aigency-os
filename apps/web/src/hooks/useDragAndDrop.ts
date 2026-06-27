// ─── useDragAndDrop ──────────────────────────────────────────────────────────
// Lightweight HTML5 Drag and Drop hook. No external dependencies.
// Works with kanban columns and cards.

import { useState, useCallback, useRef } from 'react';

export interface DragState {
  draggedId: string | null;
  overColumnId: string | null;
  overIndex: number | null;
}

export function useDragAndDrop<T extends { id: string; column: string }>(
  items: T[],
  onMove: (itemId: string, toColumn: string, toIndex: number) => void,
) {
  const [dragState, setDragState] = useState<DragState>({
    draggedId: null,
    overColumnId: null,
    overIndex: null,
  });

  const dragDataRef = useRef<string | null>(null);

  // ── Card handlers ──────────────────────────────────────────────────────────

  const handleDragStart = useCallback((e: React.DragEvent, itemId: string) => {
    dragDataRef.current = itemId;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', itemId);
    // Delay setting dragged state to allow the drag image to render
    requestAnimationFrame(() => {
      setDragState((s) => ({ ...s, draggedId: itemId }));
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    const draggedId = dragDataRef.current;
    if (draggedId && dragState.overColumnId !== null) {
      onMove(draggedId, dragState.overColumnId, dragState.overIndex ?? 0);
    }
    dragDataRef.current = null;
    setDragState({ draggedId: null, overColumnId: null, overIndex: null });
  }, [dragState.overColumnId, dragState.overIndex, onMove]);

  // ── Column handlers ────────────────────────────────────────────────────────

  const handleColumnDragOver = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragState((s) => ({ ...s, overColumnId: columnId }));
  }, []);

  const handleColumnDragLeave = useCallback(() => {
    setDragState((s) => ({ ...s, overColumnId: null, overIndex: null }));
  }, []);

  const handleColumnDrop = useCallback((e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragState((s) => ({ ...s, overColumnId: columnId }));
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────

  const isDragging = dragState.draggedId !== null;
  const isOverColumn = (columnId: string) => dragState.overColumnId === columnId;

  const getCardProps = (itemId: string) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => handleDragStart(e, itemId),
    onDragEnd: handleDragEnd,
    style: {
      opacity: dragState.draggedId === itemId ? 0.4 : 1,
      cursor: 'grab' as const,
    },
  });

  const getColumnProps = (columnId: string) => ({
    onDragOver: (e: React.DragEvent) => handleColumnDragOver(e, columnId),
    onDragLeave: handleColumnDragLeave,
    onDrop: (e: React.DragEvent) => handleColumnDrop(e, columnId),
    style: {
      backgroundColor: isOverColumn(columnId) ? 'rgba(18, 165, 148, 0.06)' : undefined,
      outline: isOverColumn(columnId) ? '2px dashed rgba(18, 165, 148, 0.3)' : undefined,
      outlineOffset: '-2px',
      transition: 'background-color 150ms, outline-color 150ms',
    },
  });

  return {
    dragState,
    isDragging,
    isOverColumn,
    getCardProps,
    getColumnProps,
  };
}
