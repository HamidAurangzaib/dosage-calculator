import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import CreatineCalculator from '@/components/Calculator/CreatineCalculator';
import StructuredData from '@/components/SEO/StructuredData';
import AdSlot from '@/components/Layout/AdSlot';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta' });
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}`,
      languages: {
        en: 'https://www.creatinedosagecalculator.com/en',
        es: 'https://www.creatinedosagecalculator.com/es',
        fr: 'https://www.creatinedosagecalculator.com/fr',
        de: 'https://www.creatinedosagecalculator.com/de',
        pt: 'https://www.creatinedosagecalculator.com/pt',
        ar: 'https://www.creatinedosagecalculator.com/ar',
        ur: 'https://www.creatinedosagecalculator.com/ur',
        'x-default': 'https://www.creatinedosagecalculator.com/en',
      },
    },
  };
}

const faqItems = [
  {
    question: 'How much creatine should I take per day?',
    answer:
      'Most adults benefit from 3–5g of creatine monohydrate per day during the maintenance phase. For a weight-based dose, multiply your weight in kg by 0.03. For example, a 75kg person should take approximately 2.25–3g/day, but the standard recommendation is 3–5g regardless.',
  },
  {
    question: 'Do I need a loading phase?',
    answer:
      'No. The loading phase (20–25g/day for 5–7 days) saturates muscles faster, but taking 3–5g/day without loading reaches the same saturation in 3–4 weeks. Choose loading if you want faster results; skip it if you want to avoid temporary water weight.',
  },
  {
    question: 'How is creatine HCl dosed differently?',
    answer:
      'Creatine HCl has higher solubility, so the body absorbs it more efficiently. As a result, you typically need only 1–2g of HCl per day compared to 3–5g of monohydrate. No loading phase is required with HCl.',
  },
  {
    question: 'How much water should I drink when taking creatine?',
    answer:
      'Drink at least 2.5–3 liters of water per day when taking creatine. Creatine draws water into muscle cells, so staying well hydrated prevents dehydration and reduces the risk of muscle cramps.',
  },
  {
    question: 'When is the best time to take creatine?',
    answer:
      'Research shows post-workout creatine intake may offer a slight advantage for muscle gains. However, consistency matters more than timing. Take your daily dose at whatever time you are most likely to remember it — with a meal is ideal.',
  },
  {
    question: 'Is creatine safe for long-term use?',
    answer:
      'Yes. Creatine monohydrate is one of the most researched supplements in sports nutrition. Studies spanning multiple years show no adverse effects in healthy adults at recommended doses of 3–5g/day. Always consult a doctor if you have kidney concerns.',
  },
  {
    question: 'How much creatine should I take for muscle growth?',
    answer:
      'For muscle growth, the ISSN recommends a maintenance dose of 3–5g/day combined with resistance training. Optionally, begin with a loading phase of 0.3g per kg of body weight per day for 5–7 days to saturate muscles faster.',
  },
];

export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <>
      <StructuredData locale={params.locale} faqItems={faqItems} includeFAQ includeApp />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Creatine Dosage Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get your personalized daily creatine dose based on body weight, goal, and activity level
            — backed by ISSN science.
          </p>
        </div>

        {/* Calculator — two column on desktop */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <CreatineCalculator />
          </div>

          {/* Side info panel — desktop only */}
          <div className="lg:w-80 shrink-0 space-y-5">
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="font-bold text-emerald-800 mb-3 text-base">📊 ISSN-Based Formulas</p>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li className="flex gap-2"><span>✓</span> Maintenance: 0.03 g/kg/day</li>
                <li className="flex gap-2"><span>✓</span> Loading: 0.3 g/kg/day × 7 days</li>
                <li className="flex gap-2"><span>✓</span> HCl: 1–2g/day (no loading)</li>
                <li className="flex gap-2"><span>✓</span> Water: 2.5–3L/day minimum</li>
              </ul>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <p className="font-bold text-gray-900 mb-3 text-base">🔬 More Calculators</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href={`/${params.locale}/creatine-hcl-calculator`} className="text-emerald-700 hover:underline font-medium">
                    Creatine HCl Dosage Calculator →
                  </Link>
                  <p className="text-gray-500 text-xs mt-0.5">Lower dose, better solubility</p>
                </li>
                <li>
                  <Link href={`/${params.locale}/creatine-dosage-by-weight`} className="text-emerald-700 hover:underline font-medium">
                    Dose by Body Weight →
                  </Link>
                  <p className="text-gray-500 text-xs mt-0.5">Quick reference for all weights</p>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-800">
              <p className="font-semibold mb-1">⚠️ Disclaimer</p>
              <p>This calculator is for informational purposes only. Consult a healthcare professional before starting any supplement.</p>
            </div>
          </div>
        </div>

        {/* Ad slot after calculator */}
        <AdSlot slot="1234567890" format="auto" />

        {/* How to use */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use This Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '1',
                title: 'Enter Your Weight',
                desc: 'Input your body weight in kg or lbs. The calculator uses the ISSN-recommended 0.03 g/kg formula.',
              },
              {
                step: '2',
                title: 'Select Your Goal & Activity',
                desc: 'Choose your fitness goal and activity level. These factors adjust your optimal dose.',
              },
              {
                step: '3',
                title: 'Get Your Plan',
                desc: 'Receive your exact daily dose, optional loading schedule, and hydration recommendations.',
              },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What is the right dose */}
        <section className="mb-12 prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What Is the Right Creatine Dose?
          </h2>
          <p className="text-gray-700 mb-3">
            The International Society of Sports Nutrition (ISSN) recommends a maintenance dose of
            approximately <strong>0.03 grams per kilogram of body weight per day</strong>, which
            translates to 3–5g for most adults. This is the most evidence-backed approach to
            creatine supplementation.
          </p>
          <p className="text-gray-700 mb-3">
            Your dose isn&apos;t one-size-fits-all. Heavier individuals with higher muscle mass may
            benefit from the upper end of the range, while lighter individuals may only need 3g/day.
            Elite athletes and those pursuing rapid muscle growth can adjust upward based on activity
            multipliers.
          </p>
          <p className="text-gray-700 mb-3">
            Creatine HCl is a notable exception — due to its superior solubility and bioavailability,
            an effective dose is typically only 1–2g/day. No loading phase is required.
          </p>
          <p className="text-gray-700">
            Always pair creatine with adequate hydration. Because creatine pulls water into muscle
            cells, drinking at least 2.5–3 liters of water daily helps prevent cramps and supports
            optimal muscle function.
          </p>
        </section>

        {/* Loading vs No Loading */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Loading Phase vs. No Loading Phase
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="p-3 text-left">Factor</th>
                  <th className="p-3 text-left">With Loading</th>
                  <th className="p-3 text-left">Without Loading</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Protocol', '0.3g/kg/day × 7 days, then 0.03g/kg/day', '0.03g/kg/day from day 1'],
                  ['Time to full saturation', '5–7 days', '3–4 weeks'],
                  ['Daily dose during protocol', '20–25g (split × 4)', '3–5g (once daily)'],
                  ['Water retention risk', 'Higher initially', 'Minimal'],
                  ['Long-term result', 'Same as no-load', 'Same as load'],
                  ['Best for', 'Faster results before competition', 'Gradual, comfortable approach'],
                ].map(([factor, loading, noLoading], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-3 font-medium text-gray-700 border-b border-gray-100">{factor}</td>
                    <td className="p-3 text-gray-600 border-b border-gray-100">{loading}</td>
                    <td className="p-3 text-gray-600 border-b border-gray-100">{noLoading}</td>
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
                  <span className="text-emerald-500 ml-2 text-xl group-open:rotate-45 transition-transform inline-block">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-gray-600 text-sm leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom ad */}
        <AdSlot slot="0987654321" format="rectangle" />

        {/* Further Reading */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Further Reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                slug: 'creatine-dosage-for-beginners',
                title: 'Creatine Dosage for Beginners',
                desc: 'New to creatine? Learn how much to start with and whether you need a loading phase.',
              },
              {
                slug: 'best-time-to-take-creatine',
                title: 'Best Time to Take Creatine',
                desc: 'Before or after your workout? The research on creatine timing explained simply.',
              },
              {
                slug: 'creatine-loading-phase-guide',
                title: 'Creatine Loading Phase Guide',
                desc: 'What a loading phase is, whether you need one, and how to do it correctly.',
              },
              {
                slug: 'creatine-hcl-vs-monohydrate',
                title: 'Creatine HCl vs Monohydrate',
                desc: 'Which form is better for your goals? A side-by-side comparison.',
              },
              {
                slug: 'creatine-monohydrate-side-effects',
                title: 'Creatine Side Effects: Real vs Myths',
                desc: 'Kidney damage, hair loss, bloating — what the research actually says.',
              },
              {
                slug: 'how-much-creatine-per-day-by-weight',
                title: 'Exact Creatine Dosage by Weight',
                desc: 'Ready-to-use dosage tables for every body weight from 50kg to 120kg.',
              },
            ].map((article) => (
              <Link
                key={article.slug}
                href={`/${params.locale}/blog/${article.slug}`}
                className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all"
              >
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors text-base">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{article.desc}</p>
                <span className="inline-block mt-3 text-sm text-emerald-600 font-medium">
                  Read article →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <Link href={`/${params.locale}/blog`} className="text-emerald-600 hover:text-emerald-700 font-semibold">
              View all creatine articles →
            </Link>
            <Link href={`/${params.locale}/creatine-guide`} className="text-emerald-600 hover:text-emerald-700 font-semibold">
              Complete Creatine Guide →
            </Link>
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
              { '@type': 'ListItem', position: 1, name: 'Creatine Dosage Calculator', item: `https://www.creatinedosagecalculator.com/${params.locale}` },
            ],
          }),
        }}
      />
    </>
  );
}
