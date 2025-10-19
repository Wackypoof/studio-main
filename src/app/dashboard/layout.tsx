
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
import { mockData } from '@/lib/data';
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
  
  const user = useMemo(() => {
    if (isBuyer) return mockData.testUsers.buyer;
    // For demo purposes, default to seller1 - in a real app, this would come from auth context
    return mockData.testUsers.seller1;
  }, [isBuyer]);
  
  const userInitials = useMemo(() => {
    return user.fullName.split(' ').map((n: string) => n[0]).join('');
  }, [user.fullName]);

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

  const menuItems = [
    ...(isBuyer ? buyerMenuItems : sellerMenuItems),
    ...commonMenuItems
  ];

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden">
          <Sidebar className="border-r">
            <SidebarHeader className="p-4">
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="h-10 w-10 p-2">
                  <Link href="/dashboard">
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
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>

              <RoleToggle />
            </SidebarContent>
            <SidebarFooter className="p-2">
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="Settings" asChild>
                    <Link href="/dashboard/settings">
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
                  <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{user.fullName}</span>
                  <span className="text-xs text-muted-foreground">
                    {isBuyer ? 'Buyer' : 'Seller'} • {user.email}
                  </span>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="flex-1 overflow-hidden">
            <div className="flex h-full flex-1 flex-col">
              <header className="flex items-center justify-between border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-8">
                <SidebarTrigger className="md:hidden" />
              </header>
              <main className="flex-1 overflow-y-auto">
                <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 py-6 md:px-6 lg:px-10 lg:py-10">
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
