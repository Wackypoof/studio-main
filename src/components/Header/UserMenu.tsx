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
          <Button
            variant="outline"
            size="sm"
            className="gap-2 rounded-full border-white/40 bg-white/10 text-white hover:border-white hover:bg-white/20"
          >
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
          className="rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <Link href="/login">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full bg-transparent text-slate-200 transition hover:bg-white/10 hover:text-white"
        >
          Log in
        </Button>
      </Link>
      <Link href="/signup">
        <Button
          size="sm"
          className="rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-emerald-300 text-slate-950 shadow-[0_10px_25px_rgba(56,189,248,0.35)]"
        >
          Sign up
        </Button>
      </Link>
    </>
  );
});

UserMenu.displayName = 'UserMenu';
