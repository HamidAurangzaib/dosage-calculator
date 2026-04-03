import type { Metadata } from 'next';
import CreatineCalculator from '@/components/Calculator/CreatineCalculator';
import StructuredData from '@/components/SEO/StructuredData';
import AdSlot from '@/components/Layout/AdSlot';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Creatine HCl Dosage Calculator — Exact Dose by Body Weight',
    description: 'Creatine HCl needs 40–50% less than monohydrate. Enter your weight and get your exact HCl dose instantly. Free, science-backed calculator.',
    keywords: ['creatine hcl dosage', 'creatine hcl calculator', 'creatine hydrochloride dose', 'creatine hcl vs monohydrate', 'how much creatine hcl'],
    openGraph: {
      title: 'Creatine HCl Dosage Calculator — Exact Dose by Body Weight',
      description: 'Creatine HCl needs 40–50% less than monohydrate. Enter your weight and get your exact HCl dose instantly. Free, science-backed calculator.',
      url: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-hcl-calculator`,
      type: 'website',
    },
    twitter: {
      title: 'Creatine HCl Dosage Calculator — Exact Dose by Body Weight',
      description: 'Creatine HCl needs 40–50% less than monohydrate. Enter your weight and get your exact HCl dose instantly. Free.',
    },
    alternates: {
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-hcl-calculator`,
      languages: {
        en: 'https://www.creatinedosagecalculator.com/en/creatine-hcl-calculator',
        es: 'https://www.creatinedosagecalculator.com/es/creatine-hcl-calculator',
        fr: 'https://www.creatinedosagecalculator.com/fr/creatine-hcl-calculator',
        de: 'https://www.creatinedosagecalculator.com/de/creatine-hcl-calculator',
        pt: 'https://www.creatinedosagecalculator.com/pt/creatine-hcl-calculator',
        ar: 'https://www.creatinedosagecalculator.com/ar/creatine-hcl-calculator',
        ur: 'https://www.creatinedosagecalculator.com/ur/creatine-hcl-calculator',
        'x-default': 'https://www.creatinedosagecalculator.com/en/creatine-hcl-calculator',
      },
    },
  };
}

const faqItems = [
  {
    question: 'What is the correct Creatine HCl dose?',
    answer:
      'Creatine HCl is typically dosed at 1–2g per day. Because of its superior solubility, your body absorbs it more efficiently than monohydrate, meaning you need roughly 40–50% less to achieve the same muscle saturation.',
  },
  {
    question: 'Does Creatine HCl require a loading phase?',
    answer:
      'No. Due to its high bioavailability, Creatine HCl does not require a loading phase. Simply take 1–2g per day consistently.',
  },
  {
    question: 'Is Creatine HCl better than monohydrate?',
    answer:
      'Creatine HCl is better tolerated by those with sensitive stomachs and requires a smaller dose. However, monohydrate has 30+ years of research behind it. Both are effective.',
  },
  {
    question: 'Can I take Creatine HCl without water?',
    answer:
      'You can, but staying well-hydrated is still important. Drink at least 2.5L of water daily when supplementing with any form of creatine.',
  },
];

