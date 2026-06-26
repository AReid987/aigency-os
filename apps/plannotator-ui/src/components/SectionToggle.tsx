import React from 'react';
import { Badge } from '@vscp/ui';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface SectionToggleProps {
  role: 'domain_expert' | 'technical_founder';
  onRoleChange: (role: 'domain_expert' | 'technical_founder') => void;
}

export function SectionToggle({ role, onRoleChange }: SectionToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-elevated/70 backdrop-blur-sm rounded-md border border-border p-0.5">
      <button
        onClick={() => onRoleChange('domain_expert')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-sm transition-colors ${
          role === 'domain_expert'
            ? 'bg-amber-muted text-amber font-medium'
            : 'text-fg-muted hover:text-fg'
        }`}
      >
        <Eye size={12} />
        Business
      </button>
      <button
        onClick={() => onRoleChange('technical_founder')}
        className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-sm transition-colors ${
          role === 'technical_founder'
            ? 'bg-primary-muted text-primary font-medium'
            : 'text-fg-muted hover:text-fg'
        }`}
      >
        <EyeOff size={12} />
        Full Access
      </button>
    </div>
  );
}
