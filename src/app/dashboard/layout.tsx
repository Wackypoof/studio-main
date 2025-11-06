'use client';

import React, { useCallback, useMemo, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  Home,
  ShieldCheck,
  Briefcase,
  LogOut,
  Settings,
  LayoutGrid,
  Search,
  FileText,
  FileSignature,
  Handshake,
  BarChart2,
  Users,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRole } from '@/contexts/role-context';
import { RoleToggle } from '@/components/role-toggle';
import { useAuth } from '@/context/AuthProvider';
import { Logo } from '@/components/Header/Logo';
import { clearAuthRedirect, setAuthRedirect } from '@/lib/auth-redirect';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { isBuyer } = useRole();
  const { user, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    setAuthRedirect('/landing');
    const { error } = await signOut();
    if (error) {
      clearAuthRedirect();
      setIsLoggingOut(false);
      return;
    }
    router.replace('/landing');
    router.refresh();
  }, [router, signOut]);

  const theme = isBuyer
    ? {
        overlay:
          'radial-gradient(140% 140% at 0% 0%, rgba(37,99,235,0.35), transparent 60%), radial-gradient(120% 120% at 100% 0%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(120% 160% at 50% 100%, rgba(14,116,144,0.12), transparent 75%)',
        orbOne: 'bg-blue-500/25',
        orbTwo: 'bg-sky-400/25',
        orbThree: 'bg-indigo-500/15',
        chipGradient: 'bg-gradient-to-r from-blue-500/20 via-sky-400/15 to-emerald-400/20',
        chipBorder: 'border-blue-200/40',
        chipDot: 'bg-emerald-300/80',
        helper: 'text-blue-900/70',
      }
    : {
        overlay:
          'radial-gradient(140% 140% at 0% 0%, rgba(251,191,36,0.32), transparent 60%), radial-gradient(120% 120% at 100% 0%, rgba(249,115,22,0.2), transparent 60%), radial-gradient(120% 160% at 50% 100%, rgba(190,24,93,0.14), transparent 75%)',
        orbOne: 'bg-amber-400/25',
        orbTwo: 'bg-orange-500/20',
        orbThree: 'bg-rose-400/15',
        chipGradient: 'bg-gradient-to-r from-amber-400/20 via-orange-400/15 to-rose-400/20',
        chipBorder: 'border-amber-200/40',
        chipDot: 'bg-rose-200/80',
        helper: 'text-amber-900/70',
      };

  const modeLabel = isBuyer ? 'Buyer workspace' : 'Seller workspace';
  const modeHelper = isBuyer
    ? 'Curated deal flow & diligence tools'
    : 'Deal desk support & exit tooling';

  const displayName = useMemo(() => {
    const metaName = user?.user_metadata?.full_name as string | undefined;
    return metaName || user?.email || 'User';
  }, [user]);

  const avatarUrl = useMemo(() => (user?.user_metadata?.avatar_url as string) || '', [user]);

  const userInitials = useMemo(() => {
    const n = (user?.user_metadata?.full_name as string) || '';
    if (!n) return (user?.email?.[0] || '?').toUpperCase();
    return n
      .split(' ')
      .filter(Boolean)
      .map((s) => s[0]?.toUpperCase())
      .slice(0, 2)
      .join('');
  }, [user]);

  const buyerMenuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/dashboard/browse-listings', label: 'Browse Listings', icon: Search },
    { href: '/dashboard/saved-listings', label: 'Saved Listings', icon: FileText },
    { href: '/dashboard/ndas', label: 'NDAs', icon: FileSignature },
    { href: '/dashboard/offers', label: 'My Offers', icon: Handshake },
  ];

  const sellerMenuItems = [
    { href: '/dashboard', label: 'Overview', icon: Home },
    { href: '/dashboard/listings', label: 'My Listings', icon: Briefcase },
    { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/dashboard/leads', label: 'Buyer Leads', icon: Users },
  ];

  const commonMenuItems = [
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
    { href: '/dashboard/verification', label: 'Verification', icon: ShieldCheck },
  ];

  // Admin menu (client-side hint only). Server routes still enforce ADMIN_EMAILS.
  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const isAdminUser = !!user?.email && adminEmails.includes(user.email.toLowerCase());

  const adminMenuItems = isAdminUser
    ? ([{ href: '/dashboard/admin', label: 'Admin', icon: LayoutGrid }] as const)
    : ([] as const);

  const menuItems = [
    ...(isBuyer ? buyerMenuItems : sellerMenuItems),
    ...commonMenuItems,
    ...adminMenuItems,
  ];

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden w-full">
            <Sidebar className="border-r bg-white/80 backdrop-blur">
              <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white/80 px-3 py-2 shadow-sm">
                  <Logo clickable={false} />
                </div>
              </SidebarHeader>
              <SidebarContent className="p-2">
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.label}
                      >
                        <Link href={item.href} prefetch={false}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarContent>
              <SidebarFooter className="p-2">
                <RoleToggle />
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings" asChild>
                      <Link href="/dashboard/settings" prefetch={false}>
                        <Settings/>
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      tooltip="Log out" 
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
                <div className="flex items-center gap-3 p-2 rounded-md bg-muted/60">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarUrl || undefined} alt={displayName} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">{displayName}</span>
                    <span className="text-xs text-muted-foreground">
                      {isBuyer ? 'Buyer' : 'Seller'}{user?.email ? ` • ${user.email}` : ''}
                    </span>
                  </div>
                </div>
              </SidebarFooter>
            </Sidebar>
          <SidebarInset className="relative m-0 flex-1 overflow-hidden bg-white">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 opacity-90" style={{ background: theme.overlay }} />
          <div className={cn('absolute -top-32 -left-24 h-72 w-72 rounded-full blur-3xl', theme.orbOne)} />
          <div className={cn('absolute -bottom-28 right-[-6rem] h-80 w-80 rounded-full blur-3xl', theme.orbTwo)} />
          <div className={cn('absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full blur-3xl', theme.orbThree)} />
        </div>
            <div className="flex h-full w-full flex-1 flex-col">
          <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-slate-200/60 bg-white/85 px-4 py-3 backdrop-blur md:px-6 lg:px-8">
            <SidebarTrigger className="text-slate-500 transition-colors hover:text-slate-900 md:hidden" />
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <span
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-slate-900/80 shadow-sm shadow-slate-900/5 backdrop-blur-sm',
                  theme.chipGradient,
                  theme.chipBorder,
                )}
              >
                <span className={cn('h-2 w-2 rounded-full', theme.chipDot)} />
                {modeLabel}
              </span>
              <span className={cn('text-xs font-medium', theme.helper)}>
                {modeHelper}
              </span>
            </div>
          </header>
              <main className="flex-1 w-full overflow-y-auto">
                <div className="flex w-full flex-col gap-8 px-4 py-6 md:px-6 lg:px-10 lg:py-10">
                  {children}
                </div>
              </main>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
