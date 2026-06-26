import type Redis from 'ioredis';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StreamMessage {
  id: string;
  fields: Record<string, string>;
}

export interface StreamConfig {
  /** Stream key (e.g. "hcom:messages") */
  stream: string;
  /** Consumer group name */
  group: string;
  /** Consumer name within the group */
  consumer: string;
  /** Max messages per XREADGROUP call (default: 10) */
  count?: number;
  /** Block for N ms before returning empty (default: 5000) */
  blockMs?: number;
}

// ─── XADD wrapper ────────────────────────────────────────────────────────────

/**
 * Append a message to a Redis Stream.
 *
 * @returns the generated message ID
 */
export async function xadd(
  redis: Redis,
  stream: string,
  fields: Record<string, string>,
): Promise<string> {
  const flatArgs: string[] = [];
  for (const [k, v] of Object.entries(fields)) {
    flatArgs.push(k, v);
  }
  // XADD stream * field1 value1 field2 value2 …
  const id = await redis.xadd(stream, '*', ...flatArgs);
  return id ?? '';
}

// ─── XREADGROUP wrapper ──────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Read messages from a consumer group. Creates the group if it doesn't exist.
 */
export async function xreadgroup(
  redis: Redis,
  cfg: StreamConfig,
): Promise<StreamMessage[]> {
  const { stream, group, consumer, count = 10, blockMs = 5_000 } = cfg;

  // Ensure consumer group exists
  try {
    await redis.xgroup('CREATE', stream, group, '0', 'MKSTREAM');
  } catch (err: unknown) {
    // BUSYGROUP means the group already exists — that's fine
    if (err instanceof Error && !err.message.includes('BUSYGROUP')) {
      throw err;
    }
  }

  // ioredis returns [streamName, [msgId, [field, val, ...]]][] | null
  const result: any = await redis.xreadgroup(
    'GROUP',
    group,
    consumer,
    'COUNT',
    count,
    'BLOCK',
    blockMs,
    'STREAMS',
    stream,
    '>',
  );

  if (!result) return [];

  const messages: StreamMessage[] = [];
  for (const [, entries] of result) {
    for (const [id, fields] of entries) {
      const obj: Record<string, string> = {};
      for (let i = 0; i < fields.length; i += 2) {
        obj[fields[i]] = fields[i + 1];
      }
      messages.push({ id, fields: obj });
    }
  }
  return messages;
}

/* eslint-enable @typescript-eslint/no-explicit-any */

// ─── XACK wrapper ────────────────────────────────────────────────────────────

/**
 * Acknowledge one or more messages so they are no longer re-delivered.
 */
export async function xack(
  redis: Redis,
  stream: string,
  group: string,
  ...ids: string[]
): Promise<number> {
  return redis.xack(stream, group, ...ids);
}
