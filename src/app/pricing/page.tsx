import { Button } from '@/components/ui/button';
import { CheckCircle2, BadgeCheck, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { SiteContainer } from '@/components/site-container';

type PricingTier = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <SiteContainer>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Choose the plan that works best for you. No hidden fees, ever.
            </p>
            <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
              <button className="px-6 py-2 rounded-full font-medium text-sm bg-blue-600 text-white">
                For Buyers
              </button>
              <button className="px-6 py-2 rounded-full font-medium text-sm text-gray-700 hover:bg-gray-50">
                For Sellers
              </button>
            </div>
          </div>
        </SiteContainer>
      </section>

      {/* Buyer Pricing */}
      <section className="py-20 bg-white">
        <SiteContainer>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Buyer Pricing</h2>
            <p className="text-xl text-gray-600">Find and acquire the perfect business opportunity</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {buyerTiers.map((tier, index) => (
              <PricingTierCard key={`buyer-tier-${index}`} {...tier} />
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* Seller Pricing */}
      <section className="py-20 bg-gray-50">
        <SiteContainer>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Seller Pricing</h2>
            <p className="text-xl text-gray-600">Sell your business with confidence</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sellerTiers.map((tier, index) => (
              <PricingTierCard key={`seller-tier-${index}`} {...tier} />
            ))}
          </div>
        </SiteContainer>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <SiteContainer>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {[
                {
                  question: "How are success fees calculated?",
                  answer: "Success fees are calculated as a percentage of the final sale price and are only due upon successful completion of a sale. The exact percentage depends on the plan you choose."
                },
                {
                  question: "Is there a long-term contract?",
                  answer: "No, there are no long-term contracts. You can cancel your subscription at any time."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards, bank transfers, and escrow services for secure transactions."
                },
                {
                  question: "Can I upgrade or downgrade my plan?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time from your account settings."
                }
              ].map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </SiteContainer>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <SiteContainer>
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6">Still have questions?</h2>
              <p className="text-xl mb-8 text-blue-100">
                Our team is here to help you choose the right plan and answer any questions you might have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white/20">
                  Contact Support
                </Button>
                <Button size="lg" variant="secondary" className="text-blue-700">
                  Schedule a Call
                </Button>
              </div>
            </div>
          </div>
        </SiteContainer>
      </section>
    </div>
  );
}
