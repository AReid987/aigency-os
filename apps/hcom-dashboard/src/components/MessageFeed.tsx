import React from 'react';
import type { HCOMMessage } from '@vscp/shared-types';

interface MessageFeedProps {
  messages: HCOMMessage[];
  maxHeight?: number;
}

export function MessageFeed({ messages, maxHeight = 400 }: MessageFeedProps) {
  return (
    <div className="overflow-auto" style={{ maxHeight }}>
      <div className="space-y-1 p-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start gap-2 px-3 py-1.5 rounded-md hover:bg-bg dark:hover:bg-elevated/50 text-sm"
          >
            <span className="text-fg-muted text-xs whitespace-nowrap mt-0.5">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
            <span className="font-medium text-primary dark:text-blue-400 whitespace-nowrap">
              {msg.senderId.slice(0, 8)}
            </span>
            <span className="text-fg-muted">→</span>
            <span className="font-medium text-green-600 dark:text-green-400 whitespace-nowrap">
              {msg.recipientId ? msg.recipientId.slice(0, 8) : 'broadcast'}
            </span>
            {msg.intent && (
              <span className="text-xs bg-hover bg-hover px-1.5 py-0.5 rounded">
                {msg.intent}
              </span>
            )}
            <span className="text-fg-secondary text-fg-secondary flex-1 truncate">{msg.content}</span>
            <span className={`text-xs ${msg.deliveryStatus === 'delivered' ? 'text-green-500' : 'text-fg-muted'}`}>
              {msg.deliveryStatus === 'delivered' ? '✓' : msg.deliveryStatus === 'read' ? '✓✓' : '⏳'}
            </span>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="p-8 text-center text-fg-muted text-sm">
            No messages yet. Messages between agents will appear here.
          </div>
        )}
      </div>
    </div>
  );
}
