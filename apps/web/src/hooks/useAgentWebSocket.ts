// ─── useAgentWebSocket ───────────────────────────────────────────────────────
// Extends the canvas WebSocket with agent-specific events:
// - Agent status changes (active, thinking, blocked, paused)
// - Chat messages between agents
// - Task status updates (kanban moves)
// - Mission progress updates
//
// Gracefully degrades when the WebSocket server is not running.

import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3004';

export interface AgentStatusEvent {
  agentId: string;
  name: string;
  status: 'active' | 'thinking' | 'blocked' | 'paused';
  activeTask?: string;
}

export interface ChatMessageEvent {
  id: string;
  from: string;
  to: string;
  content: string;
  intent: string;
  timestamp: string;
}

export interface TaskUpdateEvent {
  taskId: string;
  title: string;
  fromColumn: string;
  toColumn: string;
  agentId?: string;
}

export interface MissionProgressEvent {
  missionId: string;
  name: string;
  progress: number;
  status: 'running' | 'complete' | 'failed';
}

export function useAgentWebSocket() {
  const socketRef = useRef<ReturnType<typeof io> | null>(null);
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);

  // Event listeners that pages can register
  const onAgentStatusRef = useRef<((e: AgentStatusEvent) => void) | null>(null);
  const onChatMessageRef = useRef<((e: ChatMessageEvent) => void) | null>(null);
  const onTaskUpdateRef = useRef<((e: TaskUpdateEvent) => void) | null>(null);
  const onMissionProgressRef = useRef<((e: MissionProgressEvent) => void) | null>(null);

  useEffect(() => {
    const socket = io(WS_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
      auth: { userId: 'aigency-ui', userName: 'Aigency OS' },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('[AgentWS] Connected');
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      setIsConnected(false);
      // Silently fail — WebSocket server may not be running
    });

    // Agent status changes
    socket.on('agent:status', (event: AgentStatusEvent) => {
      onAgentStatusRef.current?.(event);
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['paperclip', 'agents'] });
      queryClient.invalidateQueries({ queryKey: ['hcom', 'agents'] });
    });

    // Chat messages
    socket.on('chat:message', (event: ChatMessageEvent) => {
      onChatMessageRef.current?.(event);
      queryClient.invalidateQueries({ queryKey: ['hcom', 'messages'] });
    });

    // Task updates (kanban moves)
    socket.on('task:update', (event: TaskUpdateEvent) => {
      onTaskUpdateRef.current?.(event);
      queryClient.invalidateQueries({ queryKey: ['paperclip', 'tasks'] });
    });

    // Mission progress
    socket.on('mission:progress', (event: MissionProgressEvent) => {
      onMissionProgressRef.current?.(event);
      queryClient.invalidateQueries({ queryKey: ['paperclip', 'tickets'] });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  // Registration methods for pages to listen to specific events
  const onAgentStatus = useCallback((handler: (e: AgentStatusEvent) => void) => {
    onAgentStatusRef.current = handler;
  }, []);

  const onChatMessage = useCallback((handler: (e: ChatMessageEvent) => void) => {
    onChatMessageRef.current = handler;
  }, []);

  const onTaskUpdate = useCallback((handler: (e: TaskUpdateEvent) => void) => {
    onTaskUpdateRef.current = handler;
  }, []);

  const onMissionProgress = useCallback((handler: (e: MissionProgressEvent) => void) => {
    onMissionProgressRef.current = handler;
  }, []);

  // Emit helpers
  const emitAgentStatus = useCallback((event: AgentStatusEvent) => {
    socketRef.current?.emit('agent:status', event);
  }, []);

  const emitChatMessage = useCallback((event: ChatMessageEvent) => {
    socketRef.current?.emit('chat:message', event);
  }, []);

  const emitTaskUpdate = useCallback((event: TaskUpdateEvent) => {
    socketRef.current?.emit('task:update', event);
  }, []);

  return {
    isConnected,
    onAgentStatus,
    onChatMessage,
    onTaskUpdate,
    onMissionProgress,
    emitAgentStatus,
    emitChatMessage,
    emitTaskUpdate,
  };
}
