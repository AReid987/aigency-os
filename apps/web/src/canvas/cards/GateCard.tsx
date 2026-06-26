import React from 'react';
import type { Card } from '@vscp/shared-types';
import { Shield, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@vscp/ui';

interface GateCardProps {
  card: Card;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-warning', badge: 'warning' as const, label: 'Pending Approval' },
  approved: { icon: CheckCircle, color: 'text-success', badge: 'success' as const, label: 'Approved' },
  rejected: { icon: XCircle, color: 'text-error', badge: 'danger' as const, label: 'Rejected' },
  blocked: { icon: XCircle, color: 'text-fg-muted', badge: 'neutral' as const, label: 'Blocked' },
};

export const GateCard = React.memo(function GateCard({ card, editable, onUpdate }: GateCardProps) {
  const content = card.content as Record<string, string>;
  const status = (content.status || 'pending') as keyof typeof statusConfig;
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const handleApprove = () => onUpdate({ status: 'approved' });
  const handleReject = () => onUpdate({ status: 'rejected' });

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Shield size={14} className="text-accent" />
          <span className="text-xs font-semibold text-fg">
            {content.title || 'Milestone Gate'}
          </span>
        </div>
        <Badge variant={config.badge} dot>{config.label}</Badge>
      </div>

      <p className="text-[11px] text-fg-secondary">
        {content.description || 'Approval required to proceed to next milestone.'}
      </p>

      {content.milestone && (
        <div className="text-[10px] text-fg-muted">
          Milestone: <span className="text-fg-secondary font-medium">{content.milestone}</span>
        </div>
      )}

      {status === 'pending' && editable && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={handleApprove}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-sm bg-success/20 text-success hover:bg-success/30 transition-colors"
          >
            <CheckCircle size={10} /> Approve
          </button>
          <button
            onClick={handleReject}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-medium rounded-sm bg-error/20 text-error hover:bg-error/30 transition-colors"
          >
            <XCircle size={10} /> Reject
          </button>
        </div>
      )}

      {status === 'approved' && content.approvedBy && (
        <div className="text-[10px] text-success">
          ✓ Approved by {content.approvedBy}
        </div>
      )}
    </div>
  );
});
