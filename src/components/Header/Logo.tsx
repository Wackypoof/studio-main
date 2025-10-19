'use client';

import React from 'react';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export const Logo = React.memo<LogoProps>(({ className = "" }) => {
  return (
    <Link href="/" className={`flex items-center gap-2 h-10 leading-none ${className}`}>
      <Briefcase className="h-6 w-6 text-primary" aria-hidden />
      <span className="font-semibold tracking-tight">SuccessionAsia</span>
    </Link>
  );
});

Logo.displayName = 'Logo';
