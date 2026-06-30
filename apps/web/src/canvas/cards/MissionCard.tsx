import React from 'react';
import type { Card } from '@aigency-os/shared-types';
import { Target, Play, CheckCircle } from 'lucide-react';

interface MissionCardProps {
  card: Card;
  editable: boolean;
  onUpdate: (content: Record<string, unknown>) => void;
}

interface Mission {
  name: string;
  progress: number;
  status: 'running' | 'complete' | 'blocked';
}

const DEFAULT_MISSIONS: Mission[] = [
  { name: 'Launch MVP', progress: 72, status: 'running' },
  { name: 'Onboard Beta Users', progress: 100, status: 'complete' },
  { name: 'Build Agent SDK', progress: 45, status: 'running' },
  { name: 'Series A Prep', progress: 15, status: 'running' },
];

const statusConfig = {
  running: { icon: Play, color: 'text-primary', badge: 'bg-primary/20 text-primary' },
  complete: { icon: CheckCircle, color: 'text-success', badge: 'bg-success/20 text-success' },
  blocked: { icon: Play, color: 'text-error', badge: 'bg-error/20 text-error' },
};

export const MissionCard = React.memo(function MissionCard({ card }: MissionCardProps) {
  const rawContent = card.content as Record<string, unknown>;
  const title = typeof rawContent.title === 'string' ? rawContent.title : 'Active Missions';
  const missions = Array.isArray(rawContent.missions) ? rawContent.missions as Mission[] : DEFAULT_MISSIONS;

  const runningCount = missions.filter((m) => m.status === 'running').length;

  return (
    <div className="p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Target size={14} className="text-amber" />
          <span className="text-xs font-semibold text-fg">{title}</span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber/20 text-amber font-medium">
          {runningCount} active
        </span>
      </div>

      {/* Mission list */}
      <div className="space-y-2">
        {missions.map((mission, i) => {
          const config = statusConfig[mission.status];
          const StatusIcon = config.icon;

          return (
            <div
              key={i}
              className="p-2 rounded border border-border bg-hover/30 space-y-1.5"
            >
              {/* Mission header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 min-w-0">
                  <StatusIcon size={10} className={config.color} />
                  <span className="text-[11px] font-medium text-fg truncate">
                    {mission.name}
                  </span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${config.badge}`}>
                  {mission.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      mission.status === 'complete' ? 'bg-success' : 'bg-primary'
                    }`}
                    style={{ width: `${mission.progress}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono text-fg-muted w-7 text-right">
                  {mission.progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
