'use client';

import { CheckCircle2, Search, FileText, Handshake, Users, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SiteContainer } from '@/components/site-container';

interface ProcessStepProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
  stepNumberClass: string;
  iconClass: string;
}

const ProcessStep = ({ number, title, description, icon, delay, stepNumberClass, iconClass }: ProcessStepProps) => (
  <motion.li
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.5, delay: delay * 0.08 }}
    className="relative flex gap-6 pl-14"
  >
    <div
      className={`absolute left-0 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full font-semibold ${stepNumberClass}`}
    >
      {number.toString().padStart(2, '0')}
    </div>
    <div className="flex-1 rounded-2xl border border-slate-200/60 bg-white/90 p-6 shadow-sm backdrop-blur">
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}>
          {icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{description}</p>
        </div>
      </div>
    </div>
  </motion.li>
);

type TabType = 'buy' | 'sell';

const themeConfig: Record<
  TabType,
  {
    eyebrowBorder: string;
    eyebrowText: string;
    toggleActive: string;
    toggleBorder: string;
    stepNumber: string;
    iconBg: string;
    bulletGradient: string;
    connectorGradient: string;
    sectionBackground: string;
    primaryGlow: string;
    secondaryGlow: string;
  }
> = {
  buy: {
    eyebrowBorder: 'border-blue-200',
    eyebrowText: 'text-blue-600',
    toggleActive: 'bg-gradient-to-r from-blue-500 via-blue-400 to-sky-300 text-slate-950 shadow',
    toggleBorder: 'border-blue-200/60',
    stepNumber: 'bg-gradient-to-br from-blue-500 via-blue-400 to-sky-300 text-slate-950 shadow-lg shadow-blue-500/30',
    iconBg: 'bg-gradient-to-br from-blue-500/15 via-blue-400/10 to-sky-300/20 text-blue-600',
    bulletGradient: 'from-blue-500 via-blue-400 to-sky-300',
    connectorGradient: 'from-blue-200 via-blue-100 to-sky-200',
    sectionBackground: 'bg-gradient-to-b from-white via-blue-50/40 to-sky-50/40',
    primaryGlow: 'bg-blue-400/20',
    secondaryGlow: 'bg-sky-300/25',
  },
  sell: {
    eyebrowBorder: 'border-amber-300/80',
    eyebrowText: 'text-amber-600',
    toggleActive: 'bg-gradient-to-r from-amber-400 via-orange-400 to-rose-300 text-slate-950 shadow',
    toggleBorder: 'border-amber-200/60',
    stepNumber: 'bg-gradient-to-br from-amber-400 via-orange-400 to-rose-300 text-slate-950 shadow-lg shadow-amber-400/40',
    iconBg: 'bg-gradient-to-br from-amber-400/15 via-orange-400/10 to-rose-300/20 text-amber-600',
    bulletGradient: 'from-amber-400 via-orange-400 to-rose-300',
    connectorGradient: 'from-amber-200 via-orange-100 to-rose-200',
    sectionBackground: 'bg-gradient-to-b from-white via-amber-50/40 to-rose-50/40',
    primaryGlow: 'bg-amber-400/20',
    secondaryGlow: 'bg-rose-300/20',
  },
};

