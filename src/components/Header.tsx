
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Search, Briefcase } from 'lucide-react';
import { SiteContainer } from '@/components/site-container';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SiteContainer>
        <div className="relative flex h-16 items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 h-10 leading-none">
              <Briefcase className="h-6 w-6 text-primary" aria-hidden />
              <span className="font-semibold tracking-tight">SuccessionAsia</span>
            </Link>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden ml-auto">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <div className="px-6 py-4 flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary" aria-hidden />
                  <span className="font-semibold tracking-tight">SuccessionAsia</span>
                </div>
                <nav className="px-6 pb-6 flex flex-col space-y-3 text-foreground/80">
                  <Link href="/browse">Browse</Link>
                  <Link href="/sell">Sell</Link>
                  <Link href="/about">About</Link>
                  <Link href="/log-in">Log in</Link>
                  <Link href="/sign-up" className="font-medium text-primary">Sign up</Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-6 text-sm h-10 leading-none absolute left-1/2 -translate-x-1/2">
            <Link href="/browse" className="text-foreground hover:text-foreground/80">Browse</Link>
            <Link href="/sell" className="text-foreground/70 hover:text-foreground">Sell</Link>
            <Link href="/about" className="text-foreground/70 hover:text-foreground">About</Link>
          </nav>

          <div className="hidden md:flex items-center justify-end gap-2 ml-auto">
            <Button variant="ghost" className="h-10 leading-none" asChild>
              <Link href="/log-in">Log in</Link>
            </Button>
            <Button className="h-10 leading-none" asChild>
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </SiteContainer>
    </header>
  );
}
