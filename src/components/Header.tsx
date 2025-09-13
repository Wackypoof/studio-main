
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
                  <Link href="/buyers">For Buyers</Link>
                  <Link href="/sellers">For Sellers</Link>
                  <div className="space-y-2 pl-3 text-sm">
                    <Link href="/buyers/pricing" className="block">Buyer Pricing</Link>
                    <Link href="/sellers/pricing" className="block">Seller Pricing</Link>
                  </div>
                  <div className="pt-4 mt-4 border-t border-border">
                    <Link href="/log-in">Log in</Link>
                    <Link href="/sign-up" className="ml-4 font-medium text-primary">Sign up</Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-6 text-sm h-10 leading-none absolute left-1/2 -translate-x-1/2">
            <Link href="/buyers" className="text-foreground hover:text-foreground/80 transition-colors">For Buyers</Link>
            <Link href="/sellers" className="text-foreground/70 hover:text-foreground transition-colors">For Sellers</Link>
            <div className="group relative">
              <button className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1">
                Pricing
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 hidden group-hover:block z-50">
                <Link href="/buyers/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Buyer Pricing</Link>
                <Link href="/sellers/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Seller Pricing</Link>
              </div>
            </div>
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
