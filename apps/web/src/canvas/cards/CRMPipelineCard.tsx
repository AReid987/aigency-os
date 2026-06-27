import React, { useMemo } from 'react';
import type { Card } from '@vscp/shared-types';
import { TrendingUp } from 'lucide-react';

interface CRMPipelineCardProps {
  card: Card;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface PipelineStage {
  name: string;
  deals: number;
  value: number;
  color: string;
}

const DEFAULT_STAGES: PipelineStage[] = [
  { name: 'Lead', deals: 12, value: 48000, color: 'bg-fg-muted' },
  { name: 'Qualified', deals: 8, value: 96000, color: 'bg-info' },
  { name: 'Proposal', deals: 5, value: 125000, color: 'bg-primary' },
  { name: 'Negotiation', deals: 3, value: 105000, color: 'bg-warning' },
  { name: 'Closed Won', deals: 2, value: 80000, color: 'bg-success' },
];

export const CRMPipelineCard = React.memo(function CRMPipelineCard({ card }: CRMPipelineCardProps) {
  const rawContent = card.content as Record<string, unknown>;
  const title = typeof rawContent.title === 'string' ? rawContent.title : 'CRM Pipeline';
  const stages = Array.isArray(rawContent.stages) ? rawContent.stages as PipelineStage[] : DEFAULT_STAGES;

  const { totalValue, totalDeals, maxValue } = useMemo(() => {
    const totalValue = stages.reduce((sum, s) => sum + s.value, 0);
    const totalDeals = stages.reduce((sum, s) => sum + s.deals, 0);
    const maxValue = Math.max(...stages.map((s) => s.value));
    return { totalValue, totalDeals, maxValue };
  }, [stages]);

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={14} className="text-success" />
          <span className="text-xs font-semibold text-fg">{title}</span>
        </div>
        <span className="text-[10px] text-fg-muted">{totalDeals} deals</span>
      </div>

      {/* Horizontal bar chart */}
      <div className="space-y-2">
        {stages.map((stage, i) => {
          const barWidth = maxValue > 0 ? (stage.value / maxValue) * 100 : 0;

          return (
            <div key={i} className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-fg-secondary font-medium">{stage.name}</span>
                <span className="text-[10px] font-mono text-fg-muted">
                  ${(stage.value / 1000).toFixed(0)}k
                  <span className="text-fg-muted/60 ml-1">({stage.deals})</span>
                </span>
              </div>
              <div className="h-2 w-full bg-border/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${stage.color}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Total pipeline value */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-[10px] text-fg-muted font-medium">Total Pipeline</span>
        <span className="text-sm font-bold font-mono text-success">
          ${totalValue.toLocaleString()}
        </span>
      </div>
    </div>
  );
});
