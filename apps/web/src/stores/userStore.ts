// ─── User Zustand Store ─────────────────────────────────────────────────────
// Synced with authStore — reads role from the authenticated user.

import { create } from 'zustand';
import type { UserRole } from '@vscp/shared-types';

interface UserState {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const useUserStore = create<UserState>((set) => ({
  role: 'domain_expert',
  setRole: (role) => set({ role }),
}));
