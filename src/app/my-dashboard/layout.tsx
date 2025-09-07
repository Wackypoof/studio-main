
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
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockData } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const buyer = useMemo(() => mockData.testUsers.buyer, []);
  
  const buyerInitials = useMemo(() => {
    return buyer.fullName.split(' ').map((n) => n[0]).join('');
  }, [buyer.fullName]);

  const menuItems = [
    { href: '/my-dashboard', label: 'Dashboard', icon: Home },
    {
      href: '/my-dashboard/my-deals',
      label: 'My Deals',
      icon: LayoutGrid,
    },
    {
      href: '/my-dashboard/browse-listings',
      label: 'Browse Listings',
      icon: Search,
    },
    {
      href: '/my-dashboard/verification',
      label: 'Verification',
      icon: ShieldCheck,
    },
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
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
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
                    <AvatarImage src={buyer.avatarUrl} alt={buyer.fullName} />
                    <AvatarFallback>{buyerInitials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold">{buyer.fullName}</span>
                    <span className="text-xs text-muted-foreground">{buyer.email}</span>
                </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="w-full overflow-hidden">
            <header className="flex items-center justify-end p-4">
                <SidebarTrigger className="md:hidden" />
            </header>
            <main className="w-full max-w-none p-0 overflow-x-auto">
                <div className="min-w-max w-full">
                    {children}
                </div>
            </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