export default function HclCalculatorPage({ params }: { params: { locale: string } }) {
  return (
    <>
      <StructuredData locale={params.locale} faqItems={faqItems} includeFAQ includeApp />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Creatine HCl Dosage Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your optimal Creatine HCl dose. HCl requires 40–50% less than monohydrate due
            to superior absorption — no loading phase needed.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <CreatineCalculator defaultCreatineType="hcl" />
          </div>
          <div className="lg:w-72 shrink-0 space-y-5">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="font-bold text-emerald-800 mb-3">🔬 HCl Key Facts</p>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex gap-2"><span>✓</span> Only 1–2g/day needed</li>
                <li className="flex gap-2"><span>✓</span> ~38x more soluble than monohydrate</li>
                <li className="flex gap-2"><span>✓</span> No loading phase required</li>
                <li className="flex gap-2"><span>✓</span> Gentler on digestion</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-5 text-sm">
              <p className="font-bold text-gray-900 mb-3">Compare Types</p>
              <Link href={`/${params.locale}`} className="text-emerald-700 hover:underline font-medium block mb-2">← Back to Main Calculator</Link>
              <Link href={`/${params.locale}/creatine-dosage-by-weight`} className="text-emerald-700 hover:underline font-medium block">Dose by Weight →</Link>
            </div>
          </div>
        </div>

        <AdSlot slot="2345678901" format="auto" />

        {/* Why HCl needs less */}
        <section className="mb-12 prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Does Creatine HCl Require a Lower Dose?
          </h2>
          <p className="text-gray-700 mb-3">
            Creatine HCl (hydrochloride) is formed by binding creatine to hydrochloric acid, which
            dramatically increases its water solubility — approximately{' '}
            <strong>38 times more soluble</strong> than creatine monohydrate. This superior
            solubility translates directly into better absorption in the gastrointestinal tract.
          </p>
          <p className="text-gray-700 mb-3">
            Because more of the HCl form is absorbed per gram, you need a smaller dose to saturate
            your muscles. Where monohydrate requires 3–5g/day for maintenance, HCl typically only
            needs <strong>1–2g/day</strong> — and no loading phase.
          </p>
          <p className="text-gray-700">
            This also means less bloating and fewer GI side effects, making HCl the preferred choice
            for athletes with sensitive stomachs.
          </p>
        </section>

        {/* HCl vs Monohydrate comparison */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Creatine HCl vs Monohydrate: Side-by-Side
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="p-3 text-left">Factor</th>
                  <th className="p-3 text-left">Monohydrate</th>
                  <th className="p-3 text-left">HCl</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Daily dose', '3–5g', '1–2g'],
                  ['Loading phase', 'Optional (20–25g/day × 7 days)', 'Not needed'],
                  ['Research backing', 'Extensive (30+ years)', 'Limited but growing'],
                  ['Solubility', 'Lower', '~38x higher'],
                  ['Cost per serving', 'Lower', 'Higher'],
                  ['Stomach sensitivity', 'Occasional bloating', 'Gentler on digestion'],
                ].map(([factor, mono, hcl], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 font-medium text-gray-700 border-b border-gray-100">{factor}</td>
                    <td className="p-3 text-gray-600 border-b border-gray-100">{mono}</td>
                    <td className="p-3 text-emerald-700 font-medium border-b border-gray-100">{hcl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details key={i} className="bg-white border border-gray-200 rounded-xl p-5 group">
                <summary className="font-semibold text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {item.question}
                  <span className="text-emerald-500 ml-2 text-xl group-open:rotate-45 transition-transform inline-block">+</span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Further Reading */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Further Reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { slug: 'creatine-hcl-vs-monohydrate', title: 'Creatine HCl vs Monohydrate', desc: 'A full comparison of both forms — dosage, absorption, cost, and which suits your goals.' },
              { slug: 'creatine-monohydrate-side-effects', title: 'Creatine Side Effects: Real vs Myths', desc: 'Separating fact from fiction on kidney damage, hair loss, bloating, and more.' },
              { slug: 'best-time-to-take-creatine', title: 'Best Time to Take Creatine', desc: 'Does creatine timing actually matter? The research on pre vs post-workout dosing.' },
            ].map((article) => (
              <Link
                key={article.slug}
                href={`/${params.locale}/blog/${article.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">{article.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{article.desc}</p>
                <span className="inline-block mt-3 text-sm text-emerald-600 font-medium">Read article →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.creatinedosagecalculator.com/${params.locale}` },
              { '@type': 'ListItem', position: 2, name: 'Creatine HCl Calculator', item: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-hcl-calculator` },
            ],
          }),
        }}
      />
    </>
  );
}
