/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.creatinedosagecalculator.com',
  generateRobotsTxt: true,
  alternateRefs: [
    { href: 'https://www.creatinedosagecalculator.com/en', hreflang: 'en' },
    { href: 'https://www.creatinedosagecalculator.com/es', hreflang: 'es' },
    { href: 'https://www.creatinedosagecalculator.com/ar', hreflang: 'ar' },
  ],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
