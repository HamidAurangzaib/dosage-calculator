// OneSignal push handling (must stay first)
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// ─── PWA support ────────────────────────────────────────────────────────
// A single service worker controls a page, so PWA fetch handling lives here
// alongside OneSignal's push handling. Strategy: network-first (always serve
// fresh content from Vercel) with a cache fallback only when offline.

const CACHE = "creatinecalc-v1";

self.addEventListener("activate", (event) => {
  // Clean up old cache versions on activation
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Only handle same-origin requests — never interfere with OneSignal, Ezoic,
  // Google Analytics, or AdSense cross-origin calls.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE).then((c) => c.put(req, clone)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(req))
  );
});
