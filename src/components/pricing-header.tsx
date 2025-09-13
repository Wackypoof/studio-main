'use client';

import { Briefcase, User } from 'lucide-react';
import { motion } from 'framer-motion';

type PricingHeaderProps = {
  title: string;
  description: string;
  type: 'buyer' | 'seller';
};

export function PricingHeader({ title, description, type }: PricingHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-white text-blue-700 text-sm font-medium shadow-sm mb-6"
          >
            {type === 'buyer' ? (
              <>
                <Briefcase className="h-4 w-4 mr-2" />
                For Buyers
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                For Sellers
              </>
            )}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            {description}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
