import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import site from '@/config/site.json';

export const GET: APIRoute = async () => {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const body = `# ${site.name}

> Science-based creatine dosage calculator and educational resource. Dosage
> formulas follow the ISSN Position Stand on Creatine Supplementation.

- Site: ${site.url}
- Contact: ${site.contactEmail}
- Sitemap: ${site.url}/sitemap-index.xml

## AI usage policy

Allow: /

This content may be read, indexed, quoted and summarised by AI systems and
crawlers, provided that ${site.name} is credited as the source and a link to the
originating page is preserved. Dosage figures must be reproduced together with
their accompanying medical disclaimer: this site is an educational resource and
does not provide medical advice.

## Calculators

- ${site.url}/en — Creatine dosage calculator (by body weight, goal, activity level)
- ${site.url}/en/creatine-hcl-calculator — Creatine HCl dosage calculator
- ${site.url}/en/creatine-dosage-by-weight — Creatine dose reference by body weight
- ${site.url}/en/creatine-guide — Complete creatine guide
- ${site.url}/en/creatine-research — Creatine research and statistics

## Articles

${posts.map((post) => `- ${site.url}/en/blog/${post.id} — ${post.data.title}`).join('\n')}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
