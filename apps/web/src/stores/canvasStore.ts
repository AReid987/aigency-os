// ─── Canvas Zustand Store ───────────────────────────────────────────────────

import { create } from 'zustand';
import type { Card, CardType, Position, Size, Zone, ZoneType } from '@vscp/shared-types';
import { snapToGrid, clampZoom } from '../utils/canvasMath';

interface MultiplayerCursor {
  userId: string;
  userName: string;
  position: Position;
  color: string;
}

interface CanvasState {
  // Viewport
  zoom: number;
  pan: Position;

  // Selection
  selectedCards: string[];

  // Zones
  zones: Zone[];
  activeZone: string | null;

  // Cards
  cards: Card[];

  // Multiplayer cursors
  cursors: Map<string, MultiplayerCursor>;

  // Actions — Viewport
  setZoom: (zoom: number) => void;
  setPan: (pan: Position) => void;
  resetView: () => void;

  // Actions — Selection
  selectCard: (id: string, multi?: boolean) => void;
  deselectAll: () => void;

  // Actions — Cards
  moveCard: (id: string, position: Position) => void;
  createCard: (type: CardType, zoneId: string, position: Position, content?: Record<string, unknown>) => void;
  deleteCard: (id: string) => void;
  updateCardContent: (id: string, content: Record<string, unknown>) => void;

  // Actions — Zones
  createZone: (type: ZoneType, name: string, position: Position) => void;
  setActiveZone: (id: string | null) => void;

  // Actions — Multiplayer cursors
  updateCursor: (userId: string, userName: string, position: Position, color: string) => void;
  removeCursor: (userId: string) => void;

  // Actions — WebSocket sync
  syncCard: (card: Card) => void;
  syncCursor: (cursor: MultiplayerCursor) => void;
}

let nextCardId = 1;
let nextZoneId = 1;

function generateCardId(): string {
  return `card-${Date.now()}-${nextCardId++}`;
}

function generateZoneId(): string {
  return `zone-${Date.now()}-${nextZoneId++}`;
}

// Default zones
const defaultBusinessZone: Zone = {
  id: 'zone-business-default',
  type: 'business',
  name: 'Business Zone',
  cards: [],
  collaborators: [],
  permissions: [],
};

const defaultEngineeringZone: Zone = {
  id: 'zone-engineering-default',
  type: 'engineering',
  name: 'Engineering Zone',
  cards: [],
  collaborators: [],
  permissions: [],
};