export function ProcessFlow() {
  const [activeTab, setActiveTab] = useState<TabType>('buy');

  const theme = themeConfig[activeTab];

  const buySteps = [
    {
      title: 'Define your mandate',
      description:
        'Outline the sectors, revenue thresholds, and growth levers you care about. We respond with a longlist and diligence checklist within 48 hours.',
      icon: <Search className="h-5 w-5" />,
    },
    {
      title: 'Evaluate with our deal desk',
      description:
        'Get structured data rooms, financial benchmarks, and scenario modelling support aligned to your investment committee template.',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'Negotiate & close',
      description:
        'We coordinate intros, manage escrow, and choreograph operator onboarding so the handover runs on rails.',
      icon: <Handshake className="h-5 w-5" />,
    },
  ];

  const buyHighlights = [
    'Diligence scorecards aligned to investor approvals',
    'Escrow, legal, and tax partners ready to plug in',
    'Operator onboarding playbooks for the first 90 days',
  ];

  const sellHighlights = [
    'Founder-friendly valuation benchmarks and comps',
    'Cultural alignment interviews with shortlisted operators',
    'Detailed transition plan mapping people, tech, and capital',
  ];

  const sellSteps = [
    {
      title: 'Prep your succession brief',
      description:
        'Work with our strategists to package your financials, team plan, and transition priorities into an investor-ready memo.',
      icon: <FileText className="h-5 w-5" />,
    },
    {
      title: 'Match with qualified operators',
      description:
        'We surface operators and funds with proof-of-funds and relevant post-acquisition playbooks, then host diligence sessions.',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'Transition with confidence',
      description:
        'Leverage our escrow, legal, and HR partners to secure assets, retain talent, and deliver a structured leadership handover.',
      icon: <CheckCircle2 className="h-5 w-5" />,
    },
  ];

  const headingCopy: Record<TabType, { eyebrow: string; title: string; body: string }> = {
    buy: {
      eyebrow: 'For buyers',
      title: 'Your buying journey, orchestrated.',
      body:
        'Lean on our acquisition specialists at every milestone—no more spreadsheets or scattered email threads. We keep momentum from mandate to LOI.',
    },
    sell: {
      eyebrow: 'For sellers',
      title: 'Succession without the scramble.',
      body:
        'Transform your exit into a structured handover with a team that aligns valuation, culture, and continuity before you sign.',
    },
  };

  const steps = activeTab === 'buy' ? buySteps : sellSteps;
  const highlights = activeTab === 'buy' ? buyHighlights : sellHighlights;

  return (
    <section className={`relative overflow-hidden py-24 min-h-[720px] md:min-h-[680px] lg:min-h-[620px] ${theme.sectionBackground}`}>
      <div className={`absolute left-[-180px] top-[-120px] h-80 w-80 rounded-full blur-3xl ${theme.primaryGlow}`} />
      <div className={`absolute right-[-160px] top-1/3 h-96 w-96 rounded-full blur-3xl ${theme.secondaryGlow}`} />
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white/70 to-transparent" />

      <SiteContainer className="relative">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <span
              className={`inline-flex items-center rounded-full border bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] ${theme.eyebrowBorder} ${theme.eyebrowText}`}
            >
              {headingCopy[activeTab].eyebrow}
            </span>
            <h2 className="mt-4 text-3xl font-semibold text-slate-900 md:text-4xl">
              {headingCopy[activeTab].title}
            </h2>
            <p className="mt-4 max-w-xl text-base text-slate-600 md:text-lg">{headingCopy[activeTab].body}</p>
          </div>

          <div className={`inline-flex items-center rounded-full border bg-white/80 p-1 text-sm font-medium shadow-sm backdrop-blur ${theme.toggleBorder} self-start`}>
            <button
              onClick={() => setActiveTab('buy')}
              className={`rounded-full px-5 py-2 transition-all ${
                activeTab === 'buy' ? theme.toggleActive : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`rounded-full px-5 py-2 transition-all ${
                activeTab === 'sell' ? theme.toggleActive : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sell
            </button>
          </div>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[320px_1fr]">
          <motion.div
            key={`${activeTab}-summary`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm backdrop-blur"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">What to expect</p>
            <ul className="mt-6 space-y-4 text-sm text-slate-600">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className={`mt-1 inline-flex h-1.5 w-1.5 flex-none rounded-full bg-gradient-to-br ${theme.bulletGradient}`} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="relative">
            <div className={`absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b ${theme.connectorGradient} md:block`} />
            <AnimatePresence mode="wait">
              <motion.ul
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {steps.map((step, index) => (
                  <ProcessStep
                    key={`${activeTab}-${index}`}
                    number={index + 1}
                    title={step.title}
                    description={step.description}
                    icon={step.icon}
                    delay={index}
                    stepNumberClass={theme.stepNumber}
                    iconClass={theme.iconBg}
                  />
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>
      </SiteContainer>
    </section>
  );
}
