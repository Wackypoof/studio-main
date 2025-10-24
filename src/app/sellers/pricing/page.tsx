'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import { Header } from '@/components/Header';
import { PricingSection } from '@/components/pricing-section';
import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, DollarSign, Sparkle } from 'lucide-react';

const heroHighlights = [
  {
    label: 'Average deal size',
    value: '$2.4M',
    helper: 'across managed exits',
  },
  {
    label: 'Time to LOI',
    value: '19 days',
    helper: 'median from listing go-live',
  },
];

const membershipPerks = [
  'Dedicated exit producer assigned at Premium tier and above',
  'Managed buyer outreach with weekly reporting',
  'Legal & escrow partners ready to activate at close',
];

const planNames = ['Standard Listing', 'Premium Listing', 'Managed Exit'] as const;
const planAddOns = ['Self-serve tools', 'Amplified reach + analytics', 'Full-service M&A support'];
const planFees = ['$0 + success fee', '$299 + reduced success fee', '2–5% of sale'];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function SellerPricingPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0">
              <div className="absolute -left-32 top-14 h-72 w-72 rounded-full bg-amber-500/30 blur-3xl" />
              <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_60%)]" />
            </div>

            <SiteContainer className="relative z-10 pb-24 pt-32">
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="grid items-center gap-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]"
              >
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-amber-100 shadow-lg shadow-amber-900/40 backdrop-blur">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-200">
                      <Sparkle className="h-4 w-4" />
                    </span>
                    Pricing designed around outcomes—not retainers
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                      Choose the exit support that matches your ambition.
                    </h1>
                    <p className="text-lg text-amber-100/90 md:text-xl">
                      Whether you want to self-serve or hand the reins to our M&A team, each tier aligns incentives around getting you the cleanest exit at the best valuation.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="group h-auto rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:from-amber-300 hover:to-rose-200"
                      asChild
                    >
                      <Link href="/sell" className="flex items-center">
                        Start listing for free
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-auto rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
                      asChild
                    >
                      <Link href="/contact">Talk to an exit strategist</Link>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-4 text-sm text-amber-100">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        Success fees due only at close
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        Switch tiers as your deal evolves
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-left">
                      {heroHighlights.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-amber-100/70">{item.label}</div>
                          <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
                          <div className="text-xs text-amber-100/70">{item.helper}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  <div className="absolute -top-12 -left-8 hidden h-40 w-40 rounded-full bg-amber-500/10 blur-2xl lg:block" />
                  <div className="absolute -bottom-12 right-6 hidden h-32 w-32 rounded-full bg-orange-400/20 blur-2xl lg:block" />

                  <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-amber-100/70">
                      <span>Tier snapshot</span>
                      <span>Live</span>
                    </div>
                    <div className="mt-6 space-y-5">
                      {planNames.map((plan, index) => (
                        <m.div
                          key={plan}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: '-100px' }}
                          variants={fadeInUp}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="rounded-2xl border border-white/15 bg-white/10 p-4"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-white">{plan}</span>
                            <span className="text-xs text-amber-100/70">{planFees[index]}</span>
                          </div>
                          <p className="mt-2 text-xs text-amber-100/70">{planAddOns[index]}</p>
                        </m.div>
                      ))}
                      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-amber-100">
                        <div className="rounded-xl bg-amber-500/20 p-3 text-amber-200">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">Fee insight</p>
                          <p className="mt-1 text-sm">Managed exits include valuation, marketing, legal, and diligence support in a single performance fee.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            </SiteContainer>
          </section>

          <section className="bg-white py-20">
            <SiteContainer>
              <div className="mb-12 grid gap-6 rounded-3xl border border-slate-200 bg-amber-50/40 p-10 shadow-sm lg:grid-cols-3">
                {membershipPerks.map((perk) => (
                  <div key={perk} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-amber-500" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <PricingSection userType="seller" />
            </SiteContainer>
          </section>

          <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
            <div className="absolute inset-0">
              <div className="absolute -right-28 top-10 hidden h-72 w-72 rounded-full bg-orange-400/30 blur-3xl lg:block" />
              <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-amber-500/20 blur-3xl" />
            </div>
            <SiteContainer className="relative z-10">
              <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-xl backdrop-blur md:grid-cols-[1.2fr_auto] md:items-center">
                <div className="space-y-6">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-amber-100">
                    Next steps
                  </p>
                  <h2 className="text-3xl font-semibold md:text-4xl">Need help picking the right support level?</h2>
                  <p className="text-base text-amber-100 md:text-lg">
                    We’ll review your metrics, timeline, and preferred buyer profile to recommend the right tier and outline a custom go-to-market plan.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      size="lg"
                      className="h-auto rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-300 hover:to-rose-200"
                      asChild
                    >
                      <Link href="/contact">Book a pricing consult</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-auto rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
                      asChild
                    >
                      <Link href="/sellers">See seller resources</Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-amber-100">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">You’ll receive</p>
                  <ul className="space-y-3">
                    {["Tier recommendation within 24 hours", "Valuation memo with fee breakdown", "Intro to buyers already active in your category"].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SiteContainer>
          </section>
        </main>
      </div>
    </LazyMotion>
  );
}
