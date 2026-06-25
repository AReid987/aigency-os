import React from 'react';

interface AvatarProps {
  name: string;
  src?: string;
  status?: 'active' | 'thinking' | 'blocked' | 'idle';
  size?: 'sm' | 'md' | 'lg';
}

const statusColors = {
  active: 'bg-green-500',
  thinking: 'bg-yellow-500',
  blocked: 'bg-red-500',
  idle: 'bg-gray-400',
};

export function Avatar({ name, src, status, size = 'md' }: AvatarProps) {
  const sizeClasses = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };
  const ringSize = { sm: 'h-3 w-3', md: 'h-3.5 w-3.5', lg: 'h-4 w-4' };

  return (
    <div className="relative inline-flex">
      {src ? (
        <img src={src} alt={name} className={`${sizeClasses[size]} rounded-full object-cover`} />
      ) : (
        <div
          className={`${sizeClasses[size]} rounded-full bg-blue-600 text-white flex items-center justify-center font-medium`}
        >
          {name.charAt(0).toUpperCase()}
        </div>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${ringSize[size]} ${statusColors[status]} rounded-full ring-2 ring-white`}
        />
      )}
    </div>
  );
}
