// ─── Presence Store — Tracks online users ───────────────────────────────────

import { create } from 'zustand';
import { useEffect, useRef } from 'react';
import { useAuthStore } from './authStore';

export interface PresenceUser {
  id: string;
  name: string;
  online: boolean;
  lastSeen: string;
}

interface PresenceState {
  onlineUsers: Map<string, PresenceUser>;
  isOnline: (userId: string) => boolean;
  setOnline: (userId: string, name: string) => void;
  setOffline: (userId: string) => void;
  getOnlineCount: () => number;
  getOnlineUsers: () => PresenceUser[];
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUsers: new Map(),

  isOnline: (userId: string) => {
    return get().onlineUsers.get(userId)?.online ?? false;
  },

  setOnline: (userId: string, name: string) => {
    set((state) => {
      const next = new Map(state.onlineUsers);
      next.set(userId, {
        id: userId,
        name,
        online: true,
        lastSeen: new Date().toISOString(),
      });
      return { onlineUsers: next };
    });
  },

  setOffline: (userId: string) => {
    set((state) => {
      const next = new Map(state.onlineUsers);
      const existing = next.get(userId);
      if (existing) {
        next.set(userId, { ...existing, online: false, lastSeen: new Date().toISOString() });
      }
      return { onlineUsers: next };
    });
  },

  getOnlineCount: () => {
    return Array.from(get().onlineUsers.values()).filter((u) => u.online).length;
  },

  getOnlineUsers: () => {
    return Array.from(get().onlineUsers.values()).filter((u) => u.online);
  },
}));

// ─── Presence Polling Hook ──────────────────────────────────────────────────
// Polls the server for online users every 30 seconds.
// Falls back to marking the current user as online if server is unreachable.

const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

export function usePresencePolling(intervalMs = 15_000) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { setOnline, setOffline } = usePresenceStore();
  const prevUserId = useRef<string | null>(null);

  // Mark current user online/offline on auth changes
  useEffect(() => {
    if (isAuthenticated && user) {
      setOnline(user.id, user.name);
      prevUserId.current = user.id;
    } else if (prevUserId.current) {
      setOffline(prevUserId.current);
      prevUserId.current = null;
    }
  }, [isAuthenticated, user, setOnline, setOffline]);

  // Send heartbeat + poll for other online users
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const heartbeatAndPoll = async () => {
      try {
        // Send heartbeat
        await fetch(`${API_BASE}/presence/heartbeat`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });

        // Poll for other online users
        const res = await fetch(`${API_BASE}/presence/online`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const currentUserId = user?.id;
          if (Array.isArray(data)) {
            data.forEach((u: { id: string; name: string }) => {
              if (u.id !== currentUserId) setOnline(u.id, u.name);
            });
          }
        }
      } catch {
        // Server unreachable — presence tracked locally only
      }
    };

    heartbeatAndPoll();
    const id = setInterval(heartbeatAndPoll, intervalMs);
    return () => clearInterval(id);
  }, [isAuthenticated, token, intervalMs, user?.id, setOnline]);
}
