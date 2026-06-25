import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  dot?: boolean;
  pill?: boolean;
}

const variants = {
  neutral: { bg: 'bg-[#1a2233]', text: 'text-fg-secondary', border: 'border-border', dot: 'bg-fg-muted' },
  primary: { bg: 'bg-primary-muted', text: 'text-primary', border: 'border-primary/30', dot: 'bg-primary' },
  accent:  { bg: 'bg-accent-muted', text: 'text-accent', border: 'border-accent/30', dot: 'bg-accent' },
  success: { bg: 'bg-success-muted', text: 'text-success', border: 'border-success/30', dot: 'bg-success' },
  warning: { bg: 'bg-warning-muted', text: 'text-warning', border: 'border-warning/30', dot: 'bg-warning' },
  danger:  { bg: 'bg-error-muted', text: 'text-error', border: 'border-error/30', dot: 'bg-error' },
  info:    { bg: 'bg-info-muted', text: 'text-info', border: 'border-info/30', dot: 'bg-info' },
};

export function Badge({ children, variant = 'neutral', dot = false, pill = false }: BadgeProps) {
  const v = variants[variant];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold leading-ui
        border whitespace-nowrap tracking-wide
        ${v.bg} ${v.text} ${v.border}
        ${pill ? 'rounded-full' : 'rounded-xs'}
        px-2 py-0.5`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${v.dot}
          ${variant === 'primary' ? 'shadow-[0_0_5px_rgba(18,165,148,0.5)]' : ''}`} />
      )}
      {children}
    </span>
  );
}
