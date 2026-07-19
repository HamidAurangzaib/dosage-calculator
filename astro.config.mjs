// @ts-check
import fs from 'node:fs';

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';
import remarkGfm from 'remark-gfm';

import { ACTIVE_LOCALES, DEFAULT_LOCALE } from './theme/i18n/config.ts';

/*
 * Read rather than `import ... with { type: 'json' }`.
 *
 * Import attributes need Node >= 20.10 / >= 18.20. A Vercel project carried
 * over from Next.js is often still pinned to an older Node, where that syntax
 * is a SyntaxError at config load — the config never parses, so the build dies
 * before Astro prints anything useful. readFileSync works on every version.
 */
const site = JSON.parse(fs.readFileSync(new URL('./src/config/site.json', import.meta.url), 'utf8'));

/*
 * Legacy 301s carried over from next.config.mjs.
 *
 * They are enumerated rather than written as `/fr/[...rest]` wildcards: in a
 * static build Astro has to know every path it emits, and a spread pattern has
 * no getStaticPaths to expand it. Every URL these locales ever served is a page
 * in PAGE_PATHS or a post in src/blog, so the enumeration is complete.
 */
const RETIRED_LOCALES = ['fr', 'de', 'pt', 'ur'];

const PAGE_PATHS = [
  '',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/sitemap',
  '/editorial-team',
  '/blog',
  '/creatine-guide',
  '/creatine-research',
  '/creatine-hcl-calculator',
  '/creatine-dosage-by-weight',
];

const blogSlugs = fs
  .readdirSync('./src/blog')
  .filter((file) => /\.mdx?$/.test(file))
  .map((file) => file.replace(/\.mdx?$/, ''));

/** @type {Record<string, string>} */
const redirects = {
  // Reproduces what next-intl's middleware did for the bare root.
  '/': `/${DEFAULT_LOCALE}`,
};

// Locales retired in commit d92f78b.
for (const locale of RETIRED_LOCALES) {
  for (const path of PAGE_PATHS) {
    redirects[`/${locale}${path}`] = `/en${path}`;
  }
}

/*
 * Un-prefixed paths.
 *
 * Every page lives under a locale (/en/about), so a visitor who types
 * /about — or a stray inbound link that drops the prefix — used to hit a
 * hard 404. These send them to the English page instead. Conventional
 * aliases (/about-us, /contact-us, /privacy) are covered too, since those
 * are the paths people and crawlers guess at.
 */
for (const path of PAGE_PATHS) {
  if (path) redirects[path] = `/en${path}`;
}

const PATH_ALIASES = {
  '/about-us': '/en/about',
  '/contact-us': '/en/contact',
  '/privacy': '/en/privacy-policy',
  '/privacy-policy': '/en/privacy-policy',
  '/articles': '/en/blog',
};

for (const [from, to] of Object.entries(PATH_ALIASES)) {
  redirects[from] = to;
}

for (const slug of blogSlugs) {
  redirects[`/blog/${slug}`] = `/en/blog/${slug}`;
}

// The blog is authored in English only (commit 2dbf483), so the Spanish and
// Arabic blog URLs that were previously served must keep resolving.
for (const locale of ['es', 'ar']) {
  redirects[`/${locale}/blog`] = '/en/blog';
  for (const slug of blogSlugs) {
    redirects[`/${locale}/blog/${slug}`] = `/en/blog/${slug}`;
  }
}

export default defineConfig({
  site: site.url,
  output: 'static',
  adapter: vercel(),

  // The live site indexes every URL without a trailing slash (e.g. /en/blog,
  // not /en/blog/). Changing this would 301 every indexed page, so it stays.
  trailingSlash: 'never',

  // Routing is owned by the `src/pages/[locale]/` dynamic route, which keeps
  // English prefixed (/en) exactly as production serves it today. Astro's
  // built-in `i18n` block is deliberately not used: it expects directory-per-
  // locale pages and would fight the [locale] param route.
  redirects,

  integrations: [
    mdx(),
    react(),
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LOCALE,
        locales: Object.fromEntries(ACTIVE_LOCALES.map((l) => [l, l])),
      },
      filter: (page) => !page.includes('/sitemap'),
    }),
  ],

  markdown: {
    remarkPlugins: [remarkGfm],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
