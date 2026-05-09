import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Complete Creatine Guide — Dosage, Loading, Types & Safety',
    description:
      'Everything you need to know about creatine: how much to take, loading phase, HCl vs monohydrate, side effects, timing, and dosage by weight. Free calculator included.',
    alternates: {
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-guide`,
      languages: {
        en: 'https://www.creatinedosagecalculator.com/en/creatine-guide',
        es: 'https://www.creatinedosagecalculator.com/es/creatine-guide',
        fr: 'https://www.creatinedosagecalculator.com/fr/creatine-guide',
        de: 'https://www.creatinedosagecalculator.com/de/creatine-guide',
        pt: 'https://www.creatinedosagecalculator.com/pt/creatine-guide',
        ar: 'https://www.creatinedosagecalculator.com/ar/creatine-guide',
        ur: 'https://www.creatinedosagecalculator.com/ur/creatine-guide',
        'x-default': 'https://www.creatinedosagecalculator.com/en/creatine-guide',
      },
    },
  };
}

const articles = [
  {
    slug: 'creatine-dosage-for-beginners',
    title: 'Creatine Dosage for Beginners',
    description: 'New to creatine? Learn exactly how much to start with, whether you need a loading phase, and how to avoid common mistakes.',
    category: 'Getting Started',
  },
  {
    slug: 'how-much-creatine-per-day',
    title: 'How Much Creatine Per Day?',
    description: 'The ISSN-backed daily creatine dose explained — maintenance, loading, and how your body weight determines the right amount.',
    category: 'Getting Started',
  },
  {
    slug: 'how-much-creatine-per-day-by-weight',
    title: 'Exact Creatine Dosage by Weight (kg & lbs)',
    description: 'Ready-to-use dosage tables from 50kg to 120kg. Find your exact daily and loading phase dose without doing the math.',
    category: 'Getting Started',
  },
  {
    slug: 'creatine-loading-phase-guide',
    title: 'Creatine Loading Phase Guide',
    description: 'Should you do a loading phase? What doses, timing, and duration actually work — based on the latest research.',
    category: 'Protocols',
  },
  {
    slug: 'best-time-to-take-creatine',
    title: 'Best Time to Take Creatine',
    description: 'Before or after your workout? Does timing actually matter? We break down the science so you can stop overthinking it.',
    category: 'Protocols',
  },
  {
    slug: 'creatine-hcl-vs-monohydrate',
    title: 'Creatine HCl vs Monohydrate',
    description: 'Which form is better? A direct comparison of dosage, absorption, cost, and which type suits your goals.',
    category: 'Types',
  },
  {
    slug: 'creatine-monohydrate-side-effects',
    title: 'Creatine Side Effects: Real vs Myths',
    description: 'Kidney damage, hair loss, dehydration — separating the facts from the myths with real research.',
    category: 'Safety',
  },
  {
    slug: 'creatine-for-muscle-growth',
    title: 'Creatine for Muscle Growth',
    description: 'How creatine increases strength and muscle mass, what results to expect, and how to stack it with your training.',
    category: 'Goals',
  },
  {
    slug: 'creatine-for-women',
    title: 'Creatine for Women',
    description: 'Is creatine effective and safe for women? Dosage differences, benefits, and what the research shows.',
    category: 'Goals',
  },
  {
    slug: 'can-i-take-creatine-before-bed',
    title: 'Can I Take Creatine Before Bed?',
    description: 'Does nighttime creatine dosing affect sleep, recovery, or results? The science on before-bed timing explained.',
    category: 'Protocols',
  },
  {
    slug: 'how-much-water-on-creatine',
    title: 'How Much Water Should You Drink on Creatine?',
    description: 'Exact daily water targets by body weight, why hydration matters for creatine, and signs you\'re not drinking enough.',
    category: 'Getting Started',
  },
  {
    slug: 'micronized-creatine-vs-monohydrate',
    title: 'Micronized Creatine vs Monohydrate',
    description: 'Same molecule, smaller particles. What actually differs between micronized and regular creatine, and which to buy.',
    category: 'Types',
  },
  {
    slug: 'can-you-mix-creatine-with-protein-powder',
    title: 'Can You Mix Creatine With Protein Powder?',
    description: 'Yes — and it may actually improve creatine uptake. How to combine them, best timing, and what to avoid.',
    category: 'Protocols',
  },
  {
    slug: 'creatine-and-caffeine',
    title: 'Creatine and Caffeine: Can You Take Them Together?',
    description: 'Does caffeine cancel out creatine? The research says no. How to safely stack creatine with caffeine and pre-workout.',
    category: 'Protocols',
  },
  {
    slug: 'does-creatine-make-you-gain-weight',
    title: 'Does Creatine Make You Gain Weight?',
    description: 'Creatine causes water weight gain — but not fat. Learn exactly how much, how fast, and what it means for your physique.',
    category: 'Safety',
  },
  {
    slug: 'creatine-for-endurance-athletes',
    title: 'Creatine for Endurance Athletes',
    description: 'Does creatine help runners and cyclists? The evidence for endurance sports is more nuanced — and more positive — than most think.',
    category: 'Goals',
  },
  {
    slug: 'creatine-for-brain-cognitive-performance',
    title: 'Creatine for Brain Health & Cognitive Performance',
    description: 'New research shows creatine improves memory, processing speed, and resilience to mental fatigue — even in non-athletes.',
    category: 'Goals',
  },
  {
    slug: 'creatine-vs-whey-protein',
    title: 'Creatine vs Whey Protein: Do You Need Both?',
    description: 'Creatine and whey do completely different jobs. Most people benefit from both — when to prioritize each, and how to combine them.',
    category: 'Getting Started',
  },
  {
    slug: 'how-long-does-creatine-take-to-work',
    title: 'How Long Does Creatine Take to Work?',
    description: 'Creatine starts working immediately, but visible results take 1–4 weeks. A day-by-day timeline of what to expect.',
    category: 'Getting Started',
  },
  {
    slug: 'creatine-for-seniors',
    title: 'Creatine for Seniors: Benefits, Dosage & Safety After 50',
    description: 'For adults over 50, creatine preserves muscle, supports brain function, and may reduce fall risk. The dosage and safety details.',
    category: 'Goals',
  },
];

const categories = ['Getting Started', 'Protocols', 'Types', 'Safety', 'Goals'];

export default function CreatineGuidePage({ params }: { params: { locale: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href={`/${params.locale}`} className="hover:text-emerald-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-700">Complete Creatine Guide</span>
      </nav>

      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.creatinedosagecalculator.com/${params.locale}` },
              { '@type': 'ListItem', position: 2, name: 'Complete Creatine Guide', item: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-guide` },
            ],
          }),
        }}
      />

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Complete Creatine Guide
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          Everything you need to know about creatine — from your first dose to advanced protocols.
          All articles are based on peer-reviewed research and ISSN guidelines.
        </p>
      </div>

      {/* Calculator CTA banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 md:p-8 mb-12 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Not sure how much creatine to take?</h2>
            <p className="text-emerald-100 max-w-xl">
              Use our free creatine dosage calculator — personalized by your body weight, goal, and activity level.
              Results in seconds, backed by ISSN science.
            </p>
          </div>
          <Link
            href={`/${params.locale}`}
            className="inline-block bg-white text-emerald-700 font-bold px-6 py-3 rounded-xl hover:bg-emerald-50 transition-colors text-center shrink-0 shadow-sm"
          >
            Calculate My Dose →
          </Link>
        </div>
      </div>

      {/* Articles by category */}
      {categories.map((category) => {
        const categoryArticles = articles.filter((a) => a.category === category);
        return (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categoryArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/${params.locale}/blog/${article.slug}`}
                  className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all"
                >
                  <span className="inline-block text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mb-3">
                    {article.category}
                  </span>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{article.description}</p>
                  <span className="inline-block mt-3 text-sm text-emerald-600 font-medium">
                    Read article →
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {/* Calculators section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
          Free Creatine Calculators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              href: `/${params.locale}`,
              title: 'Creatine Dosage Calculator',
              description: 'Full personalized calculator — enter your weight, goal, activity level, and creatine type for an exact daily dose.',
            },
            {
              href: `/${params.locale}/creatine-hcl-calculator`,
              title: 'Creatine HCl Dosage Calculator',
              description: 'Specialized calculator for Creatine HCl — requires 40–50% less than monohydrate, no loading phase needed.',
            },
            {
              href: `/${params.locale}/creatine-dosage-by-weight`,
              title: 'Dose by Body Weight',
              description: 'Quick dose lookup by your exact weight in kg or lbs. Includes loading phase and maintenance amounts.',
            },
          ].map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group bg-emerald-50 border border-emerald-100 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {calc.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{calc.description}</p>
              <span className="inline-block mt-3 text-sm text-emerald-600 font-medium">
                Use calculator →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
