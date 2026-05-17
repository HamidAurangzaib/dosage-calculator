'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cc-cookie-consent';
type Decision = 'accepted' | 'declined';

interface StoredConsent {
  decision: Decision;
  timestamp: number;
}

export default function CookieConsent({ locale }: { locale: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredConsent;
        // Reshow after 365 days (regulatory best practice)
        if (Date.now() - parsed.timestamp < 365 * 86_400_000) return;
      }
    } catch {
      /* corrupted localStorage — show banner */
    }
    setVisible(true);
  }, []);

  const store = (decision: Decision) => {
    try {
      const payload: StoredConsent = { decision, timestamp: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* localStorage unavailable — silently continue */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4 animate-in slide-in-from-bottom duration-300"
    >
      <div className="mx-auto max-w-5xl bg-white border border-gray-200 rounded-2xl shadow-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p id="cookie-consent-title" className="font-semibold text-gray-900 text-sm sm:text-base mb-1">
              🍪 We use cookies
            </p>
            <p id="cookie-consent-desc" className="text-gray-600 text-sm leading-relaxed">
              We use cookies to analyze traffic, improve your experience, and serve relevant ads
              (Google AdSense, Google Analytics). You can accept or decline non-essential cookies.{' '}
              <Link
                href={`/${locale}/privacy-policy`}
                className="text-emerald-600 hover:text-emerald-700 font-medium underline underline-offset-2"
              >
                Read our privacy policy
              </Link>
              .
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => store('declined')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
            >
              Decline
            </button>
            <button
              onClick={() => store('accepted')}
              className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors whitespace-nowrap"
            >
              Accept all
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
