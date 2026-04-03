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
      'Learn about CreatineCalc, our editorial standards, scientific methodology, and commitment to unbiased, ISSN-backed creatine dosage information.',
    openGraph: {
      title: 'About CreatineCalc — Science-Based Creatine Dosage',
      description: 'Learn about CreatineCalc — our mission, editorial standards, and commitment to unbiased, ISSN-backed creatine dosage information.',
      url: `https://www.creatinedosagecalculator.com/${params.locale}/about`,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}/about`,
    },
  };
}

export default function AboutPage({ params }: { params: { locale: string } }) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* BreadcrumbList schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.creatinedosagecalculator.com/${params.locale}` },
              { '@type': 'ListItem', position: 2, name: 'About', item: `https://www.creatinedosagecalculator.com/${params.locale}/about` },
            ],
          }),
        }}
      />

      <h1 className="text-4xl font-extrabold text-gray-900 mb-3">About CreatineCalc</h1>
      <p className="text-lg text-gray-600 mb-10 leading-relaxed">
        CreatineCalc is an independent, free tool built for athletes, gym-goers, and fitness
        enthusiasts who want accurate, science-based creatine dosage guidance — without being sold to.
      </p>

      {/* Mission */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-700 mb-3 leading-relaxed">
          Supplement dosage information online is often vague, inconsistent, or written to push product sales.
          We built CreatineCalc to provide a single, trustworthy resource where anyone can get a
          personalized creatine dose grounded entirely in peer-reviewed sports nutrition research.
        </p>
        <p className="text-gray-700 leading-relaxed">
          We do not sell supplements. We do not accept affiliate commissions from supplement brands.
          Our only interest is accuracy.
        </p>
      </section>

      {/* Scientific Basis */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Scientific Basis</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          All calculator formulas are derived from the{' '}
          <strong>International Society of Sports Nutrition (ISSN) Position Stand on Creatine
          Supplementation</strong> — the most comprehensive and widely cited document in sports
          nutrition science on this topic.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3 text-sm text-gray-700">
          <p className="font-semibold text-gray-900">Primary reference:</p>
          <p className="leading-relaxed">
            Kreider RB, et al. <em>International Society of Sports Nutrition position stand: safety and
            efficacy of creatine supplementation in exercise, sport, and medicine.</em> Journal of the
            International Society of Sports Nutrition. 2017;14:18.
          </p>
          <p className="font-semibold text-gray-900 pt-2">Supporting references include:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Buford TW, et al. ISSN position stand: creatine supplementation and exercise. JISSN. 2007;4:6.</li>
            <li>Hultman E, et al. Muscle creatine loading in men. J Appl Physiol. 1996;81(1):232-237.</li>
            <li>Antonio J, Ciccone V. Pre vs post workout creatine supplementation. JISSN. 2013;10:36.</li>
            <li>Rawson ES, Volek JS. Creatine and resistance training on muscle strength. JSCR. 2003;17(4):822-831.</li>
            <li>Poortmans JR, Francaux M. Long-term creatine does not impair renal function. MSSE. 1999;31(8):1108-1110.</li>
          </ul>
        </div>
      </section>

      {/* Editorial Standards — E-E-A-T */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Editorial Standards</h2>
        <p className="text-gray-700 mb-5 leading-relaxed">
          This site deals with health supplement information — a category where accuracy matters. We
          hold our content to the following standards:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              icon: '📖',
              title: 'Evidence-Based',
              body: 'Every dosage claim, formula, and health statement is backed by a cited, peer-reviewed study. We do not publish claims that lack scientific support.',
            },
            {
              icon: '🔄',
              title: 'Regularly Updated',
              body: 'Articles are reviewed when new research is published. Each page shows its publication and last-updated date so you know how current the information is.',
            },
            {
              icon: '⚖️',
              title: 'No Conflicts of Interest',
              body: 'We have no financial relationships with supplement brands. We receive no affiliate commissions. Our recommendations are entirely independent.',
            },
            {
              icon: '🛡️',
              title: 'YMYL Responsibility',
              body: 'Supplement dosage is a health topic. We treat it with the same care as medical content — with clear disclaimers, cited sources, and conservative recommendations.',
            },
            {
              icon: '✅',
              title: 'Formula Verification',
              body: 'Calculator formulas are verified against the primary ISSN literature. Any goal or activity adjustments are documented in our methodology and cross-checked.',
            },
            {
              icon: '🔍',
              title: 'Transparent Corrections',
              body: 'If an error is identified, we correct it promptly and note the change. Accuracy takes priority over preserving existing content.',
            },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-2xl mb-2">{item.icon}</p>
              <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calculator Methodology */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Calculator Methodology</h2>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Our creatine dosage calculations use the following ISSN-based formulas:
        </p>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5 space-y-3 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white rounded-lg p-4 border border-emerald-100">
              <p className="font-semibold text-gray-900 mb-1">Maintenance Dose</p>
              <p className="font-mono text-emerald-700 text-base">0.03g × bodyweight (kg)</p>
              <p className="text-gray-500 text-xs mt-1">Minimum 3g/day floor</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-emerald-100">
              <p className="font-semibold text-gray-900 mb-1">Loading Phase</p>
              <p className="font-mono text-emerald-700 text-base">0.3g × bodyweight (kg)</p>
              <p className="text-gray-500 text-xs mt-1">Capped at 25g/day, 7 days</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-emerald-100">
              <p className="font-semibold text-gray-900 mb-1">Creatine HCl</p>
              <p className="font-mono text-emerald-700 text-base">0.5× monohydrate dose</p>
              <p className="text-gray-500 text-xs mt-1">Based on absorption ratio</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-emerald-100">
              <p className="font-semibold text-gray-900 mb-1">Water Intake</p>
              <p className="font-mono text-emerald-700 text-base">2500ml + 500ml per 5g</p>
              <p className="text-gray-500 text-xs mt-1">Adjusted for dose size</p>
            </div>
          </div>
          <p className="text-gray-500">Goal and activity level multipliers apply a documented adjustment range of ±15% based on energy expenditure and muscle creatine demand.</p>
        </div>
      </section>

      {/* Who We Cover */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Cover</h2>
        <ul className="space-y-2 text-gray-700">
          {[
            'Creatine Monohydrate — the gold-standard, most researched form',
            'Creatine HCl — smaller dose, better solubility, no loading needed',
            'Micronized Creatine — same formula as monohydrate, finer particle size',
            'Loading phase vs. no-load protocols',
            'Goal-based and activity-level dosage adjustments',
            'Hydration recommendations based on dose size',
            'Safety, side effects, and common myths — with cited evidence',
          ].map((item) => (
            <li key={item} className="flex gap-2">
              <span className="text-emerald-500 font-bold mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Multilingual */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Multilingual Access</h2>
        <p className="text-gray-700 leading-relaxed">
          CreatineCalc is available in 7 languages: English, Spanish, French, German, Portuguese,
          Arabic, and Urdu — with full RTL support for Arabic and Urdu. Accurate health information
          should be accessible regardless of language or geography.
        </p>
      </section>

      {/* Medical Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
        <p className="font-semibold text-amber-800 mb-2">Medical Disclaimer</p>
        <p className="text-amber-700 text-sm leading-relaxed">
          Nothing on this website constitutes medical advice. Creatine supplementation affects
          individuals differently. Always consult a qualified healthcare professional before starting
          any supplement program, particularly if you have pre-existing health conditions, kidney
          disease, or are pregnant or breastfeeding. This site is for informational and educational
          purposes only.
        </p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Link
          href={`/${params.locale}`}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Use the Free Calculator
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
