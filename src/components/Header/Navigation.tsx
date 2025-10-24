'use client';

import React from 'react';
import Link from 'next/link';

export const Navigation = React.memo(() => {
  return (
    <nav className="hidden md:flex items-center justify-center absolute left-1/2 h-full -translate-x-1/2 transform">
      <div className="flex items-center gap-6 text-sm font-semibold text-slate-200">
        <Link href="/buyers" className="text-slate-200/80 transition-colors hover:text-white">
          For Buyers
        </Link>
        <Link href="/sellers" className="text-slate-200/80 transition-colors hover:text-white">
          For Sellers
        </Link>
        <div className="relative group">
          <button className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-slate-200/80 transition hover:border-white/40 hover:text-white">
            Pricing
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* Dropdown menu with padding to prevent hover gap */}
          <div className="absolute left-1/2 -translate-x-1/2 pt-3">
            <div className="w-48 rounded-xl border border-white/10 bg-slate-900/90 p-2 opacity-0 shadow-xl shadow-slate-900/40 backdrop-blur group-hover:visible group-hover:opacity-100 transition-all duration-200">
              <Link href="/buyers/pricing" className="block rounded-lg px-4 py-2 text-sm text-slate-200/80 transition hover:bg-white/10 hover:text-white">
                Buyer Pricing
              </Link>
              <Link href="/sellers/pricing" className="mt-1 block rounded-lg px-4 py-2 text-sm text-slate-200/80 transition hover:bg-white/10 hover:text-white">
                Seller Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';
