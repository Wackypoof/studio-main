import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AxiomWebVitals } from 'next-axiom';
import './globals.css';
import { ClientProviders } from '@/providers/client-providers';
import { UpdateNotification } from '@/components/ui/UpdateNotification';
import { PerformanceMonitor } from '@/components/performance-monitor';
import { ConditionalFooter } from '@/components/layout/ConditionalFooter';
import { AppToaster } from '@/components/ui/AppToaster';
import { WebVitals } from '@/components/analytics/WebVitals';
import { RouteChangeHandler } from '@/components/analytics/RouteChangeHandler';

// Optimize font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: 'SuccessionAsia | Buy & Sell SMEs',
  description: 'Confidential, verified marketplace to buy and sell SMEs and professional practices in SEA.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'SuccessionAsia | Buy & Sell SMEs',
    description: 'Confidential, verified marketplace to buy and sell SMEs and professional practices in SEA.',
    type: 'website',
    locale: 'en_US',
    siteName: 'SuccessionAsia',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SuccessionAsia | Buy & Sell SMEs',
    description: 'Confidential, verified marketplace to buy and sell SMEs and professional practices in SEA.',
  },
  other: {
    'x-robots-tag': 'index, follow',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'x-xss-protection': '1; mode=block',
  },
  applicationName: 'SuccessionAsia',
  referrer: 'origin-when-cross-origin',
  keywords: ['SME', 'business for sale', 'buy business', 'sell business', 'Southeast Asia'],
  authors: [{ name: 'SuccessionAsia' }],
  creator: 'SuccessionAsia',
  publisher: 'SuccessionAsia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to analytics domains if used */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* Axiom Web Vitals */}
        <AxiomWebVitals />
      </head>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ClientProviders>
          <PerformanceMonitor />
          <main className="flex-grow">{children}</main>
          <ConditionalFooter />
          <AppToaster />
          <UpdateNotification />
        </ClientProviders>
        <WebVitals />
        <RouteChangeHandler />
      </body>
    </html>
  );
}
