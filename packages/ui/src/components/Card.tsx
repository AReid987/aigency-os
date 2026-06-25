import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
}

export function Card({ children, className = '', selected = false }: CardProps) {
  return (
    <div
      className={`rounded-lg border bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 ${
        selected ? 'ring-2 ring-blue-500' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
