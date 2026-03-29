import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'About CreatineCalc — Science-Based Creatine Dosage',
    description:
      'Learn about CreatineCalc, our mission to provide accurate creatine dosage information based on ISSN guidelines, and why we built this free tool.',
    alternates: {
      canonical: `https://www.creatinecalc.com/${params.locale}/about`,
    },
  };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">About CreatineCalc</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <p>
          CreatineCalc was built for one purpose: to give athletes, gym-goers, and fitness
          enthusiasts an accurate, science-based way to calculate their creatine dosage.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">Our Formula</h2>
        <p>
          Our calculator formulas are based on the{' '}
          <strong>
            International Society of Sports Nutrition (ISSN) position stand on creatine
            supplementation
          </strong>
          , one of the most cited documents in sports nutrition science. We use the established{' '}
          <strong>0.3 g/kg/day loading formula</strong> and{' '}
          <strong>0.03 g/kg/day maintenance formula</strong>, then adjust for individual goals and
          activity levels.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">No Conflicts of Interest</h2>
        <p>
          We do not sell supplements. We do not receive commissions from supplement brands. Our only
          goal is accurate, unbiased information. All formulas used in this calculator are publicly
          documented in peer-reviewed sports nutrition research.
        </p>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">What We Cover</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <strong>Creatine Monohydrate</strong> — the gold-standard, most researched form
          </li>
          <li>
            <strong>Creatine HCl</strong> — smaller dose, better solubility, no loading needed
          </li>
          <li>
            <strong>Micronized Creatine</strong> — same formula as monohydrate, finer particle size
          </li>
          <li>Loading phase vs. no-load protocols</li>
          <li>Goal-based and activity-level adjustments</li>
          <li>Hydration recommendations</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900 mt-8">Multilingual Access</h2>
        <p>
          CreatineCalc is available in English, Spanish, French, German, Portuguese, Arabic, and
          Urdu — because accurate health information should be accessible to everyone, regardless of
          language.
        </p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-8">
          <p className="font-semibold text-amber-800 mb-1">Medical Disclaimer</p>
          <p className="text-amber-700 text-sm">
            Nothing on this website constitutes medical advice. Always consult a qualified
            healthcare professional before starting any supplement program, particularly if you have
            pre-existing health conditions.
          </p>
        </div>
      </div>

      <div className="mt-10 flex gap-4 flex-wrap">
        <Link
          href={`/${params.locale}`}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Use the Calculator
        </Link>
        <Link
          href={`/${params.locale}/contact`}
          className="border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}
