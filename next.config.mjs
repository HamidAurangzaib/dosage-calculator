import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./lib/i18n.ts');

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'NOSNIFF' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async rewrites() {
    return [
      // Proxy /ads.txt to Ezoic's always-up-to-date ad-network authorization list.
      // Bots see the file at our canonical /ads.txt URL while content stays fresh
      // without manual updates whenever Ezoic adds/removes ad partners.
      {
        source: '/ads.txt',
        destination: 'https://srv.adstxtmanager.com/19390/creatinedosagecalculator.com',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
