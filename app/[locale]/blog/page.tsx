import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Creatine Articles & Guides — CreatineCalc',
    description: 'Science-backed articles on creatine dosage, loading phase, HCl vs monohydrate, muscle growth, and more.',
    alternates: {
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}/blog`,
    },
  };
}

export default function BlogIndexPage({ params }: { params: { locale: string } }) {
  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Creatine Articles & Guides</h1>
        <p className="text-lg text-gray-600">
          Science-based guides on creatine supplementation — dosage, timing, types, and who benefits most.
        </p>
      </div>

      {/* Featured article */}
      {featured && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-8 mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-3 block">Featured</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-3 leading-tight">
            <Link href={`/${params.locale}/blog/${featured.slug}`} className="hover:text-emerald-700 transition-colors">
              {featured.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-5 max-w-2xl leading-relaxed">{featured.description}</p>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <time className="text-sm text-gray-400">
              {new Date(featured.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </time>
            <Link
              href={`/${params.locale}/blog/${featured.slug}`}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
            >
              Read Article →
            </Link>
          </div>
        </div>
      )}

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {rest.map((post) => (
          <article
            key={post.slug}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-sm transition-all flex flex-col"
          >
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug">
                <Link href={`/${params.locale}/blog/${post.slug}`} className="hover:text-emerald-700 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{post.description}</p>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
              <time className="text-xs text-gray-400">
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </time>
              <Link
                href={`/${params.locale}/blog/${post.slug}`}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Read →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center">
        <p className="font-bold text-gray-900 text-xl mb-2">Ready to find your ideal dose?</p>
        <p className="text-gray-600 mb-5">Use our free calculator — takes 30 seconds.</p>
        <Link
          href={`/${params.locale}`}
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3 rounded-xl transition-colors"
        >
          Use the Calculator →
        </Link>
      </div>
    </div>
  );
}
