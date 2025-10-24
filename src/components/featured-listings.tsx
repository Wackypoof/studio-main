import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Button } from './ui/button';

type Listing = {
  id: string;
  title: string;
  description: string;
  price: string;
  revenue: string;
  profit: string;
  category: string;
  growth: string;
  multiple: string;
  buyers: string;
  accent: string;
};

const featuredListings: Listing[] = [
  {
    id: '1',
    title: 'AI-Powered Content Creation Platform',
    description: 'SaaS platform that helps marketers create high-quality content using AI. 3 years in business with 200+ paying customers.',
    price: '$1,200,000',
    revenue: '$35,000 MRR',
    profit: '25% Margin',
    category: 'SaaS',
    growth: '118% YoY',
    multiple: '3.2× multiple',
    buyers: '14 active buyers',
    accent: 'from-blue-600 via-sky-500 to-emerald-400',
  },
  {
    id: '2',
    title: 'E-commerce Fashion Brand',
    description: 'Profitable D2C fashion brand with strong social media presence and loyal customer base. 5 years in business.',
    price: '$850,000',
    revenue: '$120,000 Annual',
    profit: '30% Margin',
    category: 'E-commerce',
    growth: '62% YoY',
    multiple: '2.4× multiple',
    buyers: '8 active buyers',
    accent: 'from-fuchsia-500 via-pink-500 to-amber-400',
  },
  {
    id: '3',
    title: 'SEO Content Agency',
    description: 'Established content marketing agency with retainer clients and a team of 10 writers. 4 years in business.',
    price: '$450,000',
    revenue: '$25,000 MRR',
    profit: '40% Margin',
    category: 'Agency',
    growth: '35% YoY',
    multiple: '2.0× multiple',
    buyers: '5 active buyers',
    accent: 'from-slate-900 via-slate-800 to-blue-700',
  },
];

export function FeaturedListings() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 text-center lg:flex-row lg:items-end lg:justify-between lg:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-400">Featured inventory</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">A glimpse at businesses closing this quarter.</h2>
          </div>
          <p className="text-base text-slate-600 lg:max-w-md">
            Listings are handpicked by our deal desk and include full diligence packs, verified P&L statements, and governance-ready data rooms.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {featuredListings.map((listing) => (
            <article
              key={listing.id}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              <div className="absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r from-transparent via-blue-400/40 to-transparent transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white">
                <div className={cn('h-full w-full bg-gradient-to-br opacity-90', listing.accent)} />
                <div className="absolute inset-0 p-5">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/70">
                    <span>{listing.category}</span>
                    <span>Verified</span>
                  </div>
                  <p className="mt-3 text-lg font-semibold leading-tight">{listing.title}</p>
                  <div className="mt-6 grid h-20 grid-cols-6 items-end gap-2">
                    {['h-4', 'h-10', 'h-14', 'h-8', 'h-16', 'h-9'].map((height, index) => (
                      <span
                        key={index}
                        className={cn(
                          'rounded-md bg-white/70 transition-all duration-500 group-hover:bg-white',
                          height,
                        )}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <p className="line-clamp-3 text-sm text-slate-600">{listing.description}</p>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="rounded-2xl border border-slate-200/60 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Asking</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{listing.price}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Revenue</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{listing.revenue}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200/60 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Profit</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{listing.profit}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-blue-500">
                  <span>{listing.growth}</span>
                  <span className="inline-flex h-1 w-1 rounded-full bg-blue-200" />
                  <span>{listing.multiple}</span>
                  <span className="inline-flex h-1 w-1 rounded-full bg-blue-200" />
                  <span>{listing.buyers}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Financials, traffic, and tech stack vetted by Succession analysts.
                </div>

                <Button
                  className="w-full rounded-full bg-slate-900 py-6 text-base font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                  asChild
                >
                  <Link href={`/listings/${listing.id}`}>
                    View deal room <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-white px-8 py-10 text-center lg:flex-row lg:text-left">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900">Looking for something specific?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Tell us about your mandate and we will shortlist verified deals that match your ideal revenue, geography, and tech stack.
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-slate-300 px-8 py-5 text-base font-semibold text-slate-900 hover:border-slate-400"
            asChild
          >
            <Link href="/dashboard/browse-listings">
              Browse full marketplace <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
