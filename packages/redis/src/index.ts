// ─── Client ──────────────────────────────────────────────────────────────────
export { createRedisClient } from './client';
export type { RedisClientOptions } from './client';

// ─── Streams ─────────────────────────────────────────────────────────────────
export { xadd, xreadgroup, xack } from './streams';
export type { StreamMessage, StreamConfig } from './streams';

// ─── Pub/Sub (legacy fallback) ───────────────────────────────────────────────
export { subscribe, publish } from './pubsub';
export type { MessageHandler } from './pubsub';
