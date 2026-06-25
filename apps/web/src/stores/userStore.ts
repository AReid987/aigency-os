// ─── User Zustand Store ─────────────────────────────────────────────────────

import { create } from 'zustand';
import type { User, UserRole, ZoneType } from '@vscp/shared-types';

interface UserState {
  user: User | null;
  role: UserRole;
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;

  // Actions
  setUser: (user: User) => void;
  setRole: (role: UserRole) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setReducedMotion: (reduced: boolean) => void;

  // Derived
  canEditZone: (zoneType: ZoneType) => boolean;
  getVisibleZones: () => ZoneType[];
}

export const useUserStore = create<UserState>((set, get) => ({
  // Default to domain_expert for demo
  user: {
    id: 'user-1',
    name: 'Sarah Chen',
    role: 'domain_expert',
    permissions: [],
  },
  role: 'domain_expert',
  theme: 'system',
  reducedMotion: false,

  setUser: (user) => set({ user, role: user.role }),
  setRole: (role) =>
    set((state) => ({
      role,
      user: state.user ? { ...state.user, role } : null,
    })),
  setTheme: (theme) => set({ theme }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),

  canEditZone: (zoneType) => {
    const { role } = get();
    if (role === 'technical_founder' || role === 'agent') return true;
    if (role === 'domain_expert') return zoneType === 'business' || zoneType === 'shared';
    return false;
  },

  getVisibleZones: () => {
    // All zones visible to all roles, but with different permissions
    return ['business', 'engineering', 'shared'];
  },
}));
