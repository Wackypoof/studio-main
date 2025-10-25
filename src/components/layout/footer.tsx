'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import { cn } from '@/lib/utils';

const navigation = {
  buyers: [
    { name: 'How it works', href: '/buyers/how-it-works' },
    { name: 'Featured listings', href: '/buyers/featured' },
    { name: 'Buying guide', href: '/buyers/guide' },
  ],
  sellers: [
    { name: 'Get a valuation', href: '/sellers/valuation' },
    { name: 'Success stories', href: '/sellers/success-stories' },
    { name: 'Selling process', href: '/sellers/process' },
  ],
  company: [
    { name: 'About', href: '/about' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Security', href: '/security' },
    { name: 'Sitemap', href: '/sitemap' },
  ],
  social: [
    { name: 'Twitter', href: 'https://twitter.com/successionasia', icon: FaTwitter },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/successionasia', icon: FaLinkedin },
    { name: 'YouTube', href: 'https://youtube.com/successionasia', icon: FaYoutube },
  ],
};

export function Footer() {
  const pathname = usePathname();
  const isSellerPage = pathname.startsWith('/sellers');

  const theme = isSellerPage
    ? {
        background: 'bg-[#110906]',
        overlay:
          'radial-gradient(120% 120% at 10% -10%, rgba(253, 224, 71, 0.28), transparent 55%), radial-gradient(110% 110% at 90% -10%, rgba(251, 146, 60, 0.24), transparent 60%), linear-gradient(160deg, rgba(255, 196, 94, 0.22) 0%, rgba(120, 53, 15, 0.55) 100%)',
      }
    : {
        background: 'bg-slate-950',
        overlay:
          'radial-gradient(130% 130% at 0% 0%, rgba(37, 99, 235, 0.25), transparent 60%), radial-gradient(120% 120% at 100% 0%, rgba(251, 191, 36, 0.25), transparent 65%)',
      };

  const primaryCta = isSellerPage
    ? {
        href: '/sellers',
        label: 'Explore seller platform',
        className:
          'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-300 text-slate-950 shadow-[0_8px_25px_rgba(251,191,36,0.30)] hover:from-amber-300 hover:to-orange-200',
      }
    : {
        href: '/buyers',
        label: 'Explore buyer platform',
        className:
          'bg-gradient-to-r from-blue-500 via-blue-400 to-emerald-300 text-slate-950 shadow-[0_8px_25px_rgba(56,189,248,0.35)] hover:from-blue-400 hover:to-emerald-200',
      };

  return (
    <footer
      className={cn(
        'relative overflow-hidden text-slate-100 transition-colors duration-500 ease-out',
        theme.background,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-90"
        style={{
          background: theme.overlay,
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
          <div className="space-y-10">
            <div className="flex flex-col gap-4">
              <span className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-slate-200">
                Succession Asia
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Deal intelligence for the operators shaping tomorrow’s internet economy.
              </h2>
              <p className="max-w-2xl text-base text-slate-300">
                Join thousands of founders, funds, and operators who rely on Succession Asia to source, evaluate, and close digital acquisitions across APAC.
              </p>
            </div>

            <div className="grid gap-6 rounded-3xl border border-white/15 bg-white/5 p-8 shadow-xl shadow-slate-900/30 backdrop-blur-sm sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-200/80">
                  Stay in the loop
                </h3>
                <p className="mt-3 text-sm text-slate-300/90">
                  Weekly deal insights, teardown playbooks, and curated listings straight from our deal desk.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <Link
                  href={primaryCta.href}
                  className={cn(
                    'w-full rounded-full px-6 py-3 text-center text-sm font-semibold transition sm:w-auto',
                    primaryCta.className,
                  )}
                >
                  {primaryCta.label}
                </Link>
                <Link
                  href="/sellers"
                  className="w-full rounded-full border border-white/30 bg-white/10 px-6 py-3 text-center text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/20 sm:w-auto"
                >
                  Plan your exit
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-300">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-200 transition hover:border-white hover:text-white"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300 shadow-lg shadow-slate-900/30 backdrop-blur">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-200/80">
                For buyers
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.buyers.map((item) => (
                  <li key={item.name}>
                    <Link className="transition hover:text-white" href={item.href}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-200/80">
                For sellers
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.sellers.map((item) => (
                  <li key={item.name}>
                    <Link className="transition hover:text-white" href={item.href}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-200/80">
                Company
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.company.map((item) => (
                  <li key={item.name}>
                    <Link className="transition hover:text-white" href={item.href}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-200/80">
                Legal
              </h3>
              <ul className="mt-4 space-y-3">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link className="transition hover:text-white" href={item.href}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Succession Asia. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <span>Deal desk HQ • Singapore</span>
            <span>support@succession.asia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
