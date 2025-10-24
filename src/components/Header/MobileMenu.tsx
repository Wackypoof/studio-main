'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, User, LogOut, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthProvider';
import { Logo } from './Logo';

export const MobileMenu = React.memo(() => {
  const { user, signOut } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div className="md:hidden ml-auto">
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0 flex flex-col">
          <div className="px-6 py-4 flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary" aria-hidden />
            <span className="font-semibold tracking-tight">SuccessionAsia</span>
          </div>

          <nav className="px-6 pb-6 flex-1 flex flex-col space-y-4 text-foreground/80">
            <SheetClose asChild>
              <Link href="/buyers" className="block py-2 hover:text-foreground">
                For Buyers
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/sellers" className="block py-2 hover:text-foreground">
                For Sellers
              </Link>
            </SheetClose>

            <div className="space-y-2 pl-3 text-sm">
              <SheetClose asChild>
                <Link href="/buyers/pricing" className="block py-1.5 hover:text-foreground">
                  Buyer Pricing
                </Link>
              </SheetClose>
              <SheetClose asChild>
                <Link href="/sellers/pricing" className="block py-1.5 hover:text-foreground">
                  Seller Pricing
                </Link>
              </SheetClose>
            </div>

            <div className="pt-4 mt-auto border-t border-border">
              {user ? (
                <div className="space-y-4">
                  <SheetClose asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 py-2">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </SheetClose>
                  <button
                    onClick={async () => {
                      await signOut();
                      setIsSheetOpen(false);
                      window.location.href = '/';
                    }}
                    className="flex items-center gap-2 text-destructive py-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="block w-full text-center py-2 border rounded-md hover:bg-accent"
                    >
                      Log in
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link
                      href="/signup"
                      className="block w-full text-center py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      Sign up
                    </Link>
                  </SheetClose>
                </div>
              )}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
});

MobileMenu.displayName = 'MobileMenu';
