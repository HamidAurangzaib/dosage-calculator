import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Script from 'next/script';
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
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
