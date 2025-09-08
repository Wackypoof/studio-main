'use client';

import { useState } from 'react';
import { useRole } from '@/contexts/role-context';
import { Briefcase, User } from 'lucide-react';
import { cn } from '@/lib/utils';

type Role = 'buyer' | 'seller';

const roleConfig = {
  buyer: {
    label: 'Buying',
    icon: Briefcase,
    activeBg: 'bg-blue-500',
    hoverBg: 'hover:bg-blue-100',
    activeText: 'text-white',
    inactiveText: 'text-muted-foreground',
  },
  seller: {
    label: 'Selling',
    icon: User,
    activeBg: 'bg-green-500',
    hoverBg: 'hover:bg-green-100',
    activeText: 'text-white',
    inactiveText: 'text-muted-foreground',
  },
} as const;

export function RoleToggle() {
  const { isBuyer, toggleRole } = useRole();
  const [isToggling, setIsToggling] = useState(false);
  const currentRole: Role = isBuyer ? 'buyer' : 'seller';

  const handleToggle = async () => {
    try {
      setIsToggling(true);
      await toggleRole();
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="p-3 border-t">
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          {isBuyer 
            ? 'Viewing as a buyer. Switch to sell your business.'
            : 'Viewing as a seller. Switch to browse listings.'
          }
        </p>
        <div className="flex rounded-lg bg-muted p-1">
          {(['buyer', 'seller'] as const).map((role) => {
            const isActive = currentRole === role;
            const config = roleConfig[role];
            const Icon = config.icon;

            return (
              <button
                key={role}
                onClick={handleToggle}
                disabled={isToggling}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 rounded-md py-1.5 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  isActive 
                    ? `${config.activeBg} ${config.activeText} shadow`
                    : `${config.inactiveText} ${config.hoverBg}`,
                  `focus-visible:ring-${role === 'buyer' ? 'blue' : 'green'}-500`
                )}
                aria-pressed={isActive}
                aria-busy={isToggling}
              >
                <Icon className="h-4 w-4" />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
