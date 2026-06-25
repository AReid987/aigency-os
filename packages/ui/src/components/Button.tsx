import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const variants = {
  primary:   'bg-primary text-fg-inverse hover:bg-primary-dark',
  accent:    'bg-accent text-white hover:bg-accent-dark',
  secondary: 'bg-elevated text-fg border border-border hover:bg-hover hover:border-border-hover',
  ghost:     'bg-transparent text-fg-secondary border border-border hover:bg-hover hover:text-fg',
  danger:    'bg-error-muted text-error border border-error/20 hover:bg-error/20',
};

const sizes = {
  sm: 'h-[30px] px-3 text-[13px] gap-1.5',
  md: 'h-[36px] px-4 text-[13px] gap-2',
  lg: 'h-[44px] px-5 text-[15px] gap-2',
};

export function Button({ variant = 'primary', size = 'md', icon, className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center font-semibold rounded-sm cursor-pointer
        transition-all duration-fast ease-out-expo outline-none
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
