import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import Header from '@/components/Layout/Header';
import Footer from '@/components/Layout/Footer';
import OneSignalProvider from '@/components/OneSignalProvider';
import PushNotificationPrompt from '@/components/PushNotificationPrompt';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const rtlLocales = ['ar', 'ur'];

export const metadata: Metadata = {
  metadataBase: new URL('https://www.creatinedosagecalculator.com'),
  openGraph: {
    siteName: 'CreatineCalc',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@creatinecalc',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'fr' },
    { locale: 'de' },
    { locale: 'pt' },
    { locale: 'ar' },
    { locale: 'ur' },
  ];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  const messages = await getMessages();
  const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <head>
        {/* ─── Ezoic Privacy Scripts ─────────────────────────────────────
            MUST load FIRST and SYNCHRONOUSLY — before any ad/analytics scripts.
            Must keep data-cfasync="false" before src (required by Ezoic CMP
            compliance — prevents Cloudflare from reordering or async-loading).
            ESLint warnings about no-sync-scripts are intentional here. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script data-cfasync="false" src="https://cmp.gatekeeperconsent.com/min.js"></script>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script data-cfasync="false" src="https://the.gatekeeperconsent.com/cmp.min.js"></script>

        {/* ─── Ezoic Header Script ───────────────────────────────────────
            Initializes the Ezoic ad system. Loads after privacy scripts. */}
        <script async src="//www.ezojs.com/ezoic/sa.min.js"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ezstandalone = window.ezstandalone || {};
ezstandalone.cmd = ezstandalone.cmd || [];`,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="//ezoicanalytics.com/analytics.js"></script>

        {/* ─── Google Analytics 4 ────────────────────────────────────────
            Independent of Ezoic. Plain <script> for visibility in raw HTML. */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BJY7JE2V1R"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-BJY7JE2V1R');`,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Organization schema — E-E-A-T authority signal */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CreatineCalc',
              url: 'https://www.creatinedosagecalculator.com',
              description: 'Science-based creatine dosage calculator and educational resource based on ISSN guidelines.',
              foundingDate: '2026',
              knowsAbout: ['Creatine supplementation', 'Sports nutrition', 'Exercise physiology', 'ISSN guidelines'],
              sameAs: [],
            }),
          }}
        />
        <OneSignalProvider />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <PushNotificationPrompt />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
