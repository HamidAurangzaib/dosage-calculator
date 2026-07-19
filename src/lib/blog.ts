/**
 * Blog constants shared between the listing route and the human sitemap.
 *
 * This lives in its own module rather than in the page frontmatter because
 * Astro hoists `getStaticPaths` above the component scope — a const declared
 * alongside it in the same .astro file is not in scope when it runs.
 */
export const BLOG_PAGE_SIZE = 12;
