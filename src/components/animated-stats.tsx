'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Building2, Users, ShieldCheck } from 'lucide-react';

const AnimatedNumber = ({
  value,
  suffix = '',
  duration = 2,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView) {
      const start = 0;
      const end = value;
      const increment = end / (duration * 30); // 30fps

      let current = start;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCurrentValue(end);
          clearInterval(timer);
        } else {
          setCurrentValue(Math.ceil(current));
        }
      }, 1000 / 30);

      return () => clearInterval(timer);
    }
  }, [inView, value, duration]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="inline-block"
    >
      {currentValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
};

const stats = [
  {
    value: 10,
    suffix: 'B+',
    label: 'Total value moved',
    description: 'Closed deal volume since 2018 across APAC mandates.',
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    value: 50000,
    suffix: '+',
    label: 'Businesses vetted',
    description: 'Every listing underwritten against 40+ data points.',
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    value: 500000,
    suffix: '+',
    label: 'Operator network',
    description: 'Private equity, strategics, and first-time operators.',
    icon: <Users className="h-5 w-5" />,
  },
  {
    value: 98,
    suffix: '%',
    label: 'Success rate',
    description: 'Mandates reaching escrow inside 90 days of launch.',
    icon: <ShieldCheck className="h-5 w-5" />,
  },
];

export function AnimatedStats() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: index * 0.08, duration: 0.45 }}
          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 text-left text-blue-100 shadow-lg shadow-blue-950/30 backdrop-blur"
        >
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-blue-300/40 via-amber-200/60 to-blue-300/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-blue-200/70">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/25 via-blue-400/15 to-amber-300/30 text-blue-100">
              {stat.icon}
            </span>
            {stat.label}
          </div>
          <div className="mt-6 text-4xl font-semibold leading-tight text-transparent transition-colors duration-300 group-hover:text-white md:text-5xl">
            <span className="bg-gradient-to-r from-blue-200 via-sky-200 to-amber-200 bg-clip-text">
              <AnimatedNumber value={stat.value} suffix={stat.suffix} />
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-blue-100/80">
            {stat.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
