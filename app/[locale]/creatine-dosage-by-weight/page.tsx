import type { Metadata } from 'next';
import CreatineCalculator from '@/components/Calculator/CreatineCalculator';
import StructuredData from '@/components/SEO/StructuredData';
import AdSlot from '@/components/Layout/AdSlot';
import Link from 'next/link';
import { calcMaintenanceDose, calcLoadingDose } from '@/lib/creatineFormulas';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Creatine Dosage by Weight — How Many Grams Per Kg or Lbs?',
    description: 'Not sure how much creatine to take for your weight? Enter your kg or lbs and get your exact daily dose + loading phase in seconds. Free tool.',
    alternates: {
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-dosage-by-weight`,
      languages: {
        en: 'https://www.creatinedosagecalculator.com/en/creatine-dosage-by-weight',
        es: 'https://www.creatinedosagecalculator.com/es/creatine-dosage-by-weight',
        fr: 'https://www.creatinedosagecalculator.com/fr/creatine-dosage-by-weight',
        de: 'https://www.creatinedosagecalculator.com/de/creatine-dosage-by-weight',
        pt: 'https://www.creatinedosagecalculator.com/pt/creatine-dosage-by-weight',
        ar: 'https://www.creatinedosagecalculator.com/ar/creatine-dosage-by-weight',
        ur: 'https://www.creatinedosagecalculator.com/ur/creatine-dosage-by-weight',
        'x-default': 'https://www.creatinedosagecalculator.com/en/creatine-dosage-by-weight',
      },
    },
  };
}

const referenceWeights = [50, 60, 70, 75, 80, 90, 100, 110];

export default function DosageByWeightPage({ params }: { params: { locale: string } }) {
  return (
    <>
      <StructuredData locale={params.locale} includeApp />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Creatine Dosage by Weight Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your body weight is the primary factor in determining your creatine dose. Enter your
            exact weight below for a personalized recommendation in grams.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8 mb-8">
          <CreatineCalculator focusWeight />
        </div>

        <AdSlot slot="3456789012" format="auto" />

        {/* Reference table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Creatine Dose Reference Table by Weight
          </h2>
          <p className="text-gray-600 mb-4">
            Use this quick-reference table to see standard maintenance and loading doses for common
            body weights (assuming Creatine Monohydrate, Muscle Growth goal, Moderate activity).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-emerald-600 text-white">
                  <th className="p-3 text-left">Body Weight (kg)</th>
                  <th className="p-3 text-left">Body Weight (lbs)</th>
                  <th className="p-3 text-left">Maintenance Dose</th>
                  <th className="p-3 text-left">Loading Dose (×7 days)</th>
                </tr>
              </thead>
              <tbody>
                {referenceWeights.map((kg, i) => {
                  const maintenance = calcMaintenanceDose(kg, 'muscle_growth', 'moderate', 'monohydrate');
                  const loading = calcLoadingDose(kg, 'monohydrate');
                  return (
                    <tr key={kg} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-medium text-gray-700 border-b border-gray-100">{kg} kg</td>
                      <td className="p-3 text-gray-600 border-b border-gray-100">{Math.round(kg * 2.2046)} lbs</td>
                      <td className="p-3 text-emerald-700 font-semibold border-b border-gray-100">{maintenance}g/day</td>
                      <td className="p-3 text-gray-600 border-b border-gray-100">{loading}g/day (×4 doses)</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Why weight determines dose */}
        <section className="mb-12 prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Body Weight Determines Your Creatine Dose
          </h2>
          <p className="text-gray-700 mb-3">
            Creatine is stored in muscle tissue as phosphocreatine. The more muscle mass you have —
            which generally correlates with body weight — the larger your total creatine pool needs
            to be for full saturation. This is why the ISSN recommends dosing based on body weight
            rather than a flat dose for everyone.
          </p>
          <p className="text-gray-700 mb-3">
            The maintenance formula is <strong>0.03 grams per kilogram of body weight per day</strong>.
            For a 70kg person, that&apos;s 2.1g — but because the practical minimum effective dose is 3g,
            the calculator floors the recommendation there. For a 100kg person, the formula yields
            3g, adjusted upward by goal and activity multipliers.
          </p>
          <p className="text-gray-700 mb-3">
            The loading formula is even more weight-sensitive:{' '}
            <strong>0.3g/kg/day for 5–7 days</strong>. A 100kg athlete would take 30g/day during
            loading, though the ISSN caps this recommendation at 25g to minimize GI stress.
          </p>
          <p className="text-gray-700">
            Beyond weight, your goal (muscle growth vs general health) and activity level further
            fine-tune the recommendation — which is why our calculator accounts for all three factors.
          </p>
        </section>

        {/* Further Reading */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Further Reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { slug: 'how-much-creatine-per-day-by-weight', title: 'Exact Dosage Tables by Weight', desc: 'Ready-to-use dosage tables from 50kg to 120kg — daily and loading phase amounts.' },
              { slug: 'creatine-loading-phase-guide', title: 'Creatine Loading Phase Guide', desc: 'Should you do a loading phase? What doses, timing, and duration work best.' },
              { slug: 'creatine-dosage-for-beginners', title: 'Creatine Dosage for Beginners', desc: 'New to creatine? Everything you need to know to start correctly and safely.' },
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
              { '@type': 'ListItem', position: 2, name: 'Creatine Dosage by Weight', item: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-dosage-by-weight` },
            ],
          }),
        }}
      />
    </>
  );
}
