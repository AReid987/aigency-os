// ─── Auth Zustand Store ─────────────────────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppRole = 'admin' | 'technical_founder' | 'domain_expert';

export interface User {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  company?: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { email: string; password: string; name: string; company?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

// Demo accounts
const DEMO_ACCOUNTS: Array<{ email: string; password: string; user: User }> = [
  {
    email: 'admin@aigency.os',
    password: 'admin123',
    user: {
      id: 'user-admin',
      email: 'admin@aigency.os',
      name: 'Antonio Reid',
      role: 'admin',
      company: 'Aigency',
      createdAt: new Date().toISOString(),
    },
  },
  {
    email: 'demo@domain.expert',
    password: 'demo123',
    user: {
      id: 'user-de',
      email: 'demo@domain.expert',
      name: 'Sarah Chen',
      role: 'domain_expert',
      company: 'Acme Ventures',
      createdAt: new Date().toISOString(),
    },
  },
];

// In-memory user registry (supplements demo accounts)
let userRegistry: Array<{ email: string; password: string; user: User }> = [...DEMO_ACCOUNTS];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const account = userRegistry.find(
          (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
        );

        if (!account) {
          return { success: false, error: 'Invalid email or password' };
        }

        const token = `tok_${account.user.id}_${Date.now()}`;
        set({ user: account.user, token, isAuthenticated: true });
        return { success: true };
      },

      signup: async (data) => {
        const exists = userRegistry.find(
          (a) => a.email.toLowerCase() === data.email.toLowerCase()
        );

        if (exists) {
          return { success: false, error: 'An account with this email already exists' };
        }

        const newUser: User = {
          id: `user-${Date.now()}`,
          email: data.email,
          name: data.name,
          role: 'domain_expert', // All signups are domain experts
          company: data.company,
          createdAt: new Date().toISOString(),
        };

        userRegistry.push({ email: data.email, password: data.password, user: newUser });

        const token = `tok_${newUser.id}_${Date.now()}`;
        set({ user: newUser, token, isAuthenticated: true });
        return { success: true };
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateProfile: (data) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...data } });
        }
      },
    }),
    {
      name: 'aigency-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);

// Helper: check if current user is admin
export function isAdmin(): boolean {
  return useAuthStore.getState().user?.role === 'admin';
}

// Helper: check if current user can access admin-only features
export function canAccessAdmin(): boolean {
  const role = useAuthStore.getState().user?.role;
  return role === 'admin' || role === 'technical_founder';
}
