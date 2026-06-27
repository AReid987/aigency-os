import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
  className?: string;
}

const colors = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-error',
};

export function ProgressBar({ value, max = 100, variant = 'default', showLabel = false, className }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const auto = pct >= 90 ? 'danger' : pct >= 70 ? 'warning' : variant;

  return (
    <div className={`w-full ${className ?? ''}`}>
      {showLabel && (
        <div className="flex justify-between text-xs text-fg-muted mb-1 font-mono">
          <span>{value}</span>
          <span>{pct}%</span>
        </div>
      )}
      <div className="h-1.5 w-full rounded-full bg-[#1a2233]">
        <div
          className={`h-full rounded-full transition-all duration-normal ease-out-expo ${colors[auto]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
