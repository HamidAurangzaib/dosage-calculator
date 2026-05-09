import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Creatine Research & Stats — Key Facts from 30 Years of Science',
    description: 'Key creatine statistics, dosage formulas, and research findings compiled from ISSN guidelines and peer-reviewed studies. Free to reference and share.',
    keywords: ['creatine research', 'creatine statistics', 'creatine facts', 'ISSN creatine guidelines', 'creatine studies'],
    openGraph: {
      title: 'Creatine Research & Stats — Key Facts from 30 Years of Science',
      description: 'Key creatine statistics, dosage formulas, and research findings. Based on ISSN guidelines and peer-reviewed studies.',
      url: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-research`,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-research`,
    },
  };
}

const stats = [
  { number: '500+', label: 'Peer-reviewed studies', detail: 'More studies than any other sports supplement' },
  { number: '30+', label: 'Years of research', detail: 'Continuously studied since the early 1990s' },
  { number: '5–15%', label: 'Strength increase', detail: 'Average improvement vs placebo in resistance training' },
  { number: '1–3 kg', label: 'Lean mass gained', detail: 'Typical first-month gain (includes intramuscular water)' },
  { number: '10–20%', label: 'Performance boost', detail: 'High-intensity exercise capacity improvement' },
  { number: '0.03g/kg', label: 'Maintenance dose', detail: 'ISSN recommended daily dose per kg of body weight' },
];

const formulas = [
  {
    name: 'Maintenance Dose',
    formula: 'bodyweight (kg) × 0.03g',
    example: '80kg → 2.4g/day',
    source: 'ISSN Position Stand, Kreider et al. 2017',
  },
  {
    name: 'Loading Phase',
    formula: 'bodyweight (kg) × 0.3g ÷ 4 doses',
    example: '80kg → 6g × 4/day for 7 days',
    source: 'ISSN Position Stand, Kreider et al. 2017',
  },
  {
    name: 'Creatine HCl Dose',
    formula: 'monohydrate dose × 0.5',
    example: '80kg → ~1.2g/day',
    source: 'Jager et al., Amino Acids 2011',
  },
  {
    name: 'Water Intake',
    formula: '2500ml + (500ml × dose/5g)',
    example: '5g dose → 3000ml/day minimum',
    source: 'Based on ISSN hydration guidance',
  },
];

const keyStudies = [
  {
    citation: 'Kreider RB, et al.',
    journal: 'J Int Soc Sports Nutr. 2017;14:18',
    finding: 'Creatine is the most effective ergogenic nutritional supplement for increasing high-intensity exercise capacity and lean body mass during training.',
  },
  {
    citation: 'Rawson ES, Volek JS.',
    journal: 'J Strength Cond Res. 2003;17(4):822–831',
    finding: 'Creatine supplementation combined with resistance training produces greater muscle strength and weightlifting performance than training alone.',
  },
  {
    citation: 'Lanhers C, et al.',
    journal: 'Sports Med. 2017;47(1):163–173',
    finding: 'Meta-analysis of 22 studies: creatine supplementation significantly improves upper limb strength performance in resistance training.',
  },
  {
    citation: 'Poortmans JR, Francaux M.',
    journal: 'Med Sci Sports Exerc. 1999;31(8):1108–1110',
    finding: 'Long-term creatine supplementation (up to 5 years) does not impair renal function in healthy athletes.',
  },
  {
    citation: 'Antonio J, Ciccone V.',
    journal: 'J Int Soc Sports Nutr. 2013;10:36',
    finding: 'Post-workout creatine supplementation produced greater increases in lean mass and strength than pre-workout timing over 4 weeks.',
  },
  {
    citation: 'Smith-Ryan AE, et al.',
    journal: 'Nutrients. 2021;13(3):877',
    finding: 'Creatine supplementation is safe and beneficial for women across all life stages, including improvements in muscle strength and cognitive function.',
  },
  {
    citation: 'Green AL, et al.',
    journal: 'Am J Physiol. 1996;271(5):E821–826',
    finding: 'Co-ingestion of creatine with carbohydrate increases skeletal muscle creatine accumulation by ~60% compared to creatine alone.',
  },
  {
    citation: 'Hultman E, et al.',
    journal: 'J Appl Physiol. 1996;81(1):232–237',
    finding: 'Loading protocol (20g/day for 6 days) rapidly saturates muscle creatine to the same level as 28 days of low-dose supplementation.',
  },
];

const myths = [
  { myth: 'Creatine damages kidneys', truth: 'No evidence in healthy individuals. Multiple long-term studies confirm renal safety at recommended doses.' },
  { myth: 'Creatine causes hair loss', truth: 'One small study found elevated DHT (not hair loss). No study has ever confirmed creatine causes hair loss.' },
  { myth: 'Creatine is a steroid', truth: 'Creatine is a naturally occurring compound in red meat. It has no hormonal activity and is legal in all sports.' },
  { myth: 'Everyone should take 5g', truth: 'Dose should be based on body weight (0.03g/kg). A 55kg person needs ~1.65g; a 100kg person needs ~3g.' },
  { myth: 'Creatine causes dehydration', truth: 'Studies show creatine may improve hydration. Dehydration risk only exists if water intake is insufficient.' },
  { myth: 'You need to cycle creatine', truth: 'No scientific basis for cycling. Continuous use is safe and maintains consistent muscle saturation.' },
];

