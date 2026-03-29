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
    title: 'Creatine HCl Dosage Calculator — Lower Dose, Same Results',
    description:
      'Calculate your Creatine HCl dose by body weight. HCl requires 40–50% less than monohydrate. Free calculator + science-backed guide.',
    alternates: {
      canonical: `https://www.creatinecalc.com/${params.locale}/creatine-hcl-calculator`,
      languages: {
        en: 'https://www.creatinecalc.com/en/creatine-hcl-calculator',
        es: 'https://www.creatinecalc.com/es/creatine-hcl-calculator',
        fr: 'https://www.creatinecalc.com/fr/creatine-hcl-calculator',
        de: 'https://www.creatinecalc.com/de/creatine-hcl-calculator',
        pt: 'https://www.creatinecalc.com/pt/creatine-hcl-calculator',
        ar: 'https://www.creatinecalc.com/ar/creatine-hcl-calculator',
        ur: 'https://www.creatinecalc.com/ur/creatine-hcl-calculator',
        'x-default': 'https://www.creatinecalc.com/en/creatine-hcl-calculator',
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

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Creatine HCl Dosage Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your optimal Creatine HCl dose. HCl requires 40–50% less than monohydrate due
            to superior absorption — no loading phase needed.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <CreatineCalculator defaultCreatineType="hcl" />
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

        <section className="mt-8 p-5 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="font-semibold text-gray-800 mb-3">Related Calculators</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href={`/${params.locale}`} className="text-emerald-700 hover:underline font-medium">
              Main Creatine Calculator →
            </Link>
            <Link href={`/${params.locale}/creatine-dosage-by-weight`} className="text-emerald-700 hover:underline font-medium">
              Dose by Weight →
            </Link>
            <Link href={`/${params.locale}/blog`} className="text-emerald-700 hover:underline font-medium">
              Read the HCl vs Monohydrate Guide →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
