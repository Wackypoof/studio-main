import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/providers/client-providers';
import { UpdateNotification } from '@/components/ui/UpdateNotification';
import { ConditionalFooter } from '@/components/layout/ConditionalFooter';
import { AppToaster } from '@/components/ui/AppToaster';
import { DynamicAnalytics } from '@/components/analytics/DynamicAnalytics';

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
  icons: {
    icon: [
      { url: '/icons/succession.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/succession.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/succession.png' },
      { url: '/icons/succession.png', sizes: '152x152' },
      { url: '/icons/succession.png', sizes: '180x180' },
    ],
    shortcut: '/favicon.ico',
  },
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
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
    'msapplication-TileColor': '#2B5797',
    'msapplication-tap-highlight': 'no',
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SuccessionAsia',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const enableMonitoring = process.env.NEXT_PUBLIC_ENABLE_MONITORING?.toString() === 'true';
  const enableAnalytics = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS?.toString() === 'true';
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect to analytics domains only when analytics enabled */}
        {enableAnalytics && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" />
            <link rel="preconnect" href="https://www.google-analytics.com" />
          </>
        )}
        <link rel="apple-touch-icon" href="/icons/succession.png" />
        <link rel="apple-touch-startup-image" href="/splash/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/splash/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/splash/ipad_splash.png" media="(min-device-width: 768px) and (max-device-width: 1024px) and (-webkit-min-device-pixel-ratio: 2)" />
      </head>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`} suppressHydrationWarning>
        <ClientProviders>
          {enableMonitoring && <DynamicAnalytics enableMonitoring={enableMonitoring} />}
          <main className="flex-grow">{children}</main>
          <ConditionalFooter />
          <AppToaster />
          <UpdateNotification />
        </ClientProviders>
      </body>
    </html>
  );
}
