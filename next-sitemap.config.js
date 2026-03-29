/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.creatinecalc.com',
  generateRobotsTxt: true,
  alternateRefs: [
    { href: 'https://www.creatinecalc.com/en', hreflang: 'en' },
    { href: 'https://www.creatinecalc.com/es', hreflang: 'es' },
    { href: 'https://www.creatinecalc.com/fr', hreflang: 'fr' },
    { href: 'https://www.creatinecalc.com/de', hreflang: 'de' },
    { href: 'https://www.creatinecalc.com/pt', hreflang: 'pt' },
    { href: 'https://www.creatinecalc.com/ar', hreflang: 'ar' },
    { href: 'https://www.creatinecalc.com/ur', hreflang: 'ur' },
  ],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
