
'use client';

import React, { useMemo } from 'react';
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
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/role-context';
import { RoleToggle } from '@/components/role-toggle';
import { useAuth } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const { role, isBuyer } = useRole();
  const { signOut } = useAuth();
  const router = useRouter();
  
  const { user } = useAuth();

  const gradientOverlay = isBuyer
    ? 'radial-gradient(140% 140% at 0% 0%, rgba(37,99,235,0.32), transparent 60%), radial-gradient(120% 120% at 100% 0%, rgba(56,189,248,0.22), transparent 65%)'
    : 'radial-gradient(140% 140% at 0% 0%, rgba(251,191,36,0.3), transparent 60%), radial-gradient(120% 120% at 100% 0%, rgba(249,115,22,0.22), transparent 65%)';

  const badgeGradient = isBuyer
    ? 'from-blue-500 via-blue-400 to-emerald-300'
    : 'from-amber-400 via-orange-400 to-rose-300';

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
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
                    <Briefcase className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold tracking-tight">Succession Asia</h2>
                    <p className="text-xs text-slate-500">Growth acquisition platform</p>
                  </div>
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
                      onClick={async () => {
                        await signOut();
                        router.push('/login');
                      }}
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
              <header className="relative flex items-center justify-between px-4 py-4 lg:px-8">
                <SidebarTrigger className="md:hidden" />
                <div className="hidden flex-col gap-1 md:flex">
                  <span
                    className={cn(
                      'inline-flex items-center gap-2 self-start rounded-full bg-gradient-to-r px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-950 shadow-sm',
                      badgeGradient
                    )}
                  >
                    {modeLabel}
                  </span>
                  <span className="text-xs text-slate-600">{modeHelper}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 md:text-sm">
                  <span className="hidden md:inline">Need to change roles?</span>
                  <Link
                    href={isBuyer ? '/sellers' : '/buyers'}
                    prefetch={false}
                    className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-white hover:text-slate-900"
                  >
                    {isBuyer ? 'Explore seller playbooks' : 'Browse buyer resources'}
                  </Link>
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
