'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function SellerHeader() {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              YourBrand
            </Link>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/buyers" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                For Buyers
              </Link>
              <Link href="/sellers" className="text-blue-600 border-b-2 border-blue-600 px-3 py-2 text-sm font-medium">
                For Sellers
              </Link>
              <Link href="/pricing" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Pricing
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-gray-500 hover:text-gray-900 text-sm font-medium">
              Log in
            </Link>
            <Button asChild>
              <Link href="/sellers/get-started">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div className="h-full bg-blue-600 w-1/3"></div>
      </div>
    </header>
  );
}
