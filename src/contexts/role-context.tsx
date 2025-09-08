'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type Role = 'buyer' | 'seller';

interface RoleContextType {
  role: Role;
  toggleRole: () => Promise<void>;
  isBuyer: boolean;
  isSeller: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('buyer');
  const router = useRouter();

  const toggleRole = useCallback(async () => {
    const newRole = role === 'buyer' ? 'seller' : 'buyer';
    setRole(newRole);
    
    // Always navigate to the dashboard - the content will update based on the role
    router.push('/my-dashboard');
  }, [role, router]);

  const value = {
    role,
    toggleRole,
    isBuyer: role === 'buyer',
    isSeller: role === 'seller',
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
