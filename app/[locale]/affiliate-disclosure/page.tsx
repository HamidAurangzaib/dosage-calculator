import type { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Affiliate Disclosure — CreatineCalc',
    description:
      'How CreatineCalc uses affiliate links, including the Amazon Associates program. Our editorial independence and recommendation standards explained.',
    alternates: {
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}/affiliate-disclosure`,
    },
  };
}

export default function AffiliateDisclosurePage({ params }: { params: { locale: string } }) {
  const lastUpdated = 'May 21, 2026';

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
              { '@type': 'ListItem', position: 2, name: 'Affiliate Disclosure', item: `https://www.creatinedosagecalculator.com/${params.locale}/affiliate-disclosure` },
            ],
          }),
        }}
      />

      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Affiliate Disclosure</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900">Amazon Associates Program</h2>
          <p>
            CreatineCalc is a participant in the Amazon Services LLC Associates Program, an affiliate
            advertising program designed to provide a means for sites to earn advertising fees by
            advertising and linking to Amazon.com and affiliated sites.
          </p>
          <p>
            As an Amazon Associate, we earn from qualifying purchases. When you click an affiliate
            link on our site and make a purchase, we may receive a small commission —{' '}
            <strong>at no additional cost to you</strong>. The price you pay is exactly the same
            whether you use our link or not.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Our Editorial Independence</h2>
          <p>
            Affiliate commissions do not influence our recommendations. We recommend products based
            on ingredient quality, scientific evidence, value for money, and suitability for the
            reader&apos;s goal — never based on which product pays the highest commission.
          </p>
          <p>
            Our creatine dosage calculator and educational articles remain free and are grounded in
            the{' '}
            <strong>ISSN Position Stand on Creatine Supplementation</strong> and peer-reviewed
            research. We do not accept payment from supplement brands to feature their products
            favorably.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">How to Identify Affiliate Links</h2>
          <p>
            Articles containing affiliate links display a clear disclosure notice near the top.
            Affiliate links typically appear as &quot;Check Price on Amazon&quot; buttons or
            product recommendations. All affiliate links use the appropriate{' '}
            <code>rel=&quot;sponsored&quot;</code> attribute as required by search engine guidelines.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Not Medical Advice</h2>
          <p>
            Product recommendations are not medical advice. Always consult a qualified healthcare
            professional before starting any supplement, especially if you have a pre-existing
            health condition, kidney concerns, or are pregnant or breastfeeding.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">Questions?</h2>
          <p>
            If you have any questions about our affiliate relationships, please{' '}
            <Link href={`/${params.locale}/contact`} className="text-emerald-600 hover:underline">
              contact us
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
