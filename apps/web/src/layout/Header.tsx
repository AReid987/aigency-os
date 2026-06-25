// ─── App Header ─────────────────────────────────────────────────────────────

import React from 'react';
import { useUserStore } from '../stores/userStore';
import { Avatar, Badge } from '@vscp/ui';
import type { UserRole } from '@vscp/shared-types';

export function Header() {
  const { user, role, setRole } = useUserStore();

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/80 bg-surface/80 backdrop-blur-md border-b border-border border-border">
      <div className="flex items-center justify-between h-12 px-4">
        {/* Left: Logo and nav */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm font-bold text-fg text-fg">
              Agor Canvas
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-medium rounded-md bg-hover bg-elevated text-fg text-fg">
              Canvas
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-fg-muted hover:bg-hover dark:hover:bg-elevated">
              Brain
            </button>
            <button className="px-3 py-1.5 text-xs font-medium rounded-md text-fg-muted hover:bg-hover dark:hover:bg-elevated">
              CRM
            </button>
          </nav>
        </div>

        {/* Center: Role switcher (for demo) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-fg-muted uppercase tracking-wider">Role:</span>
          <button
            onClick={() => handleRoleSwitch('domain_expert')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              role === 'domain_expert'
                ? 'bg-amber-100 text-amber-800 font-medium'
                : 'text-fg-muted hover:bg-hover dark:hover:bg-elevated'
            }`}
          >
            Domain Expert
          </button>
          <button
            onClick={() => handleRoleSwitch('technical_founder')}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              role === 'technical_founder'
                ? 'bg-blue-100 text-blue-800 font-medium'
                : 'text-fg-muted hover:bg-hover dark:hover:bg-elevated'
            }`}
          >
            Technical Founder
          </button>
        </div>

        {/* Right: User */}
        <div className="flex items-center gap-3">
          <Badge variant={role === 'domain_expert' ? 'warning' : 'info'}>
            {role === 'domain_expert' ? 'DE' : 'TF'}
          </Badge>
          <Avatar
            name={user?.name || 'User'}
            status="active"
            size="sm"
          />
        </div>
      </div>
    </header>
  );
}
