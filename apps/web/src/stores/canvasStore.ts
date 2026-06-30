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
  zoneLayouts: Record<string, { x: number; y: number; width: number; height: number }>;
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
  moveZone: (id: string, position: Position) => void;
  resizeZone: (id: string, size: Size) => void;
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

  // Zone layouts (position + size)
  zoneLayouts: {
    [defaultBusinessZone.id]: { x: 0, y: 0, width: 1200, height: 500 },
    [defaultEngineeringZone.id]: { x: 0, y: 540, width: 1200, height: 500 },
  },

  activeZone: null,

  // Initial cards — empty until ventures create them
  cards: [],

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
      bmc: { width: 400, height: 320 },
      revenue: { width: 280, height: 340 },
      gate: { width: 260, height: 200 },
      spec: { width: 300, height: 260 },
      'agent-status': { width: 300, height: 380 },
      'crm-pipeline': { width: 320, height: 340 },
      mission: { width: 300, height: 360 },
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
  createZone: (type, name, position) => {
    const id = generateZoneId();
    const newZone: Zone = {
      id,
      type,
      name,
      cards: [],
      collaborators: [],
      permissions: [],
    };
    // Offset new zones so they don't stack on top of the default business zone
    const offset = Object.keys(get().zoneLayouts).length * 40;
    const layout = {
      x: (position?.x ?? 0) + offset,
      y: (position?.y ?? 0) + offset,
      width: 1200,
      height: 500,
    };
    set((state) => ({
      zones: [...state.zones, newZone],
      zoneLayouts: { ...state.zoneLayouts, [id]: layout },
    }));
  },

  moveZone: (id, position) =>
    set((state) => ({
      zoneLayouts: {
        ...state.zoneLayouts,
        [id]: { ...state.zoneLayouts[id], x: position.x, y: position.y },
      },
    })),

  resizeZone: (id, size) =>
    set((state) => ({
      zoneLayouts: {
        ...state.zoneLayouts,
        [id]: { ...state.zoneLayouts[id], width: size.width, height: size.height },
      },
    })),

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
