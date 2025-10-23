'use client';

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
  const ROLE_STORAGE_KEY = 'sa_role';
  const [role, setRole] = useState<Role>(() => {
    if (typeof window === 'undefined') return 'buyer';
    const stored = window.localStorage.getItem(ROLE_STORAGE_KEY);
    return stored === 'buyer' || stored === 'seller' ? stored : 'buyer';
  });

  const toggleRole = useCallback(async () => {
    const newRole = role === 'buyer' ? 'seller' : 'buyer';
    setRole(newRole);
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(ROLE_STORAGE_KEY, newRole);
      }
    } catch {
      // ignore storage errors
    }
  }, [role]);

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
