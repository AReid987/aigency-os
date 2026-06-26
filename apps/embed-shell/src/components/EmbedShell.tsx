import React, { useRef, useEffect, useCallback, useState } from 'react';

export interface EmbedConfig {
  id: string;
  src: string;
  title: string;
  width?: number;
  height?: number;
  allow?: string;
}

interface EmbedShellProps {
  config: EmbedConfig;
  onMessage?: (data: unknown) => void;
}

/**
 * EmbedShell — Micro-frontend sandbox for embedding service UIs in cards.
 * Uses iframe + postMessage bridge for cross-origin communication.
 */
export function EmbedShell({ config, onMessage }: EmbedShellProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for postMessage from iframe
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      // Validate origin if needed
      if (event.data?.embedId === config.id) {
        onMessage?.(event.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [config.id, onMessage]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setError(null);
  }, []);

  const handleError = useCallback(() => {
    setError(`Failed to load: ${config.title}`);
  }, [config.title]);

  // Send message to iframe
  const sendToEmbed = useCallback((data: Record<string, unknown>) => {
    iframeRef.current?.contentWindow?.postMessage(
      { ...data, embedId: config.id },
      '*',
    );
  }, [config.id]);

  return (
    <div className="embed-shell relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Loading state */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-900/20">
          <div className="text-center text-red-600 dark:text-red-400">
            <p className="text-sm font-medium">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoaded(false);
                iframeRef.current?.contentWindow?.location.reload();
              }}
              className="mt-2 text-xs underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={config.src}
        title={config.title}
        width={config.width ?? '100%'}
        height={config.height ?? 400}
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        allow={config.allow ?? 'clipboard-write'}
        className="w-full border-0"
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.2s' }}
      />
    </div>
  );
}

// ─── Service Discovery ───────────────────────────────────────────────────────

const EMBED_REGISTRY: Record<string, EmbedConfig> = {
  paperclip: {
    id: 'paperclip',
    src: 'http://localhost:3001',
    title: 'Paperclip Dashboard',
    allow: 'clipboard-write',
  },
  hcom: {
    id: 'hcom',
    src: 'http://localhost:3004',
    title: 'HCOM Agent Monitor',
    allow: 'clipboard-write',
  },
  plannotator: {
    id: 'plannotator',
    src: 'http://localhost:3003',
    title: 'Plannotator Review',
    allow: 'clipboard-write',
  },
};

export function getEmbedConfig(serviceId: string): EmbedConfig | undefined {
  return EMBED_REGISTRY[serviceId];
}

export function registerEmbed(serviceId: string, config: EmbedConfig): void {
  EMBED_REGISTRY[serviceId] = config;
}
