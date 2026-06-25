import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  status?: 'active' | 'thinking' | 'blocked' | 'idle';
  size?: 'sm' | 'md' | 'lg';
}

const statusColors = {
  active: 'bg-primary',
  thinking: 'bg-warning',
  blocked: 'bg-error',
  idle: 'bg-fg-muted',
};

const statusGlow = {
  active: 'shadow-[0_0_5px_rgba(18,165,148,0.5)]',
  thinking: '',
  blocked: '',
  idle: '',
};

export function Avatar({ name, src, status, size = 'md' }: AvatarProps) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };
  const dots = { sm: 'h-2.5 w-2.5', md: 'h-3 w-3', lg: 'h-3.5 w-3.5' };

  return (
    <div className="relative inline-flex">
      {src ? (
        <img src={src} alt={name} className={`${sizes[size]} rounded-sm object-cover`} />
      ) : (
        <div className={`${sizes[size]} rounded-sm bg-primary-muted text-primary flex items-center justify-center font-bold`}>
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 ${dots[size]} ${statusColors[status]} ${statusGlow[status]}
            rounded-full ring-2 ring-surface`}
        />
      )}
    </div>
  );
}
