'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AxiomWebVitals } from 'next-axiom';
import './globals.css';
import { ClientProviders } from '@/providers/client-providers';
import { UpdateNotification } from '@/components/ui/UpdateNotification';
import { usePathname } from 'next/navigation';
import { Footer } from '@/components/layout/footer';
import { Toaster } from 'sonner';

// Optimize font loading with next/font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  fallback: ['system-ui', 'sans-serif'],
  preload: true,
  adjustFontFallback: true,
});

// Define the WebVitals component to avoid import issues
function WebVitals() {
  return null;
}

// Define the RouteChangeHandler component to avoid import issues
function RouteChangeHandler() {
  return null;
}

// Client component to conditionally render footer
function ConditionalFooter() {
  const pathname = usePathname();

  // Don't show footer on dashboard pages
  if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return <Footer />;
}

const metadata: Metadata = {
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
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/_next/static/css/app/layout.css" as="style" />
        <link rel="preload" href="/_next/static/chunks/main.js" as="script" />
        
        {/* Add Axiom Web Vitals */}
        <AxiomWebVitals />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <ClientProviders>
          <main className="flex-grow">{children}</main>
          <ConditionalFooter />
          <Toaster position="top-center" richColors />
          <UpdateNotification />
        </ClientProviders>
        <RouteChangeHandler />
        {/* Performance monitoring script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/service-worker.js').then(
                    (registration) => {
                      console.log('ServiceWorker registration successful');
                    },
                    (err) => {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
              
              // Log page performance metrics
              if (window.performance) {
                const navigationEntries = performance.getEntriesByType('navigation');
                if (navigationEntries.length > 0) {
                  const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
                  console.log('Page load time:', navEntry.loadEventEnd - navEntry.startTime, 'ms');
                }
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
