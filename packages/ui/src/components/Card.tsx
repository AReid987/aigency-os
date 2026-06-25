import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  hoverable?: boolean;
}

export function Card({ children, className = '', selected = false, hoverable = false }: CardProps) {
  return (
    <div
      className={`bg-surface border rounded-md transition-all duration-fast ease-out-expo
        ${selected ? 'border-primary' : 'border-border'}
        ${hoverable ? 'hover:border-border-hover cursor-pointer' : ''}
        ${className}`}
    >
      {children}
    </div>
  );
}
