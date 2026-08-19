/**
 * JSON-LD graph construction.
 *
 * Every page emits ONE <script type="application/ld+json"> holding a single
 * `@graph`. Organization and WebSite are defined once here and referenced by
 * `@id` from every other node, so a crawler resolves one publisher entity for
 * the whole site rather than a separate inline copy on each page.
 *
 * Pages keep authoring their own page-specific nodes (breadcrumb, article,
 * calculator) and hand them to BaseLayout. `normalizeNodes` then applies the
 * graph-wide rules — dropping the per-node `@context`, assigning `@id`s,
 * rewriting inline publishers into references — so no individual page has to
 * restate them and they cannot drift apart.
 */
import site from '@/config/site.json';
import { DEFAULT_LOCALE, absoluteUrl, localizedUrl, type Locale } from '@theme/i18n/utils';

export type SchemaNode = Record<string, unknown>;

export const ORGANIZATION_ID = `${site.url}/#organization`;
export const WEBSITE_ID = `${site.url}/#website`;

/** Publisher entity. Defined once; every other node points at ORGANIZATION_ID. */
export function organizationNode(): SchemaNode {
  // Every social profile in site.json is currently an empty string. A sameAs
  // array of blanks is worse than no sameAs, so the key stays off until real
  // profile URLs exist.
  const sameAs = Object.values(site.social).filter((url): url is string => Boolean(url));

  return {
    '@type': 'Organization',
    '@id': ORGANIZATION_ID,
    name: site.name,
    legalName: site.legalName,
    url: absoluteUrl(site.url, localizedUrl(DEFAULT_LOCALE, '/')),
    logo: { '@type': 'ImageObject', url: absoluteUrl(site.url, site.logo) },
    email: site.contactEmail,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * Site entity.
 *
 * Deliberately carries no SearchAction. A sitelinks-searchbox action has to
 * point at a real on-site search endpoint; this site has none, and the previous
 * `?q={search_term_string}` target simply loaded the homepage with the query
 * ignored — a search feature claimed to Google that does not exist.
 */
export function webSiteNode(description: string): SchemaNode {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${site.url}/`,
    name: site.name,
    description,
    publisher: { '@id': ORGANIZATION_ID },
    inLanguage: DEFAULT_LOCALE,
  };
}

export type PageKind = 'about' | 'contact' | 'generic';

const PAGE_TYPE: Record<PageKind, string> = {
  about: 'AboutPage',
  contact: 'ContactPage',
  generic: 'WebPage',
};

/**
 * The page entity the rest of the graph hangs off.
 *
 * Carries no datePublished/dateModified: the static pages hold no real
 * published or modified date anywhere in the codebase, and inventing one on a
 * health site is the same fabricated-signal problem the editorial policy exists
 * to prevent. Articles supply their own dates from frontmatter instead.
 */
export function webPageNode(options: {
  canonical: string;
  title: string;
  description: string;
  locale: Locale;
  pageType: PageKind;
  hasBreadcrumb: boolean;
}): SchemaNode {
  const { canonical, title, description, locale, pageType, hasBreadcrumb } = options;

  return {
    '@type': PAGE_TYPE[pageType],
    '@id': `${canonical}#webpage`,
    url: canonical,
    name: title,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: locale,
    ...(hasBreadcrumb ? { breadcrumb: { '@id': `${canonical}#breadcrumb` } } : {}),
  };
}

/** True when `node` carries `type`, whether @type is a string or an array. */
export function hasType(node: SchemaNode, type: string): boolean {
  const value = node['@type'];
  return Array.isArray(value) ? value.includes(type) : value === type;
}

/**
 * Apply the graph-wide rules to one page-authored node.
 *
 * Returns null for nodes this module owns, so a stale page-level copy can never
 * introduce a second, conflicting definition of the same entity.
 */
function normalizeNode(node: SchemaNode, canonical: string, locale: Locale): SchemaNode | null {
  // Owned by this module — a page-supplied copy would collide with the @id
  // already in the graph.
  if (hasType(node, 'Organization') || hasType(node, 'WebSite')) return null;

  const { '@context': _context, ...rest } = node;
  const out: SchemaNode = { ...rest };

  if (hasType(node, 'BreadcrumbList')) {
    out['@id'] = `${canonical}#breadcrumb`;

    const items = out.itemListElement;
    if (Array.isArray(items) && items.length > 0) {
      // The final crumb is the page you are already on. A self-linking last
      // item is what Search Console flags as a malformed trail, so its `item`
      // is stripped while the name is kept.
      out.itemListElement = items.map((entry, index) => {
        if (index !== items.length - 1) return entry;
        const { item: _self, ...tail } = entry as SchemaNode;
        return tail;
      });
    }
  }

  if (hasType(node, 'FAQPage')) {
    out['@id'] = `${canonical}#faq`;
    out.inLanguage = locale;
  }

  if (hasType(node, 'WebApplication')) {
    out['@id'] = `${canonical}#app`;
    out.inLanguage = locale;
    out.publisher = { '@id': ORGANIZATION_ID };
  }

  if (hasType(node, 'Article')) {
    out['@id'] = `${canonical}#article`;
    out.inLanguage = locale;
    out.publisher = { '@id': ORGANIZATION_ID };
    out.mainEntityOfPage = { '@id': `${canonical}#webpage` };

    // schema.org allows a single image or a list; Google's Article guidance asks
    // for a list, so a lone string is widened rather than left inconsistent.
    if (out.image !== undefined && !Array.isArray(out.image)) out.image = [out.image];
  }

  if (hasType(node, 'Blog')) {
    out['@id'] = `${canonical}#blog`;
    out.inLanguage = locale;
    out.publisher = { '@id': ORGANIZATION_ID };
  }

  if (hasType(node, 'ItemList')) {
    out['@id'] = `${canonical}#itemlist`;
  }

  return out;
}

export function normalizeNodes(
  nodes: SchemaNode[],
  canonical: string,
  locale: Locale,
): SchemaNode[] {
  return nodes
    .map((node) => normalizeNode(node, canonical, locale))
    .filter((node): node is SchemaNode => node !== null);
}
