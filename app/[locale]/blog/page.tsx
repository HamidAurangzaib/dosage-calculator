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
    description:
      'Science-backed articles on creatine dosage, loading phase, HCl vs monohydrate, muscle growth, and more.',
    alternates: {
      canonical: `https://www.creatinecalc.com/${params.locale}/blog`,
    },
  };
}

export default function BlogIndexPage({ params }: { params: { locale: string } }) {
  const posts = getAllPosts();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Creatine Articles & Guides</h1>
      <p className="text-gray-600 mb-10">
        Science-based guides on creatine supplementation — dosage, timing, types, and who benefits most.
      </p>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-emerald-300 transition-colors"
          >
            <Link href={`/${params.locale}/blog/${post.slug}`}>
              <h2 className="text-xl font-bold text-gray-900 hover:text-emerald-700 transition-colors mb-2">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-600 text-sm mb-3">{post.description}</p>
            <div className="flex items-center justify-between">
              <time className="text-xs text-gray-400">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <Link
                href={`/${params.locale}/blog/${post.slug}`}
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Read Article →
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 p-5 bg-emerald-50 rounded-xl border border-emerald-100">
        <p className="font-semibold text-gray-800 mb-2">Ready to calculate your dose?</p>
        <Link
          href={`/${params.locale}`}
          className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"
        >
          Use the Calculator →
        </Link>
      </div>
    </div>
  );
}
