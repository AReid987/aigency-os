import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showLabel?: boolean;
}

const variantColors = {
  default: 'bg-blue-600',
  success: 'bg-green-600',
  warning: 'bg-yellow-500',
  danger: 'bg-red-600',
};

export function ProgressBar({ value, max = 100, variant = 'default', showLabel = false }: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);
  const autoVariant = percentage >= 90 ? 'danger' : percentage >= 70 ? 'warning' : variant;

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>{value}</span>
          <span>{percentage}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
        <div
          className={`h-full rounded-full transition-all ${variantColors[autoVariant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
