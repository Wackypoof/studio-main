'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import { Header } from '@/components/Header';
import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, CheckCircle2, Clock, PlayCircle, Search, ShieldCheck, Star, Users } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const featureCards: FeatureCardProps[] = [
  {
    icon: <Search className="h-6 w-6" />,
    title: 'Curated marketplace',
    description: 'Every listing is underwritten by our deal desk and mapped against 40+ data points, so you only evaluate acquisition-ready businesses.',
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Diligence on autopilot',
    description: 'Automated financial, traffic, and tech-stack reports plug straight into your investment committee template.',
  },
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: 'Escrow + legal stack',
    description: 'Close with confidence through integrated escrow, templated SPAs, and vetted legal partners across APAC.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Operator matching',
    description: 'Tap our operator network to parachute in growth leaders post-acquisition or partner on co-buy opportunities.',
  },
];

const acquisitionSteps = [
  {
    title: 'Define your mandate',
    description: 'Outline sector focus, revenue range, and preferred monetisation models. We respond with a ready-to-review longlist within 48 hours.',
  },
  {
    title: 'Evaluate with our deal desk',
    description: 'Access structured data rooms, diligence scorecards, and valuation benchmarks tailored to your investment thesis.',
  },
  {
    title: 'Negotiate & close',
    description: 'We coordinate intros, manage escrow, and keep both parties on track through close and handover.',
  },
];

const trustBadges = ['Sequoia Scouts', 'AWS Startups', 'Operator Guild', 'G2 Crowd', 'Asia PE Alliance'];

