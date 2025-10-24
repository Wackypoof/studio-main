
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
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950 text-slate-100 shadow-[0_10px_30px_rgba(10,10,45,0.35)]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-28 left-0 h-56 w-56 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      </div>

      <SiteContainer className="relative text-slate-100">
        <div className="flex h-20 items-center justify-between gap-4">
          <Logo />

          <Navigation />

          <div className="hidden items-center gap-3 md:flex">
            <UserMenu />
          </div>

          <MobileMenu />
        </div>
      </SiteContainer>
    </header>
  );
}
