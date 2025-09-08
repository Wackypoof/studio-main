
'use client';

import React, { useMemo } from 'react';
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
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useRole } from '@/contexts/role-context';
import { RoleToggle } from '@/components/role-toggle';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const { role, isBuyer } = useRole();
  const user = useMemo(() => {
    if (isBuyer) return mockData.testUsers.buyer;
    // For demo purposes, default to seller1 - in a real app, this would come from auth context
    return mockData.testUsers.seller1;
  }, [isBuyer]);
  
  const userInitials = useMemo(() => {
    return user.fullName.split(' ').map((n: string) => n[0]).join('');
  }, [user.fullName]);

  const buyerMenuItems = [
    { href: '/my-dashboard', label: 'Dashboard', icon: Home },
    { href: '/my-dashboard/browse-listings', label: 'Browse Listings', icon: Search },
    { href: '/my-dashboard/saved-listings', label: 'Saved Listings', icon: FileText },
    { href: '/my-dashboard/ndas', label: 'NDAs', icon: FileSignature },
    { href: '/my-dashboard/offers', label: 'My Offers', icon: Handshake },
  ];

  const sellerMenuItems = [
    { href: '/my-dashboard', label: 'Overview', icon: Home },
    { href: '/my-dashboard/listings', label: 'My Listings', icon: Briefcase },
    { href: '/my-dashboard/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/my-dashboard/leads', label: 'Buyer Leads', icon: Users },
    { href: '/my-dashboard/messages', label: 'Messages', icon: MessageSquare },
  ];

  const commonMenuItems = [
    { href: '/my-dashboard/verification', label: 'Verification', icon: ShieldCheck },
  ];

  const menuItems = [
    ...(isBuyer ? buyerMenuItems : sellerMenuItems),
    ...commonMenuItems
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" className="h-10 w-10 p-2">
                <Link href="/my-dashboard">
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
                        <Link href="/my-dashboard/settings">
                            <Settings/>
                            <span>Settings</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Log out" asChild>
                        <Link href="/log-in">
                            <LogOut/>
                            <span>Log out</span>
                        </Link>
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
        <SidebarInset className="w-full overflow-hidden px-4">
            <header className="flex items-center justify-end py-4">
                <SidebarTrigger className="md:hidden" />
            </header>
            <main className="w-full max-w-[calc(100vw-200px)] overflow-x-auto">
                <div className="w-full">
                    {children}
                </div>
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
