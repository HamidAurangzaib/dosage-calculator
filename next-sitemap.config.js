/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.creatinedosagecalculator.com',
  generateRobotsTxt: true,
  alternateRefs: [
    { href: 'https://www.creatinedosagecalculator.com/en', hreflang: 'en' },
    { href: 'https://www.creatinedosagecalculator.com/es', hreflang: 'es' },
    { href: 'https://www.creatinedosagecalculator.com/fr', hreflang: 'fr' },
    { href: 'https://www.creatinedosagecalculator.com/de', hreflang: 'de' },
    { href: 'https://www.creatinedosagecalculator.com/pt', hreflang: 'pt' },
    { href: 'https://www.creatinedosagecalculator.com/ar', hreflang: 'ar' },
    { href: 'https://www.creatinedosagecalculator.com/ur', hreflang: 'ur' },
  ],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
