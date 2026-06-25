import React, { useState } from 'react';
import { Button } from '@vscp/ui';

interface BoardActionsProps {
  onApprove?: (decision: string) => void;
  onReject?: (decision: string) => void;
  pendingDecisions?: Array<{ id: string; type: string; description: string }>;
}

export function BoardActions({ onApprove, onReject, pendingDecisions = [] }: BoardActionsProps) {
  const [comment, setComment] = useState('');

  if (pendingDecisions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400 text-sm">
        No pending board decisions.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold text-sm">Pending Board Decisions</h3>
      {pendingDecisions.map((decision) => (
        <div key={decision.id} className="p-4 rounded-lg border bg-white dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{decision.type}</p>
              <p className="text-sm text-gray-500 mt-1">{decision.description}</p>
            </div>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment (optional)..."
            className="mt-3 w-full p-2 text-sm border rounded-md dark:bg-gray-700 dark:border-gray-600"
            rows={2}
          />
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="primary" onClick={() => onApprove?.(decision.id)}>
              ✅ Approve
            </Button>
            <Button size="sm" variant="danger" onClick={() => onReject?.(decision.id)}>
              ❌ Reject
            </Button>
            <Button size="sm" variant="ghost">
              💬 Comment
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
