import React from 'react';
import type { HCOMMessage } from '@vscp/shared-types';
import { Check, CheckCheck, Clock } from 'lucide-react';

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
            className="flex items-start gap-2 px-3 py-1.5 rounded-md hover:bg-hover/60 text-sm transition-colors"
          >
            <span className="text-fg-muted text-xs whitespace-nowrap mt-0.5">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </span>
            <span className="font-medium text-primary whitespace-nowrap">
              {msg.senderId.slice(0, 8)}
            </span>
            <span className="text-fg-muted">→</span>
            <span className="font-medium text-success whitespace-nowrap">
              {msg.recipientId ? msg.recipientId.slice(0, 8) : 'broadcast'}
            </span>
            {msg.intent && (
              <span className="text-xs bg-hover/60 backdrop-blur-sm px-1.5 py-0.5 rounded">
                {msg.intent}
              </span>
            )}
            <span className="text-fg-secondary flex-1 truncate">{msg.content}</span>
            <span className="text-xs text-fg-muted">
              {msg.deliveryStatus === 'delivered' && <Check size={12} className="text-success" />}
              {msg.deliveryStatus === 'read' && <CheckCheck size={12} className="text-success" />}
              {msg.deliveryStatus !== 'delivered' && msg.deliveryStatus !== 'read' && (
                <Clock size={12} />
              )}
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
