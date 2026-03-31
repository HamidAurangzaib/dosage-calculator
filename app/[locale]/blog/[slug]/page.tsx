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
  return {
    title: `${post.title} — CreatineCalc`,
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}/blog/${params.slug}`,
    },
  };
}

// Topic-based related article mapping — ensures relevance, not just recency
const relatedMap: Record<string, string[]> = {
  'how-much-creatine-per-day': ['creatine-loading-phase-guide', 'creatine-dosage-for-beginners', 'how-much-creatine-per-day-by-weight'],
  'creatine-loading-phase-guide': ['how-much-creatine-per-day', 'best-time-to-take-creatine', 'creatine-dosage-for-beginners'],
  'creatine-for-muscle-growth': ['creatine-loading-phase-guide', 'best-time-to-take-creatine', 'creatine-dosage-for-beginners'],
  'creatine-hcl-vs-monohydrate': ['creatine-monohydrate-side-effects', 'how-much-creatine-per-day', 'how-much-creatine-per-day-by-weight'],
  'creatine-for-women': ['how-much-creatine-per-day', 'creatine-monohydrate-side-effects', 'creatine-dosage-for-beginners'],
  'best-time-to-take-creatine': ['creatine-loading-phase-guide', 'how-much-creatine-per-day', 'creatine-dosage-for-beginners'],
  'creatine-dosage-for-beginners': ['how-much-creatine-per-day', 'creatine-loading-phase-guide', 'best-time-to-take-creatine', 'creatine-monohydrate-side-effects'],
  'creatine-monohydrate-side-effects': ['creatine-hcl-vs-monohydrate', 'creatine-dosage-for-beginners', 'how-much-creatine-per-day'],
  'how-much-creatine-per-day-by-weight': ['how-much-creatine-per-day', 'creatine-loading-phase-guide', 'creatine-dosage-for-beginners'],
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

      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

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
              <div className="flex items-center gap-4 text-sm text-gray-400 border-b border-gray-200 pb-4">
                <time>
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
              </div>
            </header>

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
