import type { FastifyInstance } from 'fastify';

/**
 * Registers a GET /metrics endpoint that returns Prometheus-format metrics.
 * Tracks request_count, error_count, latency_ms, and uptime_seconds.
 */
export function registerMetrics(app: FastifyInstance, serviceName: string) {
  const startTime = Date.now();
  let requestCount = 0;
  let errorCount = 0;
  let totalLatency = 0;

  // Hook to count requests and measure latency
  app.addHook('onRequest', async () => {
    requestCount += 1;
  });

  app.addHook('onResponse', async (_request, reply) => {
    const latency = reply.elapsedTime;
    totalLatency += latency;

    if (reply.statusCode >= 400) {
      errorCount += 1;
    }
  });

  // GET /metrics — Prometheus-format metrics
  app.get('/metrics', async () => {
    const uptimeSeconds = (Date.now() - startTime) / 1000;
    const avgLatency = requestCount > 0 ? totalLatency / requestCount : 0;

    const lines = [
      `# HELP ${serviceName}_request_count Total number of requests`,
      `# TYPE ${serviceName}_request_count counter`,
      `${serviceName}_request_count ${requestCount}`,
      '',
      `# HELP ${serviceName}_error_count Total number of error responses (4xx/5xx)`,
      `# TYPE ${serviceName}_error_count counter`,
      `${serviceName}_error_count ${errorCount}`,
      '',
      `# HELP ${serviceName}_latency_ms Average response latency in milliseconds`,
      `# TYPE ${serviceName}_latency_ms gauge`,
      `${serviceName}_latency_ms ${Math.round(avgLatency * 100) / 100}`,
      '',
      `# HELP ${serviceName}_uptime_seconds Time since service started in seconds`,
      `# TYPE ${serviceName}_uptime_seconds gauge`,
      `${serviceName}_uptime_seconds ${Math.round(uptimeSeconds * 100) / 100}`,
      '',
    ];

    return lines.join('\n');
  });
}
