// ─── WebSocket Hook ─────────────────────────────────────────────────────────

import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useCanvasStore } from '../stores/canvasStore';

const WS_URL = 'ws://localhost:3004';

const CURSOR_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#14b8a6',
];

function getRandomColor(): string {
  return CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
}

interface UseWebSocketReturn {
  socket: ReturnType<typeof io> | null;
  emit: (event: string, data: unknown) => void;
  emitCardMove: (id: string, position: { x: number; y: number }) => void;
  emitCardCreate: (card: unknown) => void;
  emitCardUpdate: (card: unknown) => void;
  emitCardDelete: (id: string) => void;
  emitCursorMove: (position: { x: number; y: number }) => void;
  isConnected: boolean;
}

export function useWebSocket(userId?: string, userName?: string): UseWebSocketReturn {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const colorRef = useRef<string>(getRandomColor());
  const { syncCard, syncCursor, removeCursor, updateCursor } = useCanvasStore();

  useEffect(() => {
    const socket = io(WS_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      auth: {
        userId: userId || 'anonymous',
        userName: userName || 'Anonymous',
        color: colorRef.current,
      },
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('[WS] Connected to canvas server');
    });

    socket.on('disconnect', (reason) => {
      console.log('[WS] Disconnected:', reason);
    });

    socket.on('connect_error', (err) => {
      console.warn('[WS] Connection error (server may not be running):', err.message);
    });

    // Card sync events
    socket.on('card:move', ({ id, position }: { id: string; position: { x: number; y: number } }) => {
      // Apply remote card movement directly (skip snap for smoothness)
      useCanvasStore.setState((state) => ({
        cards: state.cards.map((card) =>
          card.id === id ? { ...card, position, lastModified: new Date().toISOString() } : card,
        ),
      }));
    });

    socket.on('card:create', (card) => {
      syncCard(card);
    });

    socket.on('card:update', (card) => {
      syncCard(card);
    });

    socket.on('card:delete', ({ id }: { id: string }) => {
      useCanvasStore.setState((state) => ({
        cards: state.cards.filter((c) => c.id !== id),
      }));
    });

    // Cursor sync events
    socket.on('cursor:move', ({ userId: uid, userName: uname, position, color }) => {
      updateCursor(uid, uname, position, color);
    });

    socket.on('cursor:leave', ({ userId: uid }: { userId: string }) => {
      removeCursor(uid);
    });

    // User presence
    socket.on('users:list', (users: Array<{ userId: string; userName: string; color: string }>) => {
      // Clear old cursors and add current ones
      useCanvasStore.setState((state) => {
        const newCursors = new Map(state.cursors);
        for (const u of users) {
          if (u.userId !== userId) {
            newCursors.set(u.userId, {
              userId: u.userId,
              userName: u.userName,
              position: { x: 0, y: 0 },
              color: u.color,
            });
          }
        }
        return { cursors: newCursors };
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, userName, syncCard, syncCursor, removeCursor, updateCursor]);

  // Emit helpers
  const emitCardMove = useCallback((id: string, position: { x: number; y: number }) => {
    socketRef.current?.emit('card:move', { id, position });
  }, []);

  const emitCardCreate = useCallback((card: unknown) => {
    socketRef.current?.emit('card:create', card);
  }, []);

  const emitCardUpdate = useCallback((card: unknown) => {
    socketRef.current?.emit('card:update', card);
  }, []);

  const emitCardDelete = useCallback((id: string) => {
    socketRef.current?.emit('card:delete', { id });
  }, []);

  const emitCursorMove = useCallback(
    (position: { x: number; y: number }) => {
      socketRef.current?.emit('cursor:move', {
        userId: userId || 'anonymous',
        userName: userName || 'Anonymous',
        position,
        color: colorRef.current,
      });
    },
    [userId, userName],
  );

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return {
    socket: socketRef.current,
    emit,
    emitCardMove,
    emitCardCreate,
    emitCardUpdate,
    emitCardDelete,
    emitCursorMove,
    isConnected: socketRef.current?.connected ?? false,
  };
}