export const useCanvasStore = create<CanvasState>((set, get) => ({
  // Initial viewport
  zoom: 1,
  pan: { x: 0, y: 0 },

  // Initial selection
  selectedCards: [],

  // Initial zones
  zones: [defaultBusinessZone, defaultEngineeringZone],
  activeZone: null,

  // Initial cards (some demo cards)
  cards: [
    {
      id: 'demo-card-1',
      zoneId: 'zone-business-default',
      type: 'text',
      content: { title: 'Value Proposition', text: 'AI-powered collaboration platform for venture building' },
      position: { x: 60, y: 80 },
      size: { width: 260, height: 180 },
      createdBy: 'user-1',
      lastModified: new Date().toISOString(),
      versionHistory: [],
    },
    {
      id: 'demo-card-2',
      zoneId: 'zone-business-default',
      type: 'text',
      content: { title: 'Revenue Model', text: 'Freemium: $0 free tier, $10/mo pro tier' },
      position: { x: 360, y: 80 },
      size: { width: 260, height: 180 },
      createdBy: 'user-1',
      lastModified: new Date().toISOString(),
      versionHistory: [],
    },
    {
      id: 'demo-card-3',
      zoneId: 'zone-business-default',
      type: 'link',
      content: { title: 'Market Research', url: 'https://example.com/research', description: 'Competitive analysis report' },
      position: { x: 660, y: 80 },
      size: { width: 260, height: 180 },
      createdBy: 'user-1',
      lastModified: new Date().toISOString(),
      versionHistory: [],
    },
    {
      id: 'demo-card-4',
      zoneId: 'zone-engineering-default',
      type: 'text',
      content: { title: 'Architecture', text: 'React 19 + Vite + Zustand + WebSocket' },
      position: { x: 60, y: 80 },
      size: { width: 260, height: 180 },
      createdBy: 'user-2',
      lastModified: new Date().toISOString(),
      versionHistory: [],
    },
    {
      id: 'demo-card-5',
      zoneId: 'zone-engineering-default',
      type: 'embed',
      content: { title: 'API Schema', src: 'https://petstore.swagger.io/' },
      position: { x: 360, y: 80 },
      size: { width: 260, height: 240 },
      createdBy: 'user-2',
      lastModified: new Date().toISOString(),
      versionHistory: [],
    },
  ],

  // Cursors
  cursors: new Map(),

  // Viewport actions
  setZoom: (zoom) => set({ zoom: clampZoom(zoom) }),
  setPan: (pan) => set({ pan }),
  resetView: () => set({ zoom: 1, pan: { x: 0, y: 0 } }),

  // Selection actions
  selectCard: (id, multi) =>
    set((state) => ({
      selectedCards: multi
        ? state.selectedCards.includes(id)
          ? state.selectedCards.filter((c) => c !== id)
          : [...state.selectedCards, id]
        : [id],
    })),
  deselectAll: () => set({ selectedCards: [] }),

  // Card actions
  moveCard: (id, position) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id
          ? { ...card, position: snapToGrid(position), lastModified: new Date().toISOString() }
          : card,
      ),
    })),

  createCard: (type, zoneId, position, content) => {
    const id = generateCardId();
    const defaultSizes: Record<CardType, Size> = {
      text: { width: 260, height: 180 },
      image: { width: 300, height: 240 },
      link: { width: 260, height: 180 },
      embed: { width: 400, height: 300 },
      calculator: { width: 320, height: 280 },
      preview: { width: 400, height: 300 },
    };
    const newCard: Card = {
      id,
      zoneId,
      type,
      content: content || { title: `New ${type} card`, text: '' },
      position: snapToGrid(position),
      size: defaultSizes[type] || { width: 260, height: 180 },
      createdBy: 'current-user',
      lastModified: new Date().toISOString(),
      versionHistory: [],
    };
    set((state) => ({
      cards: [...state.cards, newCard],
      selectedCards: [id],
    }));
  },

  deleteCard: (id) =>
    set((state) => ({
      cards: state.cards.filter((c) => c.id !== id),
      selectedCards: state.selectedCards.filter((c) => c !== id),
    })),

  updateCardContent: (id, content) =>
    set((state) => ({
      cards: state.cards.map((card) =>
        card.id === id
          ? { ...card, content: { ...card.content, ...content }, lastModified: new Date().toISOString() }
          : card,
      ),
    })),

  // Zone actions
  createZone: (type, name, _position) => {
    const id = generateZoneId();
    const newZone: Zone = {
      id,
      type,
      name,
      cards: [],
      collaborators: [],
      permissions: [],
    };
    set((state) => ({ zones: [...state.zones, newZone] }));
  },

  setActiveZone: (id) => set({ activeZone: id }),

  // Multiplayer cursor actions
  updateCursor: (userId, userName, position, color) =>
    set((state) => {
      const newCursors = new Map(state.cursors);
      newCursors.set(userId, { userId, userName, position, color });
      return { cursors: newCursors };
    }),

  removeCursor: (userId) =>
    set((state) => {
      const newCursors = new Map(state.cursors);
      newCursors.delete(userId);
      return { cursors: newCursors };
    }),

  // WebSocket sync actions
  syncCard: (card) =>
    set((state) => ({
      cards: state.cards.some((c) => c.id === card.id)
        ? state.cards.map((c) => (c.id === card.id ? card : c))
        : [...state.cards, card],
    })),

  syncCursor: (cursor) =>
    set((state) => {
      const newCursors = new Map(state.cursors);
      newCursors.set(cursor.userId, cursor);
      return { cursors: newCursors };
    }),
}));
