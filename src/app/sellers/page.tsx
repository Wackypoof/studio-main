'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { LazyMotion, domAnimation, m } from 'framer-motion';

import { Header } from '@/components/Header';
import { SiteContainer } from '@/components/site-container';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, DollarSign, FileText, Handshake, Sparkle, TrendingUp, Users } from 'lucide-react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const featureCards: FeatureCardProps[] = [
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Maximise valuation',
    description: 'Structured valuation models and live comps ensure your asking price is positioned to attract premium buyers.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Qualified buyers only',
    description: 'We pre-screen capital, operator experience, and strategic fit so you meet decision-makers ready to transact.',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Deal desk support',
    description: 'From data room prep to SPA negotiations, our M&A specialists guide every stage of the exit.',
  },
  {
    icon: <Handshake className="h-6 w-6" />,
    title: 'Aligned incentives',
    description: 'No retainers or surprise fees—pay only when the deal closes through Succession Asia.',
  },
];

const exitMilestones = [
  {
    label: 'Prepare to list',
    description: 'Audit your financials, narrative, and growth plan with our exit readiness squad.',
  },
  {
    label: 'Engage buyers',
    description: 'We launch targeted outreach campaigns and orchestrate high-signal buyer conversations.',
  },
  {
    label: 'Negotiate & close',
    description: 'Let our legal and escrow partners keep diligence moving and protect your upside through close.',
  },
];

const trustBadges = ['Y Combinator Alumni', 'Tiger Global Scouts', 'Stripe Atlas', 'Sequoia Arc', 'Asia Operator Network'];

