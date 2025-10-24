
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
            <Sidebar className="border-r">
              <SidebarHeader className="p-4">
                <div className="flex items-center gap-2">
                  <Button asChild variant="ghost" className="h-10 w-10 p-2">
                    <Link href="/dashboard" prefetch={false}>
                      <Briefcase className="h-6 w-6 text-primary" />
                    </Link>
                  </Button>
                  <h2 className="text-lg font-semibold tracking-tight">SuccessionAsia</h2>
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
          <SidebarInset className="flex-1 overflow-hidden m-0">
            <div className="flex h-full flex-1 flex-col w-full">
              <header className="flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-8">
                <SidebarTrigger className="md:hidden" />
              </header>
              <main className="flex-1 overflow-y-auto w-full">
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
