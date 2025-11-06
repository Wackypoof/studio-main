import type { ComponentType } from 'react';
import { cn } from '@/lib/utils';

type IconComponent = ComponentType<{ className?: string }>;

type MetricTone = 'buyer' | 'seller' | 'neutral';

interface DashboardMetricCardProps {
  label: string;
  value: string | number;
  description?: string;
  icon: IconComponent;
  tone?: MetricTone;
  className?: string;
}

const toneStyles: Record<MetricTone, { hairline: string; iconBg: string; iconText: string }> = {
  buyer: {
    hairline: 'from-blue-200 via-sky-200 to-emerald-200',
    iconBg: 'from-blue-500/15 via-sky-400/10 to-emerald-400/20',
    iconText: 'text-blue-600',
  },
  seller: {
    hairline: 'from-amber-200 via-orange-200 to-rose-200',
    iconBg: 'from-amber-500/15 via-orange-400/10 to-rose-400/20',
    iconText: 'text-amber-600',
  },
  neutral: {
    hairline: 'from-slate-200 via-slate-100 to-slate-200',
    iconBg: 'from-slate-500/15 via-slate-400/10 to-slate-300/15',
    iconText: 'text-slate-600',
  },
};

export function DashboardMetricCard({
  label,
  value,
  description,
  icon: Icon,
  tone = 'neutral',
  className = '',
}: DashboardMetricCardProps) {
  const palette = toneStyles[tone];

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className,
      )}
    >
      <div
        className={cn(
          'absolute inset-x-6 top-0 h-px bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100',
          palette.hairline,
        )}
      />
      <div
        className={cn(
          'mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-slate-900/80',
          palette.iconBg,
        )}
      >
        <Icon className={cn('h-5 w-5', palette.iconText)} />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">{label}</p>
        <p className="text-3xl font-semibold text-slate-900">{value}</p>
        {description && <p className="text-sm text-slate-600">{description}</p>}
      </div>
    </div>
  );
}
