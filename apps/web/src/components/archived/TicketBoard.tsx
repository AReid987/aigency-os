import React from 'react';
import type { Ticket } from '@aigency-os/shared-types';
import { Badge } from '@aigency-os/ui';
import { AlertCircle } from 'lucide-react';

interface TicketBoardProps {
  tickets: Ticket[];
  onTicketClick?: (ticket: Ticket) => void;
}

const columns = [
  { key: 'backlog', label: 'Backlog', variant: 'neutral' as const },
  { key: 'in_progress', label: 'In Progress', variant: 'info' as const },
  { key: 'review', label: 'Review', variant: 'warning' as const },
  { key: 'done', label: 'Done', variant: 'success' as const },
];

const priorityIcons = {
  P0: <AlertCircle size={14} className="text-error" />,
  P1: <AlertCircle size={14} className="text-warning" />,
  P2: <AlertCircle size={14} className="text-info" />,
};

export function TicketBoard({ tickets, onTicketClick }: TicketBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {columns.map((col) => {
        const colTickets = tickets.filter((t) => t.status === col.key);
        return (
          <div key={col.key} className="bg-elevated/50 backdrop-blur-md rounded-md p-3 border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{col.label}</h3>
              <Badge variant={col.variant}>{colTickets.length}</Badge>
            </div>
            <div className="flex flex-col gap-2">
              {colTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onTicketClick?.(ticket)}
                  className="p-3 bg-surface/70 backdrop-blur-sm rounded-md border border-border shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] cursor-pointer hover:border-border-hover transition-colors"
                >
                  <div className="flex items-start gap-2">
                    {priorityIcons[ticket.priority]}
                    <p className="font-medium text-sm truncate flex-1">{ticket.title}</p>
                  </div>
                  <p className="text-xs text-fg-muted mt-1 line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={ticket.priority === 'P0' ? 'danger' : ticket.priority === 'P1' ? 'warning' : 'info'}>
                      {ticket.priority}
                    </Badge>
                    {ticket.comments.length > 0 && (
                      <span className="text-xs text-fg-muted">{ticket.comments.length} comments</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
