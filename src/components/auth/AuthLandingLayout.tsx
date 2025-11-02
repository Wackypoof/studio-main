import { ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SiteContainer } from '@/components/site-container';

interface AuthLandingLayoutProps {
  badge: string;
  title: string;
  description: string;
  stats: Array<{
    label: string;
    value: string;
    description: string;
  }>;
  highlights: string[];
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthLandingLayout({
  badge,
  title,
  description,
  stats,
  highlights,
  footer,
  children,
}: AuthLandingLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,116,144,0.2),transparent_55%)]" />
      </div>

      <SiteContainer className="relative z-10 flex min-h-[calc(100dvh-6rem)] items-center py-12 md:min-h-[calc(100dvh-8rem)] md:py-16">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,420px)] xl:gap-24">
          {/* Left side - Marketing content */}
          <div className="space-y-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-blue-100/80 backdrop-blur">
              {badge}
            </div>

            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                {title}
              </h1>
              <p className="max-w-xl text-lg text-slate-200 md:text-xl">
                {description}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200/70">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">{stat.value}</p>
                  <p className="text-xs text-blue-100/70">{stat.description}</p>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="space-y-4 text-sm text-blue-100">
              {highlights.map((point) => (
                <div key={point} className="flex items-start gap-3">
                  <span className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 text-blue-200">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* Footer link */}
            {footer && <div className="text-sm text-blue-200">{footer}</div>}
          </div>

          {/* Right side - Form */}
          {children}
        </div>
      </SiteContainer>
    </div>
  );
}
