import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAPIClient } from '../client';

describe('createAPIClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('returns an object with get, post, put, delete methods', () => {
    const client = createAPIClient({ baseUrl: 'http://localhost:3000' });
    expect(typeof client.get).toBe('function');
    expect(typeof client.post).toBe('function');
    expect(typeof client.put).toBe('function');
    expect(typeof client.delete).toBe('function');
  });

  it('sends a GET request with correct URL and headers', async () => {
    const mockResponse = { data: 'test' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const client = createAPIClient({ baseUrl: 'http://localhost:3000' });
    const data = await client.get<typeof mockResponse>('/test');

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/test', expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
      }),
    }));
    expect(data).toEqual(mockResponse);
  });

  it('sends a POST request with body', async () => {
    const mockResponse = { id: 1 };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const client = createAPIClient({ baseUrl: 'http://localhost:3000' });
    const body = { name: 'test' };
    const data = await client.post<typeof mockResponse>('/items', body);

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/items', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify(body),
    }));
  });

  it('throws on non-ok response', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const client = createAPIClient({ baseUrl: 'http://localhost:3000' });
    await expect(client.get('/missing')).rejects.toThrow('API error: 404 Not Found');
  });

  it('merges custom headers with defaults', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const client = createAPIClient({
      baseUrl: 'http://localhost:3000',
      headers: { 'X-Default': 'default-val' },
    });

    await client.get('/protected', {
      headers: { 'X-Custom': 'custom-val' },
    });

    expect(globalThis.fetch).toHaveBeenCalledWith('http://localhost:3000/protected', expect.objectContaining({
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'X-Default': 'default-val',
        'X-Custom': 'custom-val',
      }),
    }));
  });
});
