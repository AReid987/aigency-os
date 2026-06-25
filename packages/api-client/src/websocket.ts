export interface WebSocketClientConfig {
  url: string;
  token?: string;
  reconnectInterval?: number;
  maxReconnects?: number;
}

export function createWebSocketClient(config: WebSocketClientConfig) {
  const { url, token, reconnectInterval = 3000, maxReconnects = 10 } = config;
  let ws: WebSocket | null = null;
  let reconnectCount = 0;
  const listeners = new Map<string, Set<(data: unknown) => void>>();

  function connect() {
    ws = new WebSocket(url);

    ws.onopen = () => {
      reconnectCount = 0;
      if (token) {
        ws?.send(JSON.stringify({ type: 'auth', token }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const handlers = listeners.get(data.type);
        handlers?.forEach((handler) => handler(data.payload));
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      if (reconnectCount < maxReconnects) {
        reconnectCount++;
        setTimeout(connect, reconnectInterval);
      }
    };
  }

  function on(event: string, handler: (data: unknown) => void) {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event)!.add(handler);
    return () => listeners.get(event)?.delete(handler);
  }

  function emit(event: string, data: unknown) {
    ws?.send(JSON.stringify({ type: event, payload: data }));
  }

  function disconnect() {
    ws?.close();
    ws = null;
  }

  return { connect, on, emit, disconnect };
}
