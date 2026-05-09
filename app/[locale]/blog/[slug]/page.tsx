import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import StructuredData from '@/components/SEO/StructuredData';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
  const posts = getAllPosts();
  const locales = ['en', 'es', 'fr', 'de', 'pt', 'ar', 'ur'];
  return locales.flatMap((locale) =>
    posts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  const url = `https://www.creatinedosagecalculator.com/${params.locale}/blog/${params.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: ['CreatineCalc Team'],
    },
    twitter: {
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: url,
    },
  };
}

// Topic-based related article mapping — ensures relevance, not just recency
const relatedMap: Record<string, string[]> = {
  'how-much-creatine-per-day': ['creatine-loading-phase-guide', 'creatine-dosage-for-beginners', 'how-much-creatine-per-day-by-weight'],
  'creatine-loading-phase-guide': ['how-much-creatine-per-day', 'best-time-to-take-creatine', 'creatine-dosage-for-beginners'],
  'creatine-for-muscle-growth': ['creatine-loading-phase-guide', 'best-time-to-take-creatine', 'can-you-mix-creatine-with-protein-powder'],
  'creatine-hcl-vs-monohydrate': ['micronized-creatine-vs-monohydrate', 'creatine-monohydrate-side-effects', 'how-much-creatine-per-day-by-weight'],
  'creatine-for-women': ['how-much-creatine-per-day', 'creatine-monohydrate-side-effects', 'how-much-water-on-creatine'],
  'best-time-to-take-creatine': ['can-i-take-creatine-before-bed', 'creatine-loading-phase-guide', 'how-much-creatine-per-day'],
  'creatine-dosage-for-beginners': ['how-much-creatine-per-day', 'creatine-loading-phase-guide', 'how-much-water-on-creatine', 'creatine-monohydrate-side-effects'],
  'creatine-monohydrate-side-effects': ['creatine-hcl-vs-monohydrate', 'micronized-creatine-vs-monohydrate', 'how-much-water-on-creatine'],
  'how-much-creatine-per-day-by-weight': ['how-much-creatine-per-day', 'creatine-loading-phase-guide', 'creatine-dosage-for-beginners'],
  'can-i-take-creatine-before-bed': ['best-time-to-take-creatine', 'how-much-water-on-creatine', 'creatine-dosage-for-beginners'],
  'how-much-water-on-creatine': ['creatine-dosage-for-beginners', 'creatine-monohydrate-side-effects', 'how-much-creatine-per-day'],
  'micronized-creatine-vs-monohydrate': ['creatine-hcl-vs-monohydrate', 'can-you-mix-creatine-with-protein-powder', 'creatine-monohydrate-side-effects'],
  'can-you-mix-creatine-with-protein-powder': ['micronized-creatine-vs-monohydrate', 'best-time-to-take-creatine', 'creatine-for-muscle-growth'],
  'creatine-and-caffeine': ['best-time-to-take-creatine', 'can-you-mix-creatine-with-protein-powder', 'creatine-dosage-for-beginners'],
  'does-creatine-make-you-gain-weight': ['creatine-monohydrate-side-effects', 'how-much-water-on-creatine', 'creatine-for-women'],
  'creatine-for-endurance-athletes': ['best-time-to-take-creatine', 'creatine-loading-phase-guide', 'how-much-water-on-creatine'],
  'creatine-for-brain-cognitive-performance': ['how-long-does-creatine-take-to-work', 'creatine-for-seniors', 'creatine-monohydrate-side-effects'],
  'creatine-vs-whey-protein': ['can-you-mix-creatine-with-protein-powder', 'how-much-creatine-per-day', 'creatine-for-muscle-growth'],
  'how-long-does-creatine-take-to-work': ['creatine-loading-phase-guide', 'creatine-dosage-for-beginners', 'how-much-creatine-per-day'],
  'creatine-for-seniors': ['creatine-for-brain-cognitive-performance', 'creatine-for-women', 'creatine-monohydrate-side-effects'],
};

export default function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const allPosts = getAllPosts();

  // Sidebar: all posts except current, up to 5
  const sidebarPosts = allPosts.filter((p) => p.slug !== params.slug).slice(0, 5);

  // Related articles: topic-mapped, fall back to recent
  const relatedSlugs = relatedMap[params.slug] ?? [];
  const relatedPosts = relatedSlugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 4) as typeof allPosts;

  const faqSchema = post.faq && post.faq.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: post.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  } : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: 'CreatineCalc', url: 'https://www.creatinedosagecalculator.com' },
    publisher: { '@type': 'Organization', name: 'CreatineCalc', url: 'https://www.creatinedosagecalculator.com' },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.creatinedosagecalculator.com/${params.locale}/blog/${params.slug}` },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.creatinedosagecalculator.com/${params.locale}` },
      { '@type': 'ListItem', position: 2, name: 'Articles', item: `https://www.creatinedosagecalculator.com/${params.locale}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.creatinedosagecalculator.com/${params.locale}/blog/${params.slug}` },
    ],
  };

  return (
    <>
      <StructuredData locale={params.locale} />

      {/* Article + BreadcrumbList + FAQ schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href={`/${params.locale}`} className="hover:text-emerald-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${params.locale}/blog`} className="hover:text-emerald-600 transition-colors">Articles</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-xs">{post.title}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content */}
          <main className="flex-1 min-w-0">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed mb-4">{post.description}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 border-b border-gray-200 pb-4">
                <time dateTime={post.date}>
                  Published {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                {post.lastUpdated && post.lastUpdated !== post.date && (
                  <>
                    <span>·</span>
                    <span>Updated {new Date(post.lastUpdated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </>
                )}
                <span>·</span>
                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
                {post.reviewedBy && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                      Verified against {post.reviewedBy}
                    </span>
                  </>
                )}
              </div>
            </header>

            {/* E-E-A-T: Author / Expertise box */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-8 flex gap-4 items-start">
              <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shrink-0">CC</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Written by the CreatineCalc Research Team</p>
                <p className="text-gray-600 text-sm mt-0.5">
                  Our content is based on peer-reviewed sports nutrition research and the{' '}
                  <strong>ISSN Position Stand on Creatine Supplementation</strong> — the gold standard reference in the field.
                  Formulas and dosage guidance are cross-referenced against primary literature before publication.
                </p>
              </div>
            </div>

            {/* YMYL Disclaimer — above-the-fold for health content */}
            <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-xl p-4 mb-8 text-sm text-amber-800">
              <p className="font-semibold mb-1">Important — Health Disclaimer</p>
              <p>This article is for <strong>educational purposes only</strong> and does not constitute medical advice. Creatine supplementation affects individuals differently. Consult a qualified healthcare professional before starting any supplement, especially if you have pre-existing health conditions, kidney concerns, or are pregnant.</p>
            </div>

            {/* Article body — strip leading H1 (already shown in header) */}
            <article className="prose prose-lg prose-gray max-w-none mt-8
              prose-h1:text-3xl prose-h1:font-extrabold prose-h1:text-gray-900
              prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-900 prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-800
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-5
              prose-li:text-gray-700 prose-li:leading-relaxed
              prose-strong:text-gray-900
              prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
              prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50 prose-blockquote:rounded-lg prose-blockquote:not-italic
              prose-table:text-sm
              prose-thead:bg-gray-100
              prose-th:font-semibold prose-th:text-gray-700
              prose-td:text-gray-600
              prose-hr:border-gray-200
            ">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content.replace(/^#\s+.+\n/, '')}
              </ReactMarkdown>
            </article>

            {/* FAQ Section — renders when faq frontmatter present; also outputs FAQPage schema */}
            {post.faq && post.faq.length > 0 && (
              <section className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {post.faq.map((item, i) => (
                    <details key={i} className="group bg-white border border-gray-200 rounded-xl overflow-hidden">
                      <summary className="flex justify-between items-center cursor-pointer px-5 py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors list-none">
                        <span>{item.question}</span>
                        <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-5 pt-2 text-gray-700 leading-relaxed text-sm border-t border-gray-100">
                        {item.answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {/* CTA — calculator */}
            <div className="mt-10 p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 text-center">
              <p className="font-extrabold text-gray-900 mb-2 text-2xl">
                Calculate Your Exact Creatine Dose
              </p>
              <p className="text-gray-600 mb-5 max-w-md mx-auto">
                Free calculator — personalized by body weight, goal, and activity level. Based on ISSN guidelines.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={`/${params.locale}`}
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition-colors text-lg shadow-sm"
                >
                  Use the Free Creatine Dosage Calculator →
                </Link>
                <Link
                  href={`/${params.locale}/creatine-hcl-calculator`}
                  className="inline-block bg-white hover:bg-gray-50 text-emerald-700 font-bold px-6 py-3 rounded-xl transition-colors text-base shadow-sm border border-emerald-200"
                >
                  Creatine HCl Calculator →
                </Link>
              </div>
            </div>

            {/* Scientific References — E-E-A-T / YMYL trust signal */}
            {post.references && post.references.length > 0 && (
              <section className="mt-12 border-t border-gray-200 pt-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                  Scientific References
                </h2>
                <p className="text-sm text-gray-500 mb-4">All claims in this article are supported by peer-reviewed research. Key sources:</p>
                <ol className="space-y-2">
                  {post.references.map((ref, i) => (
                    <li key={i} className="text-sm text-gray-600 flex gap-3">
                      <span className="text-emerald-600 font-bold shrink-0">[{i + 1}]</span>
                      <span>{ref}</span>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {relatedPosts.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/${params.locale}/blog/${related.slug}`}
                      className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all"
                    >
                      <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors text-base">
                        {related.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {related.description}
                      </p>
                      <span className="inline-block mt-3 text-sm text-emerald-600 font-medium">
                        Read article →
                      </span>
                    </Link>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-4 text-sm">
                  <Link href={`/${params.locale}/blog`} className="text-emerald-600 hover:text-emerald-700 font-semibold">
                    ← View all creatine articles
                  </Link>
                  <Link href={`/${params.locale}/creatine-guide`} className="text-emerald-600 hover:text-emerald-700 font-semibold">
                    Complete Creatine Guide →
                  </Link>
                </div>
              </section>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:w-72 shrink-0 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-5 sticky top-20">
              <p className="font-bold text-gray-900 mb-4 text-base">Free Calculators</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href={`/${params.locale}`} className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium">
                    <span>💊</span> Creatine Dosage Calculator
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/creatine-hcl-calculator`} className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium">
                    <span>🔬</span> Creatine HCl Calculator
                  </Link>
                </li>
                <li>
                  <Link href={`/${params.locale}/creatine-dosage-by-weight`} className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-medium">
                    <span>⚖️</span> Dose by Body Weight
                  </Link>
                </li>
              </ul>

              <hr className="my-4 border-gray-100" />

              <p className="font-bold text-gray-900 mb-3 text-base">More Articles</p>
              <ul className="space-y-3">
                {sidebarPosts.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/${params.locale}/blog/${p.slug}`}
                      className="text-sm text-gray-600 hover:text-emerald-700 leading-snug block transition-colors"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-5 space-y-2">
                <Link
                  href={`/${params.locale}/blog`}
                  className="block text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  ← All Articles
                </Link>
                <Link
                  href={`/${params.locale}/creatine-guide`}
                  className="block text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Complete Creatine Guide →
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
