interface FAQItem {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  locale?: string;
  faqItems?: FAQItem[];
  includeFAQ?: boolean;
  includeApp?: boolean;
}

export default function StructuredData({
  faqItems = [],
  includeFAQ = false,
  includeApp = false,
}: StructuredDataProps) {
  const baseUrl = 'https://www.creatinecalc.com';

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CreatineCalc',
    url: baseUrl,
    description: 'Free creatine dosage calculator based on body weight and fitness goals',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/en?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Creatine Dosage Calculator',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Calculate your personalized daily creatine dose based on body weight, fitness goal, and activity level.',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {includeFAQ && faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {includeApp && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
        />
      )}
    </>
  );
}
