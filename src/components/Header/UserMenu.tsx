'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';

export const UserMenu = React.memo(() => {
  const { user, isLoading, signOut } = useAuth();

  if (isLoading) {
    return <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await signOut();
            window.location.href = '/';
          }}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Link href="/login">
        <Button variant="ghost" size="sm">
          Log in
        </Button>
      </Link>
      <Link href="/signup">
        <Button size="sm">Sign up</Button>
      </Link>
    </>
  );
});

UserMenu.displayName = 'UserMenu';
