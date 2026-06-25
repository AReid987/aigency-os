import React from 'react';
import type { Ticket } from '@vscp/shared-types';
import { Badge } from '@vscp/ui';

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

const priorityColors = {
  P0: 'border-l-red-500',
  P1: 'border-l-yellow-500',
  P2: 'border-l-blue-500',
};

export function TicketBoard({ tickets, onTicketClick }: TicketBoardProps) {
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {columns.map((col) => {
        const colTickets = tickets.filter((t) => t.status === col.key);
        return (
          <div key={col.key} className="bg-bg bg-elevated/50 rounded-md p-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">{col.label}</h3>
              <Badge variant={col.variant}>{colTickets.length}</Badge>
            </div>
            <div className="flex flex-col gap-2">
              {colTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => onTicketClick?.(ticket)}
                  className={`
                    p-3 bg-surface bg-elevated rounded-md border border-l-4 shadow-sm
                    cursor-pointer hover:shadow-md transition-shadow
                    ${priorityColors[ticket.priority]}
                  `}
                >
                  <p className="font-medium text-sm truncate">{ticket.title}</p>
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
