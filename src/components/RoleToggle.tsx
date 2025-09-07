'use client';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useRole } from '@/contexts/RoleContext';
import { Briefcase, User } from 'lucide-react';

export function RoleToggle() {
  const { role, toggleRole, isBuyer } = useRole();
  
  return (
    <div className="p-4 border-t">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isBuyer ? (
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          ) : (
            <User className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="text-sm font-medium">
            {isBuyer ? 'Buyer' : 'Seller'} Mode
          </span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleRole}
          className="text-xs h-7"
        >
          Switch to {isBuyer ? 'Seller' : 'Buyer'} View
        </Button>
      </div>
    </div>
  );
}
