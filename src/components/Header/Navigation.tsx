'use client';

import React from 'react';
import Link from 'next/link';

export const Navigation = React.memo(() => {
  return (
    <nav className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/buyers" className="hover:text-foreground/80 transition-colors">
          For Buyers
        </Link>
        <Link href="/sellers" className="hover:text-foreground/80 transition-colors">
          For Sellers
        </Link>
        <div className="relative group">
          <button className="text-foreground/70 hover:text-foreground transition-colors flex items-center gap-1 py-2 px-1">
            Pricing
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* Dropdown menu with padding to prevent hover gap */}
          <div className="absolute left-1/2 -translate-x-1/2 pt-2">
            <div className="bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link href="/buyers/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Buyer Pricing</Link>
              <Link href="/sellers/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">Seller Pricing</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';
