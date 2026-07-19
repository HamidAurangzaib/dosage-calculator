/**
 * Locale registry.
 *
 * SUPPORTED_LOCALES is the full set the theme's machinery understands — adding a
 * language is a matter of dropping translation JSON in and moving its code into
 * ACTIVE_LOCALES.
 *
 * ACTIVE_LOCALES is what actually ships. It is deliberately smaller: commit
 * d92f78b cut the site from 7 locales to 3 to clear Bing duplicate-title errors
 * caused by locales that fell back to untranslated English. Only promote a
 * locale here once ui/faq/common JSON exists for it, or that regression returns.
 */

export interface LocaleMeta {
  /** BCP-47 language subtag used in the URL and <html lang>. */
  code: string;
  /** Endonym, shown in the language switcher. */
  label: string;
  /** Short code for compact UI. */
  short: string;
  /** Text direction for <html dir>. */
  dir: 'ltr' | 'rtl';
  /** og:locale value. */
  ogLocale: string;
}

export const LOCALE_META = {
  en: { code: 'en', label: 'English', short: 'EN', dir: 'ltr', ogLocale: 'en_US' },
  hi: { code: 'hi', label: 'हिन्दी', short: 'HI', dir: 'ltr', ogLocale: 'hi_IN' },
  es: { code: 'es', label: 'Español', short: 'ES', dir: 'ltr', ogLocale: 'es_ES' },
  ru: { code: 'ru', label: 'Русский', short: 'RU', dir: 'ltr', ogLocale: 'ru_RU' },
  fr: { code: 'fr', label: 'Français', short: 'FR', dir: 'ltr', ogLocale: 'fr_FR' },
  de: { code: 'de', label: 'Deutsch', short: 'DE', dir: 'ltr', ogLocale: 'de_DE' },
  it: { code: 'it', label: 'Italiano', short: 'IT', dir: 'ltr', ogLocale: 'it_IT' },
  pt: { code: 'pt', label: 'Português', short: 'PT', dir: 'ltr', ogLocale: 'pt_PT' },
  bn: { code: 'bn', label: 'বাংলা', short: 'BN', dir: 'ltr', ogLocale: 'bn_BD' },
  ja: { code: 'ja', label: '日本語', short: 'JA', dir: 'ltr', ogLocale: 'ja_JP' },
  ko: { code: 'ko', label: '한국어', short: 'KO', dir: 'ltr', ogLocale: 'ko_KR' },
  ms: { code: 'ms', label: 'Bahasa Melayu', short: 'MS', dir: 'ltr', ogLocale: 'ms_MY' },
  pl: { code: 'pl', label: 'Polski', short: 'PL', dir: 'ltr', ogLocale: 'pl_PL' },
  id: { code: 'id', label: 'Bahasa Indonesia', short: 'ID', dir: 'ltr', ogLocale: 'id_ID' },
  ar: { code: 'ar', label: 'العربية', short: 'AR', dir: 'rtl', ogLocale: 'ar_AR' },
  bg: { code: 'bg', label: 'Български', short: 'BG', dir: 'ltr', ogLocale: 'bg_BG' },
  tr: { code: 'tr', label: 'Türkçe', short: 'TR', dir: 'ltr', ogLocale: 'tr_TR' },
  sv: { code: 'sv', label: 'Svenska', short: 'SV', dir: 'ltr', ogLocale: 'sv_SE' },
} as const satisfies Record<string, LocaleMeta>;

export type Locale = keyof typeof LOCALE_META;

export const SUPPORTED_LOCALES = Object.keys(LOCALE_META) as Locale[];

export const DEFAULT_LOCALE: Locale = 'en';

/** Locales with complete translations — the only ones routed and indexed. */
export const ACTIVE_LOCALES: Locale[] = ['en', 'es', 'ar'];

/** The blog is authored in English only; es/ar blog paths 301 to /en/blog. */
export const BLOG_LOCALES: Locale[] = ['en'];

export const RTL_LOCALES: Locale[] = SUPPORTED_LOCALES.filter(
  (code) => LOCALE_META[code].dir === 'rtl',
);

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && value in LOCALE_META;
}

export function isActiveLocale(value: unknown): value is Locale {
  return isLocale(value) && ACTIVE_LOCALES.includes(value);
}

export function getDir(locale: Locale): 'ltr' | 'rtl' {
  return LOCALE_META[locale].dir;
}

export function getOgLocale(locale: Locale): string {
  return LOCALE_META[locale].ogLocale;
}
