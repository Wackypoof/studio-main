'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle2, Briefcase, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SiteContainer } from '@/components/site-container';
import { Header } from '@/components/Header';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  icon?: React.ReactNode;
};

const PricingTierCard = ({ name, price, description, features, cta, popular = false }: PricingTier) => (
  <div className={`relative bg-white rounded-2xl shadow-sm border ${
    popular ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'
  } p-8 h-full flex flex-col`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-blue-600 text-white text-xs font-medium px-4 py-1 rounded-full">
          Most Popular
        </span>
      </div>
    )}
    
    <div>
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{name}</h3>
      <div className="flex items-baseline mb-2">
        <span className="text-4xl font-bold text-gray-900">{price}</span>
        {!price.includes('$0') && <span className="text-gray-500 ml-1 text-sm">+ 2.5% success fee</span>}
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    
    <div className="mt-auto">
      <Button className={`w-full ${popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`} asChild>
        <Link href="/sign-up">{cta}</Link>
      </Button>
    </div>
  </div>
);

export default function PricingPage() {
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  
  const buyerPricing: PricingTier[] = [
    {
      name: 'Free',
      price: '$0',
      description: 'Perfect for exploring the marketplace',
      features: [
        'Browse all listings',
        'Save favorite businesses',
        'Basic search filters',
        'Email notifications',
        'Access to business summaries'
      ],
      cta: 'Get Started',
      popular: true,
      icon: <Briefcase className="h-6 w-6 text-blue-500" />
    },
    {
      name: 'Pro Buyer',
      price: '$99',
      description: 'For serious buyers ready to acquire',
      features: [
        'Everything in Free',
        'Advanced search filters',
        'Priority listing access',
        'Financial analysis tools',
        'Dedicated account manager',
        'Exclusive off-market deals'
      ],
      cta: 'Start Free Trial',
      popular: false,
      icon: <Briefcase className="h-6 w-6 text-blue-500" />
    }
  ];

  const sellerPricing: PricingTier[] = [
    {
      name: 'Standard',
      price: '2.5%',
      description: 'Ideal for businesses under $1M',
      features: [
        'Listing creation',
        'Basic marketing',
        'Buyer verification',
        'Standard support',
        'Secure messaging'
      ],
      cta: 'List Your Business',
      popular: true,
      icon: <User className="h-6 w-6 text-green-500" />
    },
    {
      name: 'Premium',
      price: '5%',
      description: 'For businesses over $1M',
      features: [
        'Everything in Standard',
        'Premium placement',
        'Dedicated broker',
        'Marketing campaign',
        'Priority support',
        'Legal assistance'
      ],
      cta: 'Get Started',
      popular: false,
      icon: <User className="h-6 w-6 text-green-500" />
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For high-value transactions',
      features: [
        'Everything in Premium',
        'Custom marketing',
        'Dedicated team',
        '24/7 support',
        'Custom deal structure',
        'Confidentiality guarantee'
      ],
      cta: 'Contact Sales',
      popular: false,
      icon: <User className="h-6 w-6 text-green-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
        <SiteContainer>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Choose the plan that works best for your needs. No hidden fees, ever.
            </p>
            
            <div className="inline-flex p-1 bg-gray-100 rounded-lg mb-8">
              <button
                onClick={() => setActiveTab('buyer')}
                className={`px-6 py-3 rounded-md font-medium text-sm transition-colors ${
                  activeTab === 'buyer' 
                    ? 'bg-white shadow-sm text-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  For Buyers
                </div>
              </button>
              <button
                onClick={() => setActiveTab('seller')}
                className={`px-6 py-3 rounded-md font-medium text-sm transition-colors ${
                  activeTab === 'seller' 
                    ? 'bg-white shadow-sm text-green-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  For Sellers
                </div>
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
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {(activeTab === 'buyer' ? buyerPricing : sellerPricing).map((tier, index) => (
                <PricingTierCard key={`${activeTab}-${index}`} {...tier} />
              ))}
            </motion.div>
          </AnimatePresence>
        </SiteContainer>
      </section>

      {/* Navigation Section */}
      <section className="py-16 bg-white">
        <SiteContainer>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the pricing plan that matches your needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Briefcase className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">For Buyers</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Find and acquire the perfect business with our transparent pricing options.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Free plan available</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Pro plan with advanced features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>No hidden fees</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button className="w-full" asChild>
                    <Link href="/buyers/pricing">View Buyer Pricing</Link>
                  </Button>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">For Sellers</h2>
                </div>
                <p className="text-gray-600 mb-6">
                  Sell your business with our success-based pricing model.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Pay only when you sell</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Competitive commission rates</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Dedicated support</span>
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button className="w-full" asChild>
                    <Link href="/sellers/pricing">View Seller Pricing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SiteContainer>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <SiteContainer>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6 text-left">
              {[
                {
                  question: 'How are success fees calculated?',
                  answer: 'Success fees are calculated as a percentage of the final sale price and are only due upon successful completion of a sale.'
                },
                {
                  question: 'Is there a long-term contract?',
                  answer: 'No, there are no long-term contracts. You can cancel or change your plan at any time.'
                },
                {
                  question: 'What payment methods do you accept?',
                  answer: 'We accept all major credit cards, bank transfers, and other secure payment methods.'
                },
                {
                  question: 'Do you offer discounts for annual billing?',
                  answer: 'Yes, we offer a 10% discount for annual billing on all paid plans.'
                }
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-100 pb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-blue-50 p-8 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Still have questions?</h3>
              <p className="text-gray-600 mb-6">Our team is here to help you find the right solution.</p>
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Contact Support <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </SiteContainer>
      </section>
    </div>
  );
}
