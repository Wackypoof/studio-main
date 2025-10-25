'use client';

import { usePathname } from 'next/navigation';
import { SiteContainer } from '@/components/site-container';
import { cn } from '@/lib/utils';
import { Logo, Navigation, UserMenu, MobileMenu } from './Header';

export function Header() {
  const pathname = usePathname();
  const isSellerPage = pathname.startsWith('/sellers');

  const gradientTheme = isSellerPage
    ? {
        headerBg: 'bg-stone-950',
        shadow: 'shadow-[0_10px_30px_rgba(80,45,10,0.35)]',
        glowOne: 'bg-amber-500/30',
        glowTwo: 'bg-orange-400/20',
        borderAccent: 'bg-gradient-to-r from-transparent via-amber-200/50 to-transparent',
      }
    : {
        headerBg: 'bg-slate-950',
        shadow: 'shadow-[0_10px_30px_rgba(10,10,45,0.35)]',
        glowOne: 'bg-blue-500/25',
        glowTwo: 'bg-sky-400/20',
        borderAccent: 'bg-gradient-to-r from-transparent via-white/25 to-transparent',
      };

  // Don't show header on dashboard pages
  if (pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-white/10 text-slate-100 transition-colors duration-500 ease-out',
        gradientTheme.headerBg,
        gradientTheme.shadow,
      )}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={cn('absolute -top-28 left-0 h-56 w-56 rounded-full blur-3xl', gradientTheme.glowOne)}
        />
        <div
          className={cn('absolute -bottom-32 right-0 h-72 w-72 rounded-full blur-3xl', gradientTheme.glowTwo)}
        />
        <div className={cn('absolute inset-x-0 top-0 h-px', gradientTheme.borderAccent)} />
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
