
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Menu, Search, Briefcase, User, LogOut } from 'lucide-react';
import { SiteContainer } from '@/components/site-container';
import { useAuth } from '@/context/AuthProvider';

export function Header() {
  const { user, isLoading, signOut } = useAuth();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Don't show header on dashboard pages
  if (pathname.startsWith('/dashboard')) {
    return null;
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SiteContainer>
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 h-10 leading-none">
              <Briefcase className="h-6 w-6 text-primary" aria-hidden />
              <span className="font-semibold tracking-tight">SuccessionAsia</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/buyers" className="hover:text-foreground/80 transition-colors">
              For Buyers
            </Link>
            <Link href="/sellers" className="hover:text-foreground/80 transition-colors">
              For Sellers
            </Link>
            <div className="relative group">
              <button className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1 py-2 px-1">
                Pricing
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {/* Dropdown menu with padding to prevent hover gap */}
              <div className="absolute left-1/2 -translate-x-1/2 pt-2">
                <div className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link href="/buyers/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Buyer Pricing</Link>
                  <Link href="/sellers/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Seller Pricing</Link>
                </div>
              </div>
            </div>
            </div>
          </nav>
          
          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {isLoading ? (
              <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            ) : user ? (
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
            ) : (
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
            )}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden ml-auto">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" aria-label="Open menu">
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

        </div>
      </SiteContainer>
    </header>
  );
}
