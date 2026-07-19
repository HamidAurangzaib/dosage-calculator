import {
  ACTIVE_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_META,
  isActiveLocale,
  type Locale,
} from './config';

// Translations are split three ways so a locale can be updated piecemeal:
//   ui/     — page copy, calculator labels, meta titles/descriptions
//   faq/    — FAQ question/answer pairs (also feeds FAQPage JSON-LD)
//   common/ — nav, footer and other shared chrome labels
// Vite's eager glob gives us a static, build-time map, so a missing locale file
// is a build-visible fact rather than a runtime fetch failure.
const uiFiles = import.meta.glob<{ default: TranslationTree }>('./translations/ui/*.json', {
  eager: true,
});
const faqFiles = import.meta.glob<{ default: TranslationTree }>('./translations/faq/*.json', {
  eager: true,
});
const commonFiles = import.meta.glob<{ default: TranslationTree }>('./translations/common/*.json', {
  eager: true,
});

export type TranslationValue = string | string[] | TranslationTree | FaqEntry[];
export interface TranslationTree {
  [key: string]: TranslationValue;
}

export interface FaqEntry {
  question: string;
  answer: string;
  /** FAQ rows can be authored but withheld by setting `display: false`. */
  display?: boolean;
}

function localeFrom(path: string): string {
  return path.split('/').pop()!.replace('.json', '');
}

function collect(files: Record<string, { default: TranslationTree }>): Map<string, TranslationTree> {
  const map = new Map<string, TranslationTree>();
  for (const [path, mod] of Object.entries(files)) {
    map.set(localeFrom(path), mod.default);
  }
  return map;
}

const ui = collect(uiFiles);
const faq = collect(faqFiles);
const common = collect(commonFiles);

/** Deep-merge source over target without mutating either. */
function merge(target: TranslationTree, source: TranslationTree): TranslationTree {
  const out: TranslationTree = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const existing = out[key];
    if (isPlainTree(value) && isPlainTree(existing)) {
      out[key] = merge(existing, value);
    } else {
      out[key] = value;
    }
  }
  return out;
}

function isPlainTree(value: unknown): value is TranslationTree {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const cache = new Map<string, TranslationTree>();

/**
 * Merged dictionary for a locale: English first, then the locale's own files on
 * top. Any key a locale has not translated therefore falls back to English
 * rather than rendering blank.
 */
export function getTranslations(locale: Locale): TranslationTree {
  const cached = cache.get(locale);
  if (cached) return cached;

  const base = merge(
    merge(common.get(DEFAULT_LOCALE) ?? {}, ui.get(DEFAULT_LOCALE) ?? {}),
    faq.get(DEFAULT_LOCALE) ?? {},
  );

  const merged =
    locale === DEFAULT_LOCALE
      ? base
      : merge(
          merge(merge(base, common.get(locale) ?? {}), ui.get(locale) ?? {}),
          faq.get(locale) ?? {},
        );

  cache.set(locale, merged);
  return merged;
}

/**
 * Translator bound to a locale. Dotted key lookup, English fallback, and
 * `{placeholder}` interpolation. Returns the key itself if nothing resolves, so
 * a missing string is visible in the page rather than silently empty.
 */
export function useTranslations(locale: Locale) {
  const dict = getTranslations(locale);

  return function t(key: string, vars?: Record<string, string | number>): string {
    const value = lookup(dict, key);
    if (typeof value !== 'string') return key;
    if (!vars) return value;
    return value.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  };
}

/** Read a non-string branch (arrays, FAQ lists, objects) out of the dictionary. */
export function getEntry<T = TranslationValue>(locale: Locale, key: string): T | undefined {
  return lookup(getTranslations(locale), key) as T | undefined;
}

/** FAQ rows for a locale, with `display: false` entries filtered out. */
export function getFaq(locale: Locale, key = 'faq.items'): FaqEntry[] {
  const entries = getEntry<FaqEntry[]>(locale, key);
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => entry.display !== false);
}

function lookup(tree: TranslationTree, key: string): TranslationValue | undefined {
  let node: TranslationValue | undefined = tree;
  for (const part of key.split('.')) {
    if (!isPlainTree(node)) return undefined;
    node = node[part];
  }
  return node;
}

/**
 * Pull the locale out of route params.
 *
 * Every route lives under /[locale]/, English included — the production site has
 * always been prefixed and un-prefixing it would 301 every indexed URL.
 */
export function getLocaleFromParams(params: { locale?: string | undefined }): Locale {
  return isActiveLocale(params.locale) ? params.locale : DEFAULT_LOCALE;
}

/**
 * Build a locale-prefixed path. Pass "/" for the locale home.
 *
 *   localizedUrl('es', '/contact')  -> '/es/contact'
 *   localizedUrl('en', '/')         -> '/en'
 */
export function localizedUrl(locale: Locale, path = '/'): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '');
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/** Absolute URL for canonicals, Open Graph and JSON-LD. */
export function absoluteUrl(siteUrl: string, path: string): string {
  return `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

/** getStaticPaths source for any page that exists in every active locale. */
export function localeStaticPaths() {
  return ACTIVE_LOCALES.map((locale) => ({
    params: { locale },
    props: { locale },
  }));
}

export function getLocaleMeta(locale: Locale) {
  return LOCALE_META[locale];
}

export { ACTIVE_LOCALES, DEFAULT_LOCALE, LOCALE_META, isActiveLocale };
export type { Locale };