export default function CreatineResearchPage({ params }: { params: { locale: string } }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.creatinedosagecalculator.com/${params.locale}` },
              { '@type': 'ListItem', position: 2, name: 'Creatine Research & Stats', item: `https://www.creatinedosagecalculator.com/${params.locale}/creatine-research` },
            ],
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href={`/${params.locale}`} className="hover:text-emerald-600 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-700">Creatine Research & Stats</span>
      </nav>

      {/* Hero */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Creatine Research & Key Statistics
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
          30+ years of peer-reviewed research on creatine supplementation — compiled into one
          reference page. Key studies, proven formulas, and debunked myths.
          Free to cite and share.
        </p>
        <p className="text-sm text-gray-400 mt-3">
          Primary source: Kreider RB, et al. ISSN Position Stand on Creatine Supplementation. J Int Soc Sports Nutr. 2017;14:18.
        </p>
      </div>

      {/* Key stats */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Creatine by the Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.number} className="bg-white border border-gray-200 rounded-xl p-5 text-center">
              <p className="text-4xl font-extrabold text-emerald-600 mb-1">{s.number}</p>
              <p className="font-semibold text-gray-900 text-sm mb-1">{s.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{s.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formulas */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">ISSN-Based Dosage Formulas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {formulas.map((f) => (
            <div key={f.name} className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
              <p className="font-bold text-gray-900 mb-2">{f.name}</p>
              <p className="font-mono text-emerald-700 text-lg mb-1">{f.formula}</p>
              <p className="text-sm text-gray-600 mb-2">Example: <strong>{f.example}</strong></p>
              <p className="text-xs text-gray-400">Source: {f.source}</p>
            </div>
          ))}
        </div>
        <div className="mt-5 text-center">
          <Link
            href={`/${params.locale}`}
            className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
          >
            Calculate Your Personalized Dose →
          </Link>
        </div>
      </section>

      {/* Key Studies */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Key Research Findings</h2>
        <p className="text-gray-600 mb-6">Summaries of landmark peer-reviewed studies on creatine supplementation.</p>
        <div className="space-y-4">
          {keyStudies.map((study, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4">
              <span className="text-emerald-600 font-bold text-lg shrink-0">[{i + 1}]</span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{study.citation} <span className="font-normal text-gray-500">{study.journal}</span></p>
                <p className="text-gray-700 text-sm mt-1 leading-relaxed">{study.finding}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Myths vs Facts */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Myths — Debunked by Research</h2>
        <div className="space-y-3">
          {myths.map((item) => (
            <div key={item.myth} className="bg-white border border-gray-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <span className="text-red-500 font-bold text-lg shrink-0">✗</span>
                <div>
                  <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-0.5">Myth</p>
                  <p className="font-medium text-gray-900">{item.myth}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold text-lg shrink-0">✓</span>
                <div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">Fact</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.truth}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="mb-14">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Creatine Forms — Quick Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-emerald-600 text-white">
                <th className="p-3 text-left">Form</th>
                <th className="p-3 text-left">Daily Dose</th>
                <th className="p-3 text-left">Loading Phase</th>
                <th className="p-3 text-left">Research Level</th>
                <th className="p-3 text-left">Cost</th>
                <th className="p-3 text-left">Best For</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Monohydrate', '3–5g (0.03g/kg)', 'Optional', 'Extensive (30+ yrs)', 'Lowest', 'Most people'],
                ['Micronized', '3–5g (0.03g/kg)', 'Optional', 'Same molecule as mono', 'Low', 'Sensitive stomachs'],
                ['Creatine HCl', '1–2g (0.015g/kg)', 'Not needed', 'Growing', 'Moderate', 'Low GI tolerance'],
                ['Buffered (Kre-Alkalyn)', '3–5g', 'Not needed', 'Limited', 'High', 'No proven advantage'],
              ].map(([form, dose, loading, research, cost, bestFor], i) => (
                <tr key={form} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-semibold text-gray-800 border-b border-gray-100">{form}</td>
                  <td className="p-3 text-gray-600 border-b border-gray-100">{dose}</td>
                  <td className="p-3 text-gray-600 border-b border-gray-100">{loading}</td>
                  <td className="p-3 text-gray-600 border-b border-gray-100">{research}</td>
                  <td className="p-3 text-gray-600 border-b border-gray-100">{cost}</td>
                  <td className="p-3 text-gray-600 border-b border-gray-100">{bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Free to use notice */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-10 text-center">
        <p className="font-bold text-gray-900 text-lg mb-2">Free to Reference & Share</p>
        <p className="text-gray-600 mb-4 max-w-xl mx-auto">
          Bloggers, fitness coaches, and content creators are welcome to reference this page.
          If you find it useful, a link back is appreciated but not required.
        </p>
        <p className="text-sm text-gray-500">
          Suggested citation: <span className="font-mono bg-white px-2 py-1 rounded border border-gray-200">CreatineCalc Research Page — creatinedosagecalculator.com/en/creatine-research</span>
        </p>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link href={`/${params.locale}`} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all text-center">
          <p className="text-2xl mb-2">💊</p>
          <p className="font-bold text-gray-900 group-hover:text-emerald-700 mb-1">Creatine Dosage Calculator</p>
          <p className="text-sm text-gray-600">Get your personalized daily dose</p>
        </Link>
        <Link href={`/${params.locale}/creatine-hcl-calculator`} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all text-center">
          <p className="text-2xl mb-2">🔬</p>
          <p className="font-bold text-gray-900 group-hover:text-emerald-700 mb-1">Creatine HCl Calculator</p>
          <p className="text-sm text-gray-600">Lower dose, no loading phase</p>
        </Link>
        <Link href={`/${params.locale}/creatine-guide`} className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-md transition-all text-center">
          <p className="text-2xl mb-2">📚</p>
          <p className="font-bold text-gray-900 group-hover:text-emerald-700 mb-1">Complete Creatine Guide</p>
          <p className="text-sm text-gray-600">All articles in one place</p>
        </Link>
      </div>
    </div>
  );
}
