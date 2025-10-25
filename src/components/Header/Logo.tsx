'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  clickable?: boolean;
}

export const Logo = React.memo<LogoProps>(({ className = "", clickable = true }) => {
  const content = (
    <>
      <Image
        src="/icons/succession.png"
        alt="SuccessionAsia Logo"
        width={32}
        height={32}
        className="h-8 w-auto"
        priority
      />
      <span className="font-semibold tracking-tight">SuccessionAsia</span>
    </>
  );

  if (clickable) {
    return (
      <Link href="/" className={`flex items-center gap-2 h-10 leading-none ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <div className={`flex items-center gap-2 h-10 leading-none select-none ${className}`}>
      {content}
    </div>
  );
});

Logo.displayName = 'Logo';
