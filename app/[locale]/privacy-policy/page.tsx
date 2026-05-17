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
      canonical: `https://www.creatinedosagecalculator.com/${params.locale}/privacy-policy`,
    },
  };
}

export default function PrivacyPolicyPage() {
  const lastUpdated = 'May 11, 2026';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last updated: {lastUpdated}</p>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-bold text-gray-900">1. Introduction</h2>
          <p>
            CreatineCalc (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website
            www.creatinedosagecalculator.com. This Privacy Policy explains how we collect, use, and protect
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
          <h2 className="text-xl font-bold text-gray-900">3. Google AdSense &amp; DoubleClick</h2>
          <p>
            This website uses <strong>Google AdSense</strong> and the <strong>Google DoubleClick
            DART cookie</strong>, third-party advertising services provided by Google LLC. These
            services use cookies and similar identifiers to serve ads to you based on your prior
            visits to this site and other websites on the internet.
          </p>
          <p className="mt-2">
            Google&apos;s use of the DART cookie enables it and its partners to serve personalized
            advertising. We do not have access to or control over these cookies. You can opt out of
            personalized advertising at any time by visiting{' '}
            <a
              href="https://www.google.com/settings/ads"
              className="text-emerald-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            {' '}or by managing your preferences at{' '}
            <a
              href="https://www.aboutads.info/choices/"
              className="text-emerald-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              aboutads.info/choices
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
              Google&apos;s Privacy &amp; Terms
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
          <h2 className="text-xl font-bold text-gray-900">7. California Privacy Rights (CCPA)</h2>
          <p>
            If you are a California resident, the California Consumer Privacy Act (CCPA) provides
            you with the following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>The right to know what personal information we collect, use, and share</li>
            <li>The right to request deletion of your personal information</li>
            <li>The right to opt out of the sale or sharing of your personal information</li>
            <li>The right to non-discrimination for exercising your CCPA rights</li>
          </ul>
          <p className="mt-2">
            We do not sell your personal information. To exercise your CCPA rights, contact us at
            the email address below. We will respond within 45 days as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">8. Cookie Consent &amp; Withdrawal</h2>
          <p>
            When you first visit our site, you are shown a cookie consent banner asking you to
            accept or decline non-essential cookies (advertising and analytics). Your choice is
            stored locally in your browser for up to 12 months, after which you will be asked again.
          </p>
          <p className="mt-2">
            You can withdraw your consent at any time by:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Clearing your browser&apos;s cookies and site data for this website</li>
            <li>Using your browser&apos;s &quot;Do Not Track&quot; setting</li>
            <li>Installing the{' '}
              <a
                href="https://tools.google.com/dlpage/gaoptout"
                className="text-emerald-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >Google Analytics Opt-out Browser Add-on</a>
            </li>
            <li>Adjusting your{' '}
              <a
                href="https://www.google.com/settings/ads"
                className="text-emerald-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >Google Ads Settings</a>{' '}to opt out of personalized advertising
            </li>
          </ul>
          <p className="mt-2">
            Withdrawing consent will not affect the lawfulness of any data processing carried out
            before your withdrawal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party sites. We are not responsible for the
            privacy practices of those sites and encourage you to review their privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">10. Children&apos;s Privacy</h2>
          <p>
            Our website is not directed at children under 13. We do not knowingly collect personal
            information from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Changes will be posted on this
            page with an updated &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900">12. Contact</h2>
          <p>
            For any privacy-related requests or questions, please contact us at:{' '}
            <strong>privacy@creatinedosagecalculator.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
