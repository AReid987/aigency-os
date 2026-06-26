// ─── Mobile / PWA Types ──────────────────────────────────────────────────────

export type PushPlatform = 'web' | 'ios' | 'android';

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  /** Target platform */
  platform: PushPlatform;
  /** Device / subscription token */
  token: string;
  /** Optional deep-link URL */
  url?: string;
  /** Additional key-value payload */
  data?: Record<string, unknown>;
  /** Optional image URL */
  imageUrl?: string;
  /** Badge count (iOS) */
  badge?: number;
  /** TTL in seconds */
  ttl?: number;
  createdAt: string;
}

// ─── Offline Sync ────────────────────────────────────────────────────────────

export type SyncStatus = 'pending' | 'in_progress' | 'completed' | 'conflict' | 'failed';

export interface OfflineSync {
  id: string;
  /** Entity type being synced (e.g. "task", "ticket") */
  entityType: string;
  /** Entity ID */
  entityId: string;
  /** Operation type */
  operation: 'create' | 'update' | 'delete';
  /** Serialized payload */
  payload: Record<string, unknown>;
  /** Sync status */
  status: SyncStatus;
  /** Number of retry attempts */
  retryCount: number;
  /** ISO-8601 timestamp of the change */
  changedAt: string;
  /** ISO-8601 timestamp of last sync attempt */
  syncedAt?: string;
  /** Error message if status is failed/conflict */
  error?: string;
}

// ─── PWA Configuration ──────────────────────────────────────────────────────

export type DisplayMode = 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';

export interface PWAConfig {
  /** App short name (≤12 chars) */
  shortName: string;
  /** Full app name */
  name: string;
  /** Theme colour (hex) */
  themeColor: string;
  /** Background colour (hex) */
  backgroundColor: string;
  /** Display mode */
  display: DisplayMode;
  /** Start URL after install */
  startUrl: string;
  /** Icon set (multiple sizes) */
  icons: { src: string; sizes: string; type: string; purpose?: string }[];
  /** Service worker scope */
  scope?: string;
  /** Offline fallback page */
  offlineFallbackUrl?: string;
  /** Enable push notifications */
  pushEnabled: boolean;
}
