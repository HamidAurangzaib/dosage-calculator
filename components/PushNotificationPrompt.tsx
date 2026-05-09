'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cc-push-prompt-dismissed';
const DISMISS_DAYS = 30;
const SHOW_DELAY_MS = 30_000;

declare global {
  interface Window {
    OneSignalDeferred?: Array<(os: any) => void>;
  }
}

export default function PushNotificationPrompt() {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissedAt = Number(localStorage.getItem(STORAGE_KEY) || 0);
    const dismissedRecently = dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 86_400_000;
    if (dismissedRecently) return;

    const timer = setTimeout(async () => {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async (OneSignal: any) => {
        try {
          const supported = OneSignal.Notifications?.isPushSupported?.() ?? true;
          if (!supported) return;

          const permission = OneSignal.Notifications?.permission;
          if (permission === true || permission === 'granted') return;

          setVisible(true);
        } catch {
          /* SDK not ready or unsupported — silently skip */
        }
      });
    }, SHOW_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal: any) => {
      try {
        await OneSignal.Notifications.requestPermission();
      } catch (err) {
        console.error('OneSignal permission request failed', err);
      }
    });
    dismiss();
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    dismiss();
  };

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => setVisible(false), 200);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="push-prompt-title"
      className={`fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 transition-all duration-200 ${
        exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p id="push-prompt-title" className="font-semibold text-gray-900 text-sm">
              Get notified of new creatine guides?
            </p>
            <p className="text-gray-600 text-sm mt-1 leading-snug">
              Science-backed updates, ~2–3 per month. No spam — unsubscribe anytime.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleDismiss}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            No thanks
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors"
          >
            Yes, notify me
          </button>
        </div>
      </div>
    </div>
  );
}
