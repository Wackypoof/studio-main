"use client";

import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2, PlayCircle, Search, BarChart3, Users, Shield, Star, TrendingUp, Briefcase } from 'lucide-react';
import { SiteContainer } from '@/components/site-container';
import { LazyFeaturedListings, LazyProcessFlow, LazyAnimatedStats, LazyTestimonials } from '@/lib/lazy-components';
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
  'ACQUIRED.CO',
  'MICROACQUIRE',
  'G2',
  'AWS STARTUPS',
  'SEQUOIA SCOUTS',
];

const heroHighlights = [
  {
    label: 'Average ROI',
    value: '32%',
    helper: 'within 12 months',
  },
  {
    label: 'Listings close',
    value: '4.5× faster',
    helper: 'than industry average',
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
    <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-blue-500/40 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-sky-400/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.22),transparent_62%)]" />
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
                Rated 4.8/5 by verified founders on G2
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
                  Buy and sell online businesses with confidence.
                </h1>
                <p className="text-lg text-slate-200 md:text-xl">
                  Succession Asia blends market intelligence, vetted buyer networks, and hands-on deal support so every exit feels predictable—and every acquisition sets you up to scale.
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="group h-auto rounded-full bg-gradient-to-r from-blue-500 via-blue-400 to-sky-300 px-8 py-4 text-base font-semibold text-slate-950 shadow-lg shadow-blue-900/30 transition-all duration-300 hover:from-blue-400 hover:to-sky-200"
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
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    Vetted buyers & sellers in 65 countries
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                      <CheckCircle2 className="h-4 w-4" />
                    </span>
                    End-to-end deal desk guidance
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
              <div className="absolute -bottom-10 right-10 hidden h-32 w-32 rounded-full bg-blue-400/20 blur-2xl lg:block" />

              <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-blue-100/70">
                  <span>Live marketplace view</span>
                  <span>Updated now</span>
                </div>
                <div className="mt-6 space-y-5">
                  <div className="rounded-2xl bg-white/90 p-5 text-slate-900 shadow-lg">
                    <p className="text-xs font-semibold text-blue-500">SaaS • APAC</p>
                    <p className="mt-2 text-lg font-semibold">Subscription Analytics Suite</p>
                    <p className="mt-3 text-sm text-slate-500">MRR $42k · YoY growth 118%</p>
                    <div className="mt-4 flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-xs text-slate-400">Asking</span>
                        <p className="font-semibold text-slate-900">$1.3M</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Multiple</span>
                        <p className="font-semibold text-slate-900">3.2×</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400">Status</span>
                        <p className="font-semibold text-emerald-500">Hot</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-100">
                    <div className="rounded-xl bg-blue-500/20 p-3 text-blue-200">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Deal desk insight</p>
                      <p className="mt-1 text-sm">
                        Three offers pending review · average diligence cycle 11 days
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-blue-100">
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">Buyer spotlight</p>
                    <p className="mt-2 text-sm">
                      Elena (Singapore) just closed a $820k acquisition through our escrow desk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </SiteContainer>
      </section>

      {/* Process Flow */}
      <Suspense fallback={<div className="h-64" />}> 
        <LazyProcessFlow />
      </Suspense>

      {/* Stats Section */}
      <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_65%)]" />
        <SiteContainer className="relative z-10">
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mx-auto max-w-5xl"
          >
            <m.div variants={fadeInUp} className="text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Proof the platform works.</h2>
              <p className="mt-4 text-lg text-blue-100 md:text-xl">
                Independent, audited metrics from closed deals across SaaS, eCommerce, and marketplaces.
              </p>
            </m.div>

            <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
              <Suspense fallback={<div className="h-40" />}>
                <LazyAnimatedStats />
              </Suspense>

              <m.div variants={fadeInUp} className="space-y-6 text-sm text-blue-100">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 leading-relaxed">
                  Metrics verified quarterly by our finance operations team in partnership with EY APAC.
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-white">Deals completed</p>
                    <p>Across 18 sectors, with a median diligence period of 16.5 days.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white">Buyer network</p>
                    <p>Comprised of private equity, strategic acquirers, and first-time operators—every profile manually verified.</p>
                  </div>
                  <div className="border-t border-white/10 pt-4 text-xs text-blue-200/70">
                    Data current as of Q4 2024. Success rate reflects listings that progressed to escrow within 90 days.
                  </div>
                </div>
              </m.div>
            </div>
          </m.div>
        </SiteContainer>
      </section>

      {/* Testimonials Section */}
      <Suspense fallback={<div className="h-40" />}>
        <LazyTestimonials />
      </Suspense>

      {/* Features Section */}
      <section className="bg-white py-20">
        <SiteContainer>
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="mb-16 flex flex-col gap-10 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left"
          >
            <div className="space-y-4">
              <m.p variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50/60 px-4 py-1 text-sm font-medium text-blue-700">
                <span className="flex h-2 w-2 rounded-full bg-blue-500" />
                Platform advantages
              </m.p>
              <m.h2 variants={fadeInUp} className="text-3xl font-bold text-slate-900 md:text-4xl">
                Everything you need from first intro to final wire.
              </m.h2>
              <m.p variants={fadeInUp} className="text-lg text-slate-600 md:max-w-xl">
                Deal rooms, valuation tools, escrow workflows, and research-backed playbooks mean you spend less time chasing paperwork and more time growing the acquired business.
              </m.p>
            </div>
            <m.div variants={fadeInUp} className="flex justify-center gap-6 text-sm text-slate-500">
              <div>
                <span className="text-slate-900">78%</span>
                <span className="block text-xs uppercase tracking-[0.3em]">close rate</span>
              </div>
              <div className="hidden h-10 w-px bg-slate-200 lg:block" />
              <div>
                <span className="text-slate-900">11 day</span>
                <span className="block text-xs uppercase tracking-[0.3em]">avg diligence</span>
              </div>
            </m.div>
          </m.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Advanced Search"
              description="Find the perfect business with our powerful search and filtering tools."
              delay={0}
            />
            <FeatureCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Data-Driven Insights"
              description="Make informed decisions with comprehensive business analytics."
              delay={1}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Secure Transactions"
              description="Your security is our top priority with escrow and legal protection."
              delay={2}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Dedicated Support"
              description="Our team of experts is here to guide you through every step."
              delay={3}
            />
            <FeatureCard
              icon={<TrendingUp className="h-6 w-6" />}
              title="Growth Tools"
              description="Access resources to help your business grow after acquisition."
              delay={4}
            />
            <FeatureCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Business Valuation"
              description="Get an accurate valuation for your business before listing."
              delay={5}
            />
          </div>
        </SiteContainer>
      </section>

      {/* Featured Listings */}
      <Suspense fallback={<div className="h-40" />}>
        <LazyFeaturedListings />
      </Suspense>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white">
        <div className="absolute inset-0">
          <div className="absolute -right-32 top-10 hidden h-72 w-72 rounded-full bg-sky-400/30 blur-3xl lg:block" />
          <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl" />
        </div>
        <SiteContainer className="relative z-10">
          <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-10 shadow-xl backdrop-blur md:grid-cols-[1.2fr_auto] md:items-center">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-blue-100">
                Next steps
              </p>
              <h2 className="text-3xl font-semibold md:text-4xl">
                Ready to plan your acquisition—or your exit?
              </h2>
              <p className="text-base text-blue-100 md:text-lg">
                Share your mandate and our deal team will curate a personalised playbook within one business day, including market comps, valuation ranges, and a go-live timeline.
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
                  <Link href="/contact">Book a strategy call</Link>
                </Button>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-blue-100">
              <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">What happens next</p>
              <ul className="space-y-3">
                {["20-minute scoping call with our deal desk", "Curated data room checklist tailored to your goal", "Introductions to vetted buyers or operators in your niche"].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-2 text-xs text-blue-200/70">
                <CheckCircle2 className="h-4 w-4" />
                No fees until you close a deal through Succession Asia.
              </div>
            </div>
          </div>
        </SiteContainer>
      </section>
    </div>
    </LazyMotion>
  );
}
