import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import StructuredData from '@/components/SEO/StructuredData';
import AdSlot from '@/components/Layout/AdSlot';
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
      canonical: `https://www.creatinecalc.com/${params.locale}/blog/${params.slug}`,
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <StructuredData locale={params.locale} />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href={`/${params.locale}`} className="hover:text-emerald-600">
            Home
          </Link>{' '}
          /{' '}
          <Link href={`/${params.locale}/blog`} className="hover:text-emerald-600">
            Articles
          </Link>{' '}
          / <span className="text-gray-700">{post.title}</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">{post.title}</h1>
          <p className="text-gray-600 text-lg mb-3">{post.description}</p>
          <time className="text-sm text-gray-400">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </header>

        {/* Ad after intro */}
        <AdSlot slot="4567890123" format="rectangle" />

        <article className="prose prose-gray prose-lg max-w-none mt-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
        </article>

        {/* Bottom ad */}
        <AdSlot slot="5678901234" format="auto" className="mt-8" />

        {/* CTA */}
        <div className="mt-10 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
          <p className="font-bold text-gray-900 mb-2 text-lg">
            Ready to calculate your exact creatine dose?
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Use our free calculator — personalized by weight, goal, and activity level.
          </p>
          <Link
            href={`/${params.locale}`}
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Calculate My Dose →
          </Link>
        </div>

        {/* Related links */}
        <div className="mt-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
          <p className="font-semibold text-gray-800 mb-3">More Articles</p>
          <Link
            href={`/${params.locale}/blog`}
            className="text-emerald-700 hover:underline text-sm font-medium"
          >
            ← Back to All Articles
          </Link>
        </div>
      </div>
    </>
  );
}
