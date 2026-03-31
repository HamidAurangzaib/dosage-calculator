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

        <section className="mt-8 p-5 bg-emerald-50 rounded-xl border border-emerald-100">
          <p className="font-semibold text-gray-800 mb-3">Explore More</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href={`/${params.locale}`} className="text-emerald-700 hover:underline font-medium">
              Main Creatine Calculator →
            </Link>
            <Link href={`/${params.locale}/creatine-hcl-calculator`} className="text-emerald-700 hover:underline font-medium">
              Creatine HCl Calculator →
            </Link>
            <Link href={`/${params.locale}/blog`} className="text-emerald-700 hover:underline font-medium">
              Creatine Articles →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
