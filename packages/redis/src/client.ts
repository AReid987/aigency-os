import Redis from 'ioredis';

export interface RedisClientOptions {
  /** Redis connection URL (default: redis://localhost:6379) */
  url?: string;
  /** Max retry attempts before giving up (default: 10) */
  maxRetries?: number;
  /** Initial retry delay in ms — doubles on each attempt (default: 200) */
  retryDelay?: number;
  /** Key prefix for all commands (default: '' ) */
  keyPrefix?: string;
  /** Enable lazy connect (default: false) */
  lazyConnect?: boolean;
}

/**
 * Factory that creates a Redis client with sensible defaults and
 * exponential-backoff connection retry.
 */
export function createRedisClient(opts: RedisClientOptions = {}): Redis {
  const {
    url = process.env.REDIS_URL ?? 'redis://localhost:6379',
    maxRetries = 10,
    retryDelay = 200,
    keyPrefix = '',
    lazyConnect = false,
  } = opts;

  const client = new Redis(url, {
    maxRetriesPerRequest: maxRetries,
    retryStrategy(times: number) {
      if (times > maxRetries) {
        return null; // stop retrying
      }
      return Math.min(times * retryDelay, 5_000); // cap at 5 s
    },
    keyPrefix,
    lazyConnect,
  });

  client.on('error', (err) => {
    // Swallow connection-level errors to prevent unhandled rejections.
    // Individual command errors still propagate.
    console.error('[redis] connection error:', err.message);
  });

  client.on('connect', () => {
    console.log('[redis] connected');
  });

  return client;
}
