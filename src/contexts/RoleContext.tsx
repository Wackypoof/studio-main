'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Role = 'buyer' | 'seller';

interface RoleContextType {
  role: Role;
  toggleRole: () => void;
  isBuyer: boolean;
  isSeller: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('buyer');

  const toggleRole = () => {
    setRole(prevRole => (prevRole === 'buyer' ? 'seller' : 'buyer'));
  };

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
