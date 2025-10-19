
'use client';

import { usePathname } from 'next/navigation';
import { SiteContainer } from '@/components/site-container';
import { Logo, Navigation, UserMenu, MobileMenu } from './Header';

export function Header() {
  const pathname = usePathname();

  // Don't show header on dashboard pages
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SiteContainer>
        <div className="relative flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo className="flex items-center gap-3" />

          {/* Desktop Navigation - Centered */}
          <Navigation />

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <UserMenu />
          </div>

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </SiteContainer>
    </header>
  );
}
