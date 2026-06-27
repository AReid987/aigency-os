// ─── Venture Store ───────────────────────────────────────────────────────────
// Tracks the active venture/company. Paperclip supports multi-company isolation.
// All API calls use this ventureId to scope data.

import { create } from 'zustand';

export interface Venture {
  id: string;
  name: string;
  mission: string;
  status: 'planning' | 'launching' | 'active' | 'paused';
  createdAt: string;
}

const DEMO_VENTURES: Venture[] = [
  { id: 'default', name: 'Aigency OS', mission: 'AI venture collaboration platform', status: 'active', createdAt: '2026-06-20' },
  { id: 'venture-2', name: 'NoteFlow AI', mission: 'AI-powered note-taking that connects ideas', status: 'launching', createdAt: '2026-06-25' },
  { id: 'venture-3', name: 'DevMetrics', mission: 'Developer productivity analytics platform', status: 'planning', createdAt: '2026-06-27' },
];

interface VentureState {
  ventures: Venture[];
  activeVentureId: string;
  setVentures: (ventures: Venture[]) => void;
  setActiveVenture: (id: string) => void;
  addVenture: (venture: Venture) => void;
  getActiveVenture: () => Venture | undefined;
}

export const useVentureStore = create<VentureState>((set, get) => ({
  ventures: DEMO_VENTURES,
  activeVentureId: 'default',

  setVentures: (ventures) => set({ ventures }),
  setActiveVenture: (id) => set({ activeVentureId: id }),
  addVenture: (venture) => set((state) => ({
    ventures: [...state.ventures, venture],
    activeVentureId: venture.id,
  })),
  getActiveVenture: () => get().ventures.find((v) => v.id === get().activeVentureId),
}));
