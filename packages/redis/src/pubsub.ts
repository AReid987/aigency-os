import type Redis from 'ioredis';

export type MessageHandler = (channel: string, message: string) => void | Promise<void>;

/**
 * Subscribe to one or more Redis Pub/Sub channels.
 *
 * Returns an unsubscribe function that cleans up both clients.
 *
 * **Note:** Pub/Sub requires a *dedicated* connection (ioredis auto-detects
 * this). For high-throughput scenarios prefer Redis Streams (streams.ts).
 */
export async function subscribe(
  redis: Redis,
  channels: string | string[],
  handler: MessageHandler,
): Promise<() => Promise<void>> {
  const subscriber = redis.duplicate();
  const chs = Array.isArray(channels) ? channels : [channels];

  subscriber.on('message', (channel: string, message: string) => {
    void handler(channel, message);
  });

  await subscriber.subscribe(...chs);

  return async () => {
    await subscriber.unsubscribe(...chs);
    await subscriber.quit();
  };
}

/**
 * Publish a message to a single Redis Pub/Sub channel.
 */
export async function publish(
  redis: Redis,
  channel: string,
  message: string,
): Promise<number> {
  return redis.publish(channel, message);
}
