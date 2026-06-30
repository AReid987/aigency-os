// ─── User Zustand Store ─────────────────────────────────────────────────────
// Reads role from authStore for permission checks.

import { create } from 'zustand';
import type { UserRole } from '@aigency-os/shared-types';

interface UserData {
  id: string;
  name: string;
  role: UserRole;
  permissions?: string[];
}

interface UserState {
  user: UserData | null;
  role: UserRole;
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  setUser: (user: UserData) => void;
  setRole: (role: UserRole) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setReducedMotion: (reduced: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
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
}));