const heroHighlights = [
  {
    label: 'Average uplift',
    value: '23%',
    helper: 'vs. initial valuation range',
  },
  {
    label: 'Deals closed',
    value: '540+',
    helper: 'completed exits since 2020',
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
    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">{icon}</div>
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    <p className="mt-3 text-base text-slate-600">{description}</p>
  </m.div>
);

export default function SellersPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <section className="relative overflow-hidden bg-slate-950 text-white">
            <div className="absolute inset-0">
              <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-amber-500/30 blur-3xl" />
              <div className="absolute -bottom-24 right-0 h-96 w-96 rounded-full bg-orange-400/20 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.16),transparent_65%)]" />
            </div>

            <SiteContainer className="relative z-10 pb-28 pt-32">
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="grid items-center gap-14 lg:grid-cols-[1.1fr_minmax(0,0.9fr)]"
              >
                <div className="space-y-10">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-amber-100 shadow-lg shadow-amber-900/40 backdrop-blur">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-200">
                      <Sparkle className="h-4 w-4" />
                    </span>
                    Exit-ready support for founders and operators across APAC
                  </div>

                  <div className="space-y-6">
                    <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                      Launch your exit with a deal desk that works as hard as you do.
                    </h1>
                    <p className="text-lg text-amber-100/90 md:text-xl">
                      We combine global buyer demand, meticulous diligence, and hands-on transaction guidance so you can focus on the next chapter—not the paperwork.
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                    <Button
                      size="lg"
                      className="group h-auto rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-amber-900/30 transition-all duration-300 hover:from-amber-300 hover:to-rose-200"
                      asChild
                    >
                      <Link href="/sell" className="flex items-center">
                        Start my listing
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
                        Talk to an exit strategist
                      </Link>
                    </Button>
                    <Link href="/sellers/pricing" className="text-sm font-medium text-amber-100 underline-offset-4 transition hover:text-white hover:underline">
                      Explore seller fees
                    </Link>
                  </div>

                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-4 text-sm text-amber-100">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        Dedicated exit producer & analyst team
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-200">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        Global strategic + financial buyer reach
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

                  <div className="pt-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.5em] text-amber-100/60">Trusted by founders from</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 opacity-80">
                      {trustBadges.map((badge) => (
                        <span
                          key={badge}
                          className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wider text-amber-100"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative flex justify-center lg:justify-end">
                  <div className="absolute -top-10 -left-8 hidden h-40 w-40 rounded-full bg-amber-500/10 blur-2xl lg:block" />
                  <div className="absolute -bottom-12 right-6 hidden h-32 w-32 rounded-full bg-orange-400/20 blur-2xl lg:block" />

                  <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-amber-100/70">
                      <span>Exit dashboard</span>
                      <span>Live</span>
                    </div>
                    <div className="mt-6 space-y-5">
                      <div className="rounded-2xl bg-white/90 p-5 text-slate-900 shadow-lg">
                        <p className="text-xs font-semibold text-amber-500">E-commerce · Malaysia</p>
                        <p className="mt-2 text-lg font-semibold">Luxury skincare subscription</p>
                        <p className="mt-3 text-sm text-slate-500">ARR $4.2M · YoY growth 86%</p>
                        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-xs text-slate-400">Offers</span>
                            <p className="font-semibold text-slate-900">3 active</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Target</span>
                            <p className="font-semibold text-slate-900">$12.5M</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Stage</span>
                            <p className="font-semibold text-emerald-500">Contracting</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-amber-100">
                        <div className="rounded-xl bg-amber-500/20 p-3 text-amber-200">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">Valuation insight</p>
                          <p className="mt-1 text-sm">Buyer raised offer by 12% after growth forecast deep dive.</p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-amber-100">
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">Founder spotlight</p>
                        <p className="mt-2 text-sm">Lina (Jakarta) just signed an LOI within 19 days of listing.</p>
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
                  <m.p variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-amber-50/60 px-4 py-1 text-sm font-medium text-amber-600">
                    <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                    Why sell with us
                  </m.p>
                  <m.h2 variants={fadeInUp} className="text-3xl font-bold text-slate-900 md:text-4xl">
                    Your exit deserves a world-class go-to-market.
                  </m.h2>
                  <m.p variants={fadeInUp} className="text-lg text-slate-600 md:max-w-2xl">
                    Position your story, surface your metrics, and let our buyer network compete for the deal—while you stay focused on running the business.
                  </m.p>
                </div>
                <m.div variants={fadeInUp} className="flex justify-center gap-6 text-sm text-slate-500">
                  <div>
                    <span className="text-slate-900">$10.2B</span>
                    <span className="block text-xs uppercase tracking-[0.3em]">value transacted</span>
                  </div>
                  <div className="hidden h-10 w-px bg-slate-200 lg:block" />
                  <div>
                    <span className="text-slate-900">78%</span>
                    <span className="block text-xs uppercase tracking-[0.3em]">close rate</span>
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
                <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">A proven path to closing.</h2>
                <p className="mt-4 text-lg text-slate-600 md:mx-auto md:max-w-2xl">
                  Our exit producers run a structured playbook designed to preserve deal momentum and protect your leverage.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                {exitMilestones.map((milestone, index) => (
                  <m.div
                    key={milestone.label}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    variants={fadeInUp}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="h-full rounded-2xl border border-slate-200 bg-white p-8 text-left shadow-sm"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-600">{index + 1}</span>
                    <h3 className="mt-6 text-xl font-semibold text-slate-900">{milestone.label}</h3>
                    <p className="mt-4 text-base text-slate-600">{milestone.description}</p>
                  </m.div>
                ))}
              </div>
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
                  <h2 className="text-3xl font-semibold md:text-4xl">Ready to map out your exit?</h2>
                  <p className="text-base text-amber-100 md:text-lg">
                    Tell us about your business and goals. We’ll respond with a valuation range, go-live timeline, and curated buyer short list.
                  </p>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      size="lg"
                      className="h-auto rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-amber-900/30 transition hover:from-amber-300 hover:to-rose-200"
                      asChild
                    >
                      <Link href="/sell" className="flex items-center">
                        Start my exit plan
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="h-auto rounded-full border border-white/20 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:border-white/40 hover:bg-white/20"
                      asChild
                    >
                      <Link href="/sellers/pricing">Review pricing tiers</Link>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-amber-100">
                  <p className="text-xs uppercase tracking-[0.3em] text-amber-200/70">What happens next</p>
                  <ul className="space-y-3">
                    {["Exit readiness assessment within 48 hours", "Valuation memo with comparable exits", "Introductions to 2-3 top-fit buyers pre-screened for intent"].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 text-xs text-amber-200/70">
                    <CheckCircle2 className="h-4 w-4" />
                    Success fees triggered only on closed transactions.
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
