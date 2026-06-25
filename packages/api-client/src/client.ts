import type { APIClientConfig, RequestOptions } from './types';

export function createAPIClient(config: APIClientConfig) {
  const { baseUrl, headers: defaultHeaders = {}, timeout = 30000 } = config;

  async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {}, signal } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (signal) {
      signal.addEventListener('abort', () => controller.abort());
    }

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...defaultHeaders,
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      return response.json() as Promise<T>;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  return {
    get: <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'GET' }),
    post: <T>(path: string, body: unknown, opts?: RequestOptions) =>
      request<T>(path, { ...opts, method: 'POST', body }),
    put: <T>(path: string, body: unknown, opts?: RequestOptions) =>
      request<T>(path, { ...opts, method: 'PUT', body }),
    delete: <T>(path: string, opts?: RequestOptions) =>
      request<T>(path, { ...opts, method: 'DELETE' }),
  };
}
