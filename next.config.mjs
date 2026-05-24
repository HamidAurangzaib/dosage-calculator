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
  async redirects() {
    return [
      { source: '/fr/:path*', destination: '/en/:path*', permanent: true },
      { source: '/de/:path*', destination: '/en/:path*', permanent: true },
      { source: '/pt/:path*', destination: '/en/:path*', permanent: true },
      { source: '/ur/:path*', destination: '/en/:path*', permanent: true },
      { source: '/fr', destination: '/en', permanent: true },
      { source: '/de', destination: '/en', permanent: true },
      { source: '/pt', destination: '/en', permanent: true },
      { source: '/ur', destination: '/en', permanent: true },
      // Blog is English-only — redirect es/ar blog paths to the English version
      { source: '/es/blog/:path*', destination: '/en/blog/:path*', permanent: true },
      { source: '/ar/blog/:path*', destination: '/en/blog/:path*', permanent: true },
      { source: '/es/blog', destination: '/en/blog', permanent: true },
      { source: '/ar/blog', destination: '/en/blog', permanent: true },
    ];
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
