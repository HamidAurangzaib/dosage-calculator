import Image from 'next/image';
import type { Product } from '@/lib/blog';

const AFFILIATE_REL = 'sponsored nofollow noopener';

function Stars({ rating }: { rating?: number }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-1 text-sm">
      <span className="text-amber-500" aria-hidden>
        {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      </span>
      <span className="text-gray-600 font-medium">{rating.toFixed(1)}</span>
    </span>
  );
}

function BuyButton({ link, label = 'Check Price on Amazon' }: { link: string; label?: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel={AFFILIATE_REL}
      className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm whitespace-nowrap"
    >
      {label}
      <span aria-hidden>→</span>
    </a>
  );
}

function ProductImage({ product }: { product: Product }) {
  if (product.image) {
    return (
      <Image
        src={product.image}
        alt={product.name}
        width={160}
        height={160}
        className="object-contain rounded-lg bg-white"
      />
    );
  }
  // Clean branded placeholder when no compliant image is available yet
  return (
    <div className="w-[160px] h-[160px] rounded-lg bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-100 flex flex-col items-center justify-center text-center p-3">
      <span className="text-3xl mb-1">💪</span>
      <span className="text-xs font-semibold text-emerald-800 leading-tight">{product.bestFor}</span>
    </div>
  );
}

export default function ProductCards({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  return (
    <div className="not-prose my-10">
      {/* ─── Comparison table ─── */}
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Comparison</h2>
      <div className="overflow-x-auto mb-12 rounded-xl border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-emerald-600 text-white text-left">
              <th className="p-3 font-semibold">Product</th>
              <th className="p-3 font-semibold">Best For</th>
              <th className="p-3 font-semibold">Form</th>
              <th className="p-3 font-semibold">Rating</th>
              <th className="p-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 font-semibold text-gray-900 align-middle">{p.name}</td>
                <td className="p-3 text-gray-700 align-middle">{p.bestFor}</td>
                <td className="p-3 text-gray-600 align-middle">{p.form}</td>
                <td className="p-3 align-middle"><Stars rating={p.rating} /></td>
                <td className="p-3 align-middle">
                  <a href={p.link} target="_blank" rel={AFFILIATE_REL}
                     className="text-emerald-700 font-semibold hover:underline whitespace-nowrap">
                    Check Price →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Detailed cards ─── */}
      <div className="space-y-6">
        {products.map((p, i) => (
          <div key={i} className="border border-gray-200 rounded-2xl p-5 sm:p-6 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="shrink-0 mx-auto sm:mx-0 relative">
                <span className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center shadow">
                  {i + 1}
                </span>
                <ProductImage product={p} />
              </div>

              <div className="flex-1 min-w-0">
                <span className="inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                  {p.bestFor}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-1">{p.name}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-3">
                  <Stars rating={p.rating} />
                  {p.reviews && <span>{p.reviews.toLocaleString()} reviews</span>}
                  {p.form && <span>· {p.form}</span>}
                  {p.servings && <span>· {p.servings}</span>}
                  {p.dose && <span>· {p.dose}</span>}
                </div>

                <ul className="space-y-1 mb-4">
                  {p.highlights.map((h, j) => (
                    <li key={j} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-emerald-500 font-bold shrink-0">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                <BuyButton link={p.link} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
