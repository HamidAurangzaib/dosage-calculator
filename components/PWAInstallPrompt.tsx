'use client';

import { useEffect, useState } from 'react';

const DISMISS_KEY = 'cc-pwa-install-dismissed';
const DISMISS_DAYS = 14;
const SHOW_DELAY_MS = 20_000;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // 1. Register the service worker (independent of OneSignal) so the app is
  //    installable even before the user opts into push notifications.
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/OneSignalSDKWorker.js').catch(() => {
      /* registration may already exist via OneSignal — safe to ignore */
    });
  }, []);

  // 2. Capture the install prompt (Chrome/Edge/Android) or detect iOS Safari.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Already installed? Don't show anything.
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    // Respect a recent dismissal
    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86_400_000) return;

    // iOS Safari doesn't fire beforeinstallprompt — detect to show manual steps
    const ua = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipad|ipod/.test(ua) && !(window as Window & { MSStream?: unknown }).MSStream;
    const isSafari = /safari/.test(ua) && !/crios|fxios|edgios/.test(ua);

    if (iOS && isSafari) {
      setIsIOS(true);
      const t = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted' || outcome === 'dismissed') {
      setDeferredPrompt(null);
      setVisible(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-install-title"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[55]"
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-5">
        <div className="flex items-start gap-3 mb-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon-192.png" alt="CreatineCalc" width={44} height={44} className="rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <p id="pwa-install-title" className="font-semibold text-gray-900 text-sm">
              Add CreatineCalc to your home screen
            </p>
            <p className="text-gray-600 text-sm mt-0.5 leading-snug">
              {isIOS
                ? 'Tap the Share button, then "Add to Home Screen" for one-tap access.'
                : 'Install the app for instant access — no app store, works offline.'}
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Not now
          </button>
          {!isIOS && (
            <button
              onClick={handleInstall}
              className="px-4 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
            >
              Install app
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
