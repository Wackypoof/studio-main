"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, PlayCircle, Search, BarChart3, Users, Shield, Star, TrendingUp, Briefcase } from 'lucide-react';
import { SiteContainer } from '@/components/site-container';
import { LazyFeaturedListings, LazyProcessFlow, LazyAnimatedStats } from '@/lib/lazy-components';
import { LazyMotion, domAnimation, m, type Variants } from 'framer-motion';
import { ReactNode, Suspense } from 'react';
import Link from 'next/link';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const partnerLogos = [
  'TEMASEK CONNECT',
  'GOLDEN GATE VENTURES',
  'ANTLER ASEAN',
  'AWS STARTUPS',
  'SEQUOIA SPARK',
];

const heroHighlights = [
  {
    label: 'Verified buyers',
    value: '12k+',
    helper: 'across Southeast Asia',
  },
  {
    label: 'Average exit timeline',
    value: '58 days',
    helper: 'from intro to close',
  },
];

const FeatureCard = ({ icon, title, description, delay = 0 }: FeatureCardProps) => (
  <m.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-blue-200 via-amber-200 to-blue-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-amber-300/20 text-blue-600">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    <p className="mt-3 text-base text-slate-600">{description}</p>
  </m.div>
);

export default function LandingPage() {
  return (
    <LazyMotion features={domAnimation}>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#062e5c] to-[#0f172a] text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-500/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-amber-400/25 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.28),transparent_62%)]" />
        </div>

        <SiteContainer className="relative z-10 py-20 md:py-28">
          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]"
          >
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100 shadow-lg shadow-blue-900/30 backdrop-blur">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-300">
                  <Star className="h-4 w-4" />
                </span>
                Rated 4.9/5 by founders planning succession across APAC
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                  Succession-ready exits for Asia&apos;s digital economy.
                </h1>
                <p className="text-lg text-slate-200 md:text-xl">
                  Succession Asia combines regional market intelligence, curated buyer coalitions, and hands-on transition support so founders can pass the torch with confidence—and new operators scale from day one.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="group h-auto rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-amber-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition-all duration-300 hover:from-blue-400 hover:to-amber-200"
                  asChild
                >
                  <Link href="/signup" className="flex items-center">
                    Get started free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="h-auto rounded-full border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white hover:border-white/40 hover:bg-white/10"
                  asChild
                >
                  <Link href="/buyers" className="flex items-center">
                    See how it works
                    <PlayCircle className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Link href="/login" className="text-sm font-medium text-slate-300 underline-offset-4 transition hover:text-white hover:underline">
                  Already have an account?
                </Link>
              </div>

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-4 text-sm text-slate-200">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-amber-300/30 text-blue-200">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    Regional operators & investors across 12 Asian hubs
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-amber-300/30 text-blue-200">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    Dedicated succession strategists on every mandate
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
                <p className="text-xs font-semibold uppercase tracking-[0.5em] text-slate-400">Trusted by deal teams from</p>
                <div className="mt-4 flex flex-wrap items-center gap-4 opacity-80">
                  {partnerLogos.map((logo) => (
                    <span
                      key={logo}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wider text-slate-200"
                    >
                      {logo}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute -top-12 -left-8 hidden h-40 w-40 rounded-full bg-blue-500/10 blur-2xl lg:block" />
              <div className="absolute -bottom-10 right-10 hidden h-32 w-32 rounded-full bg-amber-300/25 blur-2xl lg:block" />

              <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-blue-100/70">
                  <span>Live marketplace view</span>
                  <span>Updated now</span>
                </div>
                <div className="mt-6 space-y-5">
                  <div className="rounded-2xl bg-white/90 p-5 text-slate-900 shadow-lg">
                    <p className="text-xs font-semibold text-blue-500">B2B SaaS • Singapore</p>
                    <p className="mt-2 text-lg font-semibold">Succession Enablement Platform</p>
                    <p className="mt-3 text-sm text-slate-500">MRR $52k · YoY growth 127%</p>
                    <div className="mt-4 flex items-center gap-4 text-sm">
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
                        <p className="font-semibold text-emerald-500">Hot</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-100">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-amber-300/30 p-3 text-blue-200">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Succession desk insight</p>
                      <p className="mt-1 text-sm">
                        Five offers in diligence · average transition timeline 9 weeks
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-100">
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Buyer spotlight</p>
                    <p className="mt-2 text-sm">
                      Arjun (Kuala Lumpur) just closed a $1.2M roll-up via our escrow desk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </SiteContainer>
      </section>

      {/* Platform Advantages */}
      <section className="bg-gradient-to-b from-white via-white to-amber-50/30 py-20">
        <SiteContainer>
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16 flex flex-col gap-10 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left"
          >
            <div className="space-y-4">
              <m.p variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-amber-100 bg-gradient-to-r from-blue-50/70 via-white to-amber-50/60 px-4 py-1 text-sm font-medium text-blue-700">
                <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                Platform advantages
              </m.p>
              <m.h2 variants={fadeInUp} className="text-3xl font-bold text-slate-900 md:text-4xl">
                Built for succession outcomes, not generic M&amp;A.
              </m.h2>
              <m.p variants={fadeInUp} className="text-lg text-slate-600 md:max-w-xl">
                Mandate strategists, live buyer intelligence, and operator enablement live in one workspace so the handover keeps its momentum. See how the full mandate runs below.
              </m.p>
            </div>
            <m.div variants={fadeInUp} className="flex justify-center gap-6 text-sm text-slate-500">
              <div>
                <span className="text-2xl font-semibold text-slate-900">78%</span>
                <span className="block text-xs uppercase tracking-[0.3em]">close rate</span>
                <span className="mt-1 block text-[0.7rem] text-slate-400">for mandates we shepherded to escrow</span>
              </div>
              <div className="hidden h-10 w-px bg-slate-200 lg:block" />
              <div>
                <span className="text-2xl font-semibold text-slate-900">11 days</span>
                <span className="block text-xs uppercase tracking-[0.3em]">avg diligence</span>
                <span className="mt-1 block text-[0.7rem] text-slate-400">from shortlist to signed LOI</span>
              </div>
            </m.div>
          </m.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Succession Playbooks"
              description="Founder-to-operator transition plans built from 200+ closed mandates and tailored to Asian markets."
              delay={0}
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Buyer Intelligence"
              description="Understand every buyer’s track record with live appetite scores, proof-of-funds, and operator theses."
              delay={1}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Escrow & Transition Desk"
              description="Dedicated legal, escrow, and HR partners to secure assets and people through the handover period."
              delay={2}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Dedicated Strategists"
              description="Regional deal teams surface the right matches and stay embedded until your succession plan is delivered."
              delay={3}
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Growth Continuity"
              description="Operator enablement sprints cover marketing, finance, and product so revenue momentum never slips."
              delay={4}
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Valuation Benchmarks"
              description="Benchmark multiples against real-time comps from Asia Pacific, with quarterly audited adjustments."
              delay={5}
            />
          </div>
        </SiteContainer>
      </section>

      {/* Process Flow */}
      <Suspense fallback={<div className="h-64" />}>
        <LazyProcessFlow />
      </Suspense>

      {/* Outcomes Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#052c55] to-[#0f172a] py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.18),transparent_65%)]" />
        <SiteContainer className="relative z-10">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto"
          >
            <m.div variants={fadeInUp} className="text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Proof the succession model works.</h2>
              <p className="mt-4 text-lg text-blue-100 md:text-xl">
                Audited outcomes from founders and buyers navigating generational transitions across SaaS, eCommerce, and services in Asia Pacific.
              </p>
            </m.div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <Suspense fallback={<div className="h-40" />}>
                <LazyAnimatedStats />
              </Suspense>

              <m.div variants={fadeInUp} className="space-y-8 text-sm text-blue-100">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 leading-relaxed shadow-lg shadow-blue-950/20 backdrop-blur">
                  Metrics verified quarterly by our finance operations team in partnership with EY ASEAN.
                </div>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10 text-white">
                      <TrendingUp className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-white">Deals completed</p>
                      <p className="text-blue-100/80">
                        Succession mandates in 18 sectors with a median diligence period of 16.5 days and transition plans locked inside 30 days.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <span className="mt-1 inline-flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/10 text-white">
                      <Users className="h-5 w-5" />
                    </span>
                    <div className="space-y-1">
                      <p className="font-semibold text-white">Buyer network</p>
                      <p className="text-blue-100/80">
                        Comprised of private equity, strategic acquirers, and first-time operators—every profile manually verified within the region.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 border-t border-white/10 pt-4 text-xs text-blue-200/70">
                    <span className="mt-1 inline-flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-white/10 text-white">
                      <Shield className="h-4 w-4" />
                    </span>
                    <p>
                      Data current as of Q4 2024. Success rate reflects mandates that progressed to escrow within 90 days.
                    </p>
                  </div>
                </div>
              </m.div>
            </div>
          </m.div>
        </SiteContainer>
      </section>

      {/* Featured Listings */}
      <Suspense fallback={<div className="h-40" />}>
        <LazyFeaturedListings />
      </Suspense>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#062e5c] to-[#0f172a] py-24 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-32 top-10 hidden h-72 w-72 rounded-full bg-amber-400/30 blur-3xl lg:block" />
          <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-500/25 blur-3xl" />
        </div>
        <SiteContainer className="relative z-10">
          <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-xl backdrop-blur md:grid-cols-[1.2fr_auto] md:items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-blue-100">
                Next steps
              </p>
              <h2 className="text-3xl font-semibold md:text-4xl">
                Ready to map the next chapter of your company?
              </h2>
              <p className="text-base text-blue-100 md:text-lg">
                Share your mandate and our succession desk will deliver a tailored playbook inside one business day—complete with valuation ranges, transition milestones, and curated buyer shortlists.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  size="lg"
                  className="h-auto rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-amber-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition hover:from-blue-400 hover:to-amber-200"
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
                  <Link href="/contact">Book a strategy call</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-blue-100">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">What happens next</p>
              <ul className="space-y-3">
                {["20-minute scoping call with our succession desk", "Curated transition checklist tailored to your goal", "Introductions to vetted buyers or operators in your niche"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-amber-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-xs text-blue-200/70">
                <CheckCircle2 className="h-4 w-4 text-amber-300" />
                No fees until your succession mandate closes with Succession Asia.
              </div>
            </div>
          </div>
        </SiteContainer>
      </section>
    </div>
    </LazyMotion>
  );
}
