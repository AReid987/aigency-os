// ─── Auth Zustand Store — Real JWT Auth ─────────────────────────────────────

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AppRole = 'admin' | 'technical_founder' | 'domain_expert';

export interface User {
  id: string;
  email: string;
  name: string;
  role: AppRole;
  company?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: { email: string; password: string; name: string; company?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_URL || window.location.origin;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) {
            const data = await res.json();
            return { success: false, error: data.error || 'Login failed' };
          }

          const data = await res.json();
          set({ user: data.user, token: data.token, isAuthenticated: true });
          return { success: true };
        } catch (err) {
          return { success: false, error: 'Cannot reach auth server. Please try again later.' };
        }
      },

      signup: async (data) => {
        try {
          const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

          if (!res.ok) {
            const errData = await res.json();
            return { success: false, error: errData.error || 'Signup failed' };
          }

          const resData = await res.json();
          set({ user: resData.user, token: resData.token, isAuthenticated: true });
          return { success: true };
        } catch (err) {
          return { success: false, error: 'Cannot reach auth server. Please try again later.' };
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      checkAuth: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            set({ user: null, token: null, isAuthenticated: false });
            return;
          }

          const user = await res.json();
          set({ user, isAuthenticated: true });
        } catch {
          // Server not reachable — keep cached user
        }
      },
    }),
    {
      name: 'aigency-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
