import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Privacy Policy — CreatineCalc',
    description: 'Privacy policy for CreatineCalc. Learn how we collect and use data, including AdSense and Analytics disclosures.',
    alternates: {
      canonical: `https://www.creatinecalc.com/${params.locale}/privacy-policy`,
    },
  };
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'March 29, 2026';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900">1. Introduction</h2>
          <p>
            CreatineCalc (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website
            www.creatinecalc.com. This Privacy Policy explains how we collect, use, and protect
            your information when you use our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">2. Data We Collect</h2>
          <p>We collect the following types of data:</p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Contact form submissions:</strong> When you submit our contact form, we
              collect your name, email address, and message. This data is used solely to respond
              to your inquiry and is not shared with third parties.
            </li>
            <li>
              <strong>Usage data:</strong> We may collect anonymized data about how you use our
              website (pages visited, time spent, referring site) through analytics tools.
            </li>
            <li>
              <strong>Calculator inputs:</strong> We do not store any body weight or personal
              fitness data you enter into our calculator. All calculations are performed locally
              in your browser.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">3. Google AdSense</h2>
          <p>
            This website uses <strong>Google AdSense</strong>, a third-party advertising service
            provided by Google LLC. Google AdSense uses cookies to serve ads based on your prior
            visits to this or other websites.
          </p>
          <p className="mt-2">
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based
            on your visit to this site and/or other sites on the internet. You can opt out of
            personalized advertising by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              className="text-emerald-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            .
          </p>
          <p className="mt-2">
            For more information about how Google uses data when you use our site, visit:{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              className="text-emerald-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Privacy & Terms
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">4. Google Analytics</h2>
          <p>
            We may use <strong>Google Analytics 4</strong> to understand how visitors interact with
            our site. Google Analytics collects information such as your IP address (anonymized),
            browser type, pages visited, and time on site. This data is aggregated and does not
            personally identify you.
          </p>
          <p className="mt-2">
            You can opt out of Google Analytics tracking by installing the{' '}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="text-emerald-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">5. Cookies</h2>
          <p>
            Our website uses cookies for the following purposes:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>
              <strong>Advertising cookies (Google AdSense):</strong> Used to serve relevant
              advertisements.
            </li>
            <li>
              <strong>Analytics cookies (Google Analytics):</strong> Used to understand site usage.
            </li>
            <li>
              <strong>Preference cookies:</strong> Used to remember your language preference.
            </li>
          </ul>
          <p className="mt-2">
            You can control cookies through your browser settings. Disabling cookies may affect some
            functionality on this site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">6. Your Rights (GDPR)</h2>
          <p>
            If you are located in the European Economic Area (EEA), you have the following rights
            regarding your personal data:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>The right to access your personal data</li>
            <li>The right to correct inaccurate data</li>
            <li>The right to request deletion of your data</li>
            <li>The right to object to processing of your data</li>
            <li>The right to data portability</li>
          </ul>
          <p className="mt-2">
            To exercise any of these rights, please contact us using the email below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">7. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party sites. We are not responsible for the
            privacy practices of those sites and encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">8. Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under 13. We do not knowingly collect personal
            information from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">10. Contact</h2>
          <p>
            For any privacy-related requests or questions, please contact us at:{' '}
            <strong>privacy@creatinecalc.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
