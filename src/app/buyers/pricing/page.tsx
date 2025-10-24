'use client';

import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import { Header } from '@/components/Header';
import { PricingSection } from '@/components/pricing-section';
import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, Star, Wallet } from 'lucide-react';

const heroHighlights = [
  {
    label: 'Average savings',
    value: '18%',
    helper: 'vs. hiring third-party advisors',
  },
  {
    label: 'Support response',
    value: '<2 hrs',
    helper: 'median during active deals',
  },
];

const membershipPerks = [
  'Cancel or pause anytime—no lock-ins',
  'Invite unlimited collaborators to your workspace',
  'Priority deal alerts matched to your mandate',
];

const planNames = ['Basic Access', 'Premium Buyer', 'Enterprise'] as const;
const planPrices = ['$0/mo', '$99/mo', 'Custom'];
const planDescriptions = [
  'Access listings and save searches',
  'Unlock analytics dashboards & deal desk hours',
  'Dedicated analyst team + off-market sourcing',
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BuyerPricingPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0">
              <div className="absolute -left-32 top-14 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
              <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_60%)]" />
            </div>

            <SiteContainer className="relative z-10 pb-24 pt-32">
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="grid items-center gap-12 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]"
              >
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 shadow-lg shadow-blue-900/30 backdrop-blur">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                      <Star className="h-4 w-4" />
                    </span>
                    Plans built for solo buyers, family offices, and acquisition teams
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                      Membership that scales with every deal you close.
                    </h1>
                    <p className="text-lg text-blue-100/90 md:text-xl">
                      Unlock deeper diligence, curated deal flow, and white-glove support when you need it—without getting locked into retainers you rarely use.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="group h-auto rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-sky-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition-all duration-300 hover:from-blue-400 hover:to-sky-200"
                      asChild
                    >
                      <Link href="/signup" className="flex items-center">
                        Start for free
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-auto rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
                      asChild
                    >
                      <Link href="/contact">Ask about enterprise plans</Link>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        No onboarding fees or contracts
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        Upgrade or downgrade instantly
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-left">
                      {heroHighlights.map((item) => (
                        <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                          <div className="text-xs uppercase tracking-[0.2em] text-blue-100/70">{item.label}</div>
                          <div className="mt-2 text-2xl font-semibold text-white">{item.value}</div>
                          <div className="text-xs text-blue-100/70">{item.helper}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  <div className="absolute -top-12 -left-8 hidden h-40 w-40 rounded-full bg-blue-500/10 blur-2xl lg:block" />
                  <div className="absolute -bottom-12 right-6 hidden h-32 w-32 rounded-full bg-sky-400/20 blur-2xl lg:block" />

                  <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-blue-100/70">
                      <span>Plan comparison</span>
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
                            <span className="text-xs text-blue-100/70">{planPrices[index]}</span>
                          </div>
                          <p className="mt-2 text-xs text-blue-100/70">
                            {planDescriptions[index]}
                          </p>
                        </m.div>
                      ))}
                      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-100">
                        <div className="rounded-xl bg-blue-500/20 p-3 text-blue-200">
                          <Wallet className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Billing note</p>
                          <p className="mt-1 text-sm">Pause membership anytime—pro-rated credit rolls to your next deal.</p>
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
              <div className="mb-12 grid gap-6 rounded-3xl border border-slate-200 bg-blue-50/40 p-10 shadow-sm lg:grid-cols-3">
                {membershipPerks.map((perk) => (
                  <div key={perk} className="flex items-start gap-3 text-sm text-slate-600">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-blue-500" />
                    <span>{perk}</span>
                  </div>
                ))}
              </div>

              <PricingSection userType="buyer" />
            </SiteContainer>
          </section>

          <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
            <div className="absolute inset-0">
              <div className="absolute -right-28 top-10 hidden h-72 w-72 rounded-full bg-sky-400/30 blur-3xl lg:block" />
              <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
            </div>
            <SiteContainer className="relative z-10">
              <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-xl backdrop-blur md:grid-cols-[1.2fr_auto] md:items-center">
                <div className="space-y-6">
                  <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-blue-100">
                    Next steps
                  </p>
                  <h2 className="text-3xl font-semibold md:text-4xl">Want a guided walkthrough of the platform?</h2>
                  <p className="text-base text-blue-100 md:text-lg">
                    Book twenty minutes with our buyer success team to see how advanced analytics, deal desk workflows, and post-close support unlock your next acquisition.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      size="lg"
                      className="h-auto rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition hover:from-blue-400 hover:to-emerald-200"
                      asChild
                    >
                      <Link href="/contact">Book a live demo</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-auto rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
                      asChild
                    >
                      <Link href="/buyers">Explore buyer playbooks</Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-blue-100">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">You’ll receive</p>
                  <ul className="space-y-3">
                    {["Plan comparison tailored to your mandate", "Sample diligence dashboards and reporting", "Top three listings that match your thesis"].map((item) => (
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
