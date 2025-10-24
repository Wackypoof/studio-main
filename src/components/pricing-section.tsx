'use client';

import { CheckCircle2, BadgeCheck, Shield, Zap } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

type PricingTierData = {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
};

const PricingCard = ({ name, price, description, features, cta, popular = false }: PricingTierData) => (
  <article
    className={cn(
      'relative flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
      popular && 'border-transparent bg-gradient-to-br from-blue-500/10 via-sky-400/10 to-emerald-200/10 shadow-blue-200/40 backdrop-blur',
    )}
  >
    {popular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <span className="rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white">
          Recommended
        </span>
      </div>
    )}

    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-4xl font-bold text-slate-900">{price}</span>
        {!price.includes('$0') && <span className="text-sm text-slate-500">+ 2.5% success fee</span>}
      </div>
      <p className="text-base text-slate-600">{description}</p>
    </div>

    <ul className="mt-8 space-y-3 text-sm text-slate-600">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>

    <Button
      className={cn(
        'mt-10 w-full rounded-full border border-slate-200 bg-slate-900 py-3 text-base font-semibold text-white transition hover:bg-slate-800',
        popular && 'border-transparent bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-300 text-slate-950 hover:from-blue-400 hover:to-emerald-200',
      )}
    >
      {cta}
    </Button>
  </article>
);

type UserType = 'buyer' | 'seller';

interface PricingSectionProps {
  userType: UserType;
  className?: string;
}

export function PricingSection({ userType, className = '' }: PricingSectionProps) {
  const buyerTiers: PricingTierData[] = [
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

  const sellerTiers: PricingTierData[] = [
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

  const isBuyer = userType === 'buyer';
  const title = isBuyer ? 'For Buyers' : 'For Sellers';
  const subtitle = isBuyer 
    ? 'Find and acquire your next business opportunity' 
    : 'Sell your business with confidence';
  const tiers = isBuyer ? buyerTiers : sellerTiers;

  return (
    <div className={cn('space-y-20', className)}>
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-4 py-1 text-sm font-medium text-blue-700">
          <span className="flex h-2 w-2 rounded-full bg-blue-500" />
          Simple, transparent pricing
        </span>
        <h2 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">Pick the membership built for your next move.</h2>
        <p className="mt-4 text-lg text-slate-600">
          {isBuyer
            ? 'Whether you are testing the waters or closing your next roll-up, unlock the data, support, and deal access that matches your mandate.'
            : 'Choose the level of support you need—from self-serve listing tools to fully managed exits led by our M&A specialists.'}
        </p>
      </div>

      <div className="space-y-10">
        <div className="text-center">
          <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-slate-500">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <PricingCard key={`${userType}-${tier.name}`} {...tier} />
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-blue-100 bg-blue-50/60 p-10 text-center shadow-sm">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <BadgeCheck className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900">
            Need help {isBuyer ? 'choosing a plan?' : 'deciding your exit path?'}
          </h3>
          <p className="text-slate-600">
            {isBuyer
              ? 'Our buyer success team will evaluate your thesis, recommend the right tier, and surface off-market opportunities tailored to your goals.'
              : 'Chat with an exit strategist to understand which tier unlocks the right mix of valuation analysis, buyer outreach, and negotiation support.'}
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              variant="outline"
              className="rounded-full border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 hover:border-slate-400"
            >
              Contact {isBuyer ? 'buyer success' : 'our exit team'}
            </Button>
            <Button
              variant="secondary"
              className="rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white hover:bg-slate-800"
            >
              Schedule a strategy call
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-10 text-left shadow-sm md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Shield className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900">Security first</h4>
          <p className="text-sm text-slate-600">Enterprise-grade encryption, escrow partners, and KYC on every buyer ensure your data stays protected.</p>
        </div>
        <div className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Zap className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900">Switch tiers anytime</h4>
          <p className="text-sm text-slate-600">Upgrade, downgrade, or pause without penalties. Our team will transition your support level in under 24 hours.</p>
        </div>
        <div className="space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h4 className="text-lg font-semibold text-slate-900">No hidden fees</h4>
          <p className="text-sm text-slate-600">Transparent pricing with success-based incentives keeps us aligned on outcomes that matter.</p>
        </div>
      </div>
    </div>
  );
}
