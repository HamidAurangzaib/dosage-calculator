import Link from 'next/link';

/**
 * FTC + Amazon-required affiliate disclosure banner.
 * Render near the top of any article/page that contains affiliate links.
 */
export default function AffiliateDisclosure({ locale = 'en' }: { locale?: string }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8 text-sm text-blue-900">
      <p>
        <strong>Affiliate disclosure:</strong> This article contains affiliate links. As an Amazon
        Associate we earn from qualifying purchases — at no extra cost to you. We only recommend
        products we believe are genuinely useful, and our recommendations are based on ingredient
        quality and value, not commission.{' '}
        <Link
          href={`/${locale}/affiliate-disclosure`}
          className="underline font-medium hover:text-blue-700"
        >
          Learn more
        </Link>
        .
      </p>
    </div>
  );
}
