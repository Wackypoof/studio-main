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
    const { error } = await signOut();
    if (error) {
      setIsLoggingOut(false);
      return;
    }
    router.replace('/landing');
    router.refresh();
  }, [router, signOut]);

  const gradientOverlay = isBuyer
    ? 'radial-gradient(140% 140% at 0% 0%, rgba(37,99,235,0.32), transparent 60%), radial-gradient(120% 120% at 100% 0%, rgba(56,189,248,0.22), transparent 65%)'
    : 'radial-gradient(140% 140% at 0% 0%, rgba(251,191,36,0.3), transparent 60%), radial-gradient(120% 120% at 100% 0%, rgba(249,115,22,0.22), transparent 65%)';

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
            <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-90"
              style={{ background: gradientOverlay }}
              aria-hidden="true"
            />
            <div className="flex h-full w-full flex-1 flex-col">
              <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-sm md:px-6 lg:px-8">
                <SidebarTrigger className="md:hidden text-slate-500 transition-colors hover:text-slate-900" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
                  {modeLabel}
                </span>
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
