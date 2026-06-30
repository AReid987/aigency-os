// ─── App Header ─────────────────────────────────────────────────────────────

import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { Avatar, Badge } from '@aigency-os/ui';

export function Header() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-12 px-4 flex items-center justify-between border-b border-border bg-surface/70 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold font-display">Aigency OS</span>
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <>
            <Badge variant={user.role === 'admin' ? 'primary' : 'info'}>
              {user.role === 'admin' ? 'Admin' : user.role === 'domain_expert' ? 'Domain Expert' : user.role}
            </Badge>
            <div className="flex items-center gap-2">
              <Avatar name={user.name} size="sm" />
              <span className="text-xs font-medium">{user.name}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
