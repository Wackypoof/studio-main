'use client';

import { CheckCircle2, Search, FileText, Handshake, Zap, Users, BarChart2, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const ProcessStep = ({ number, title, description, icon, delay }: ProcessStepProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="relative pl-8 md:pl-0"
  >
    <div className="hidden md:flex absolute left-0 -ml-4 w-8 h-8 rounded-full bg-blue-600 text-white items-center justify-center font-bold">
      {number}
    </div>
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full">
      <div className="flex items-center mb-4">
        <div className="md:hidden mr-3 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
          {number}
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mr-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 pl-14 md:pl-0">{description}</p>
    </div>
  </motion.div>
);

type TabType = 'buyer' | 'seller';

export function ProcessFlow() {
  const [activeTab, setActiveTab] = useState<TabType>('buyer');
  
  const buyerSteps = [
    {
      title: "Find Your Perfect Business",
      description: "Browse our curated selection of vetted businesses and use our advanced filters to find the perfect match for your goals.",
      icon: <Search className="h-5 w-5" />
    },
    {
      title: "Connect with Sellers",
      description: "Reach out to sellers directly through our secure messaging system. Ask questions and request more information.",
      icon: <Users className="h-5 w-5" />
    },
    {
      title: "Make an Offer",
      description: "Use our built-in tools to create and send professional offers. Negotiate terms directly with the seller.",
      icon: <Handshake className="h-5 w-5" />
    },
    {
      title: "Close with Confidence",
      description: "Complete your purchase securely with our integrated escrow service and legal documentation.",
      icon: <CheckCircle2 className="h-5 w-5" />
    }
  ];

  const sellerSteps = [
    {
      title: "List Your Business",
      description: "Create a detailed listing with financials, metrics, and growth potential. Our team will help optimize it.",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Get Matched with Buyers",
      description: "We'll promote your listing to our network of 500k+ qualified buyers and handle initial inquiries.",
      icon: <BarChart2 className="h-5 w-5" />
    },
    {
      title: "Review Offers",
      description: "Evaluate offers from qualified buyers with our deal comparison tools and expert guidance.",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      title: "Close the Deal",
      description: "Complete the sale with our streamlined closing process and secure payment handling.",
      icon: <Zap className="h-5 w-5" />
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes buying or selling a business simple and secure
          </p>
        </div>

        <div className="mb-20">
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button 
                onClick={() => setActiveTab('buyer')}
                className={`px-6 py-3 text-sm font-medium rounded-l-lg transition-colors ${
                  activeTab === 'buyer' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                For Buyers
              </button>
              <button 
                onClick={() => setActiveTab('seller')}
                className={`px-6 py-3 text-sm font-medium rounded-r-lg transition-colors ${
                  activeTab === 'seller' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                For Sellers
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {(activeTab === 'buyer' ? buyerSteps : sellerSteps).map((step, index) => (
                <ProcessStep
                  key={`${activeTab}-${index}`}
                  number={index + 1}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  delay={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
