'use client';

import { CheckCircle2, BadgeCheck, Shield, Zap } from 'lucide-react';
import { Button } from './ui/button';

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

const PricingTier = ({ name, price, description, features, cta, popular = false }: PricingTier) => (
  <div className={`relative bg-white rounded-2xl shadow-sm border ${popular ? 'border-blue-500 ring-2 ring-blue-500' : 'border-gray-200'} p-8`}>
    {popular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-blue-600 text-white text-xs font-medium px-4 py-1 rounded-full">
          Most Popular
        </span>
      </div>
    )}
    
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{name}</h3>
    <div className="flex items-baseline mb-2">
      <span className="text-4xl font-bold text-gray-900">{price}</span>
      {!price.includes('$0') && <span className="text-gray-500 ml-1">+ 2.5% success fee</span>}
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
    
    <Button className={`w-full ${popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}>
      {cta}
    </Button>
  </div>
);

export function PricingSection() {
  const buyerTiers: PricingTier[] = [
    {
      name: 'Basic Access',
      price: '$0',
      description: 'Perfect for exploring the marketplace',
      features: [
        'Browse all listings',
        'Basic business information',
        'Contact sellers directly',
        'Save favorite listings'
      ],
      cta: 'Get Started for Free'
    },
    {
      name: 'Premium Buyer',
      price: '$99',
      description: 'For serious buyers ready to make offers',
      features: [
        'Everything in Basic',
        'Advanced business analytics',
        'Priority support',
        'Financial model templates',
        'Deal structuring assistance'
      ],
      cta: 'Upgrade to Premium',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For investors and acquisition companies',
      features: [
        'Dedicated account manager',
        'Off-market opportunities',
        'Portfolio analysis',
        'Custom deal flow',
        'M&A advisory services'
      ],
      cta: 'Contact Sales'
    }
  ];

  const sellerTiers: PricingTier[] = [
    {
      name: 'Standard Listing',
      price: '$0',
      description: 'List your business with essential details',
      features: [
        'Basic business profile',
        'Reach thousands of buyers',
        'Standard support',
        '2.5% success fee'
      ],
      cta: 'List Your Business'
    },
    {
      name: 'Premium Listing',
      price: '$299',
      description: 'Get more visibility and support',
      features: [
        'Everything in Standard',
        'Featured placement',
        'Enhanced business profile',
        'Priority support',
        '1.5% success fee',
        'Deal structuring assistance'
      ],
      cta: 'Upgrade to Premium',
      popular: true
    },
    {
      name: 'Managed Exit',
      price: '2-5% of sale',
      description: 'Full-service M&A support',
      features: [
        'Dedicated M&A advisor',
        'Business valuation',
        'Marketing materials',
        'Buyer vetting',
        'Deal negotiation',
        'Closing support'
      ],
      cta: 'Schedule Consultation'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your needs. No hidden fees, ever.
          </p>
        </div>

        {/* Buyer Pricing */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">For Buyers</h3>
            <p className="text-gray-600">Find and acquire your next business opportunity</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {buyerTiers.map((tier, index) => (
              <PricingTier key={`buyer-tier-${index}`} {...tier} />
            ))}
          </div>
        </div>

        {/* Seller Pricing */}
        <div>
          <div className="text-center mb-10">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">For Sellers</h3>
            <p className="text-gray-600">Sell your business with confidence</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sellerTiers.map((tier, index) => (
              <PricingTier key={`seller-tier-${index}`} {...tier} />
            ))}
          </div>
        </div>

        <div className="mt-16 bg-blue-50 rounded-2xl p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <BadgeCheck className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Need Help Deciding?</h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you choose the right plan and answer any questions you might have about buying or selling a business.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="outline" className="bg-white">
                Contact Sales
              </Button>
              <Button variant="secondary">
                Schedule a Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
