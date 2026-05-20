// OneSignal push handling
importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");

// NOTE: This worker intentionally has NO fetch handler.
// A previous version added a fetch/caching handler for PWA offline support,
// but a service worker fetch handler causes Chrome to route cross-origin
// no-cors scripts (e.g. Google Analytics gtag.js) through the worker, which
// triggers ERR_BLOCKED_BY_ORB and silently breaks analytics. Modern Chrome
// (117+) makes PWAs installable from the manifest alone — no fetch handler
// required — so we drop offline caching to keep GA working.

// One-time cleanup of caches created by the old fetch-handler version.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
  );
});