const heroHighlights = [
  {
    label: 'Median diligence',
    value: '11 days',
    helper: 'from intro to signed LOI',
  },
  {
    label: 'Buyer satisfaction',
    value: '96%',
    helper: 'post-close survey score',
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
  <m.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
    variants={fadeInUp}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">{icon}</div>
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    <p className="mt-3 text-base text-slate-600">{description}</p>
  </m.div>
);

export default function BuyersPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0">
              <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
              <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.18),transparent_62%)]" />
            </div>

            <SiteContainer className="relative z-10 pb-28 pt-32">
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="grid items-center gap-14 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]"
              >
                <div className="space-y-10">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 shadow-lg shadow-blue-900/30 backdrop-blur">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                      <Star className="h-4 w-4" />
                    </span>
                    Rated 4.8/5 by professional acquisition teams
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                      Discover acquisition-ready businesses before they hit the open market.
                    </h1>
                    <p className="text-lg text-blue-100/90 md:text-xl">
                      Succession Asia pairs you with curated deal flow, diligence experts, and post-close operator talent so each buy-side mandate lands on time and on thesis.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="group h-auto rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-sky-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition-all duration-300 hover:from-blue-400 hover:to-sky-200"
                      asChild
                    >
                      <Link href="/dashboard/browse-listings" className="flex items-center">
                        Browse live listings
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-auto rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
                      asChild
                    >
                      <Link href="/contact" className="flex items-center">
                        Talk to a buyer advisor
                        <PlayCircle className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Link href="/buyers/pricing" className="text-sm font-medium text-blue-100 underline-offset-4 transition hover:text-white hover:underline">
                      See membership options
                    </Link>
                  </div>

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        Vetted deal flow across 18 sectors
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        Dedicated deal desk partnership
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

                  <div className="pt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.5em] text-blue-100/60">Trusted by deal teams from</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 opacity-80">
                      {trustBadges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-blue-100"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  <div className="absolute -top-10 -left-8 hidden h-40 w-40 rounded-full bg-blue-500/10 blur-2xl lg:block" />
                  <div className="absolute -bottom-12 right-6 hidden h-32 w-32 rounded-full bg-sky-400/20 blur-2xl lg:block" />

                  <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-blue-100/70">
                      <span>Deal pipeline</span>
                      <span>Live feed</span>
                    </div>
                    <div className="mt-6 space-y-5">
                      <div className="rounded-2xl bg-white/90 p-5 text-slate-900 shadow-lg">
                        <p className="text-xs font-semibold text-blue-500">SaaS · Singapore</p>
                        <p className="mt-2 text-lg font-semibold">Usage analytics platform</p>
                        <p className="mt-3 text-sm text-slate-500">MRR $58k · Net revenue retention 132%</p>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-xs text-slate-400">Asking</span>
                            <p className="font-semibold text-slate-900">$1.6M</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Multiple</span>
                            <p className="font-semibold text-slate-900">3.4×</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Status</span>
                            <p className="font-semibold text-emerald-500">Open</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-100">
                        <div className="rounded-xl bg-blue-500/20 p-3 text-blue-200">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Upcoming</p>
                          <p className="mt-1 text-sm">Buyer diligence call with founder scheduled for 14:00 SGT</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-100">
                        <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Recent win</p>
                        <p className="mt-2 text-sm">PE consortium closed a $2.1M acquisition with a 9-day diligence sprint.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            </SiteContainer>
          </section>

          <section className="bg-white py-20">
            <SiteContainer>
              <m.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
                className="mb-16 flex flex-col gap-10 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left"
              >
                <div className="space-y-4">
                  <m.p variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-4 py-1 text-sm font-medium text-blue-700">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                    Why buy with us
                  </m.p>
                  <m.h2 variants={fadeInUp} className="text-3xl font-bold text-slate-900 md:text-4xl">
                    Close smarter, not slower.
                  </m.h2>
                  <m.p variants={fadeInUp} className="text-lg text-slate-600 md:max-w-2xl">
                    From mandate scoping to signed SPAs, we bring the tooling, talent, and transparency that modern acquisition teams expect.
                  </m.p>
                </div>
                <m.div variants={fadeInUp} className="flex justify-center gap-6 text-sm text-slate-500">
                  <div>
                    <span className="text-slate-900">4.5×</span>
                    <span className="block text-xs uppercase tracking-[0.3em]">faster close</span>
                  </div>
                  <div className="hidden h-10 w-px bg-slate-200 lg:block" />
                  <div>
                    <span className="text-slate-900">32%</span>
                    <span className="block text-xs uppercase tracking-[0.3em]">avg ROI</span>
                  </div>
                </m.div>
              </m.div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {featureCards.map((feature, index) => (
                  <FeatureCard key={feature.title} {...feature} delay={index} />
                ))}
              </div>
            </SiteContainer>
          </section>

          <section className="bg-slate-50 py-20">
            <SiteContainer>
              <div className="mb-14 text-center">
                <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Your buying journey, orchestrated.</h2>
                <p className="mt-4 text-lg text-slate-600 md:max-w-2xl md:mx-auto">
                  Lean on our acquisition specialists at each milestone—no more spreadsheets stitched together across email threads.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {acquisitionSteps.map((step, index) => (
                  <m.div
                    key={step.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">{index + 1}</span>
                    <h3 className="mt-6 text-xl font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-4 text-base text-slate-600">{step.description}</p>
                  </m.div>
                ))}
              </div>
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
                  <h2 className="text-3xl font-semibold md:text-4xl">Ready to draft your next LOI?</h2>
                  <p className="text-base text-blue-100 md:text-lg">
                    Share your buy-side thesis and we will deliver a curated shortlist, diligence checklist, and timeline to close—usually within one business day.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      size="lg"
                      className="h-auto rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition hover:from-blue-400 hover:to-emerald-200"
                      asChild
                    >
                      <Link href="/signup" className="flex items-center">
                        Launch my brief
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-auto rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
                      asChild
                    >
                      <Link href="/buyers/pricing">Compare buyer tiers</Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-blue-100">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">What happens next</p>
                  <ul className="space-y-3">
                    {["20-minute mandate scoping with our deal desk", "Tailored diligence checklist and valuation comps", "Introductions to operators or co-investors aligned to your thesis"].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-xs text-blue-200/70">
                    <CheckCircle2 className="h-4 w-4" />
                    No retainer fees—success-based pricing only.
                  </div>
                </div>
              </div>
            </SiteContainer>
          </section>
        </main>
      </div>
    </LazyMotion>
  );
}
